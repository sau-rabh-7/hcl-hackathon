import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import StockLedger from '../models/StockLedger.js';
import { sendOrderConfirmation } from '../utils/emailNotification.js';

// Init Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create a new Razorpay Order ID for checkout
// @route   POST /api/orders/create-razorpay-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount should be in INR rupees

    if (!amount) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: 'RAZORPAY_ERROR', message: 'Some error occurred with Razorpay' });
    }

    res.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message || 'Server Error generating Razorpay Order' });
  }
};

// @desc    Verify Razorpay payment, create our Order, reduce stock
// @route   POST /api/orders/verify-payment
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const { orderDetails, paymentDto } = req.body;
    // paymentDto contains razorpay_order_id, razorpay_payment_id, razorpay_signature
    // orderDetails contains items and totalAmount from cart

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDto;

    // Verify Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid payment signature' });
    }

    // Process Order Creation & Stock Reduction
    const { items, totalAmount } = orderDetails;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'No order items' });
    }

    // 1. Verify Stock Availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: 'NOT_FOUND', message: `Product ${item.productId} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: 'INSUFFICIENT_STOCK', message: `Insufficient stock for product: ${product.title}` });
      }
    }

    // 2. Create Order
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      status: 'Paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // 3. Atomically reduce stock and log ledger
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      );

      await StockLedger.create({
        productId: item.productId,
        changeAmount: -item.quantity,
        reason: `Order Sale #${order._id}`,
        performedBy: req.user._id,
      });
    }

    // 4. Send Mock Email
    sendOrderConfirmation(req.user.email, order);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error verifying payment' });
  }
};

// @desc    Get user's order history
// @route   GET /api/orders/history
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'title imageUrl cost')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error fetching order history' });
  }
};
