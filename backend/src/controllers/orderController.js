import Order from '../models/Order.js';
import Product from '../models/Product.js';
import StockLedger from '../models/StockLedger.js';

// @desc    Place a mock order (no payment gateway)
// @route   POST /api/orders/place
export const createMockOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'No order items provided' });
    }

    // 1. Verify stock availability for all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: 'NOT_FOUND', message: `Product ${item.productId} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          error: 'INSUFFICIENT_STOCK',
          message: `Insufficient stock for "${product.title}". Only ${product.stockQuantity} left.`,
        });
      }
    }

    // 2. Create Order with status Paid (mock payment always succeeds)
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      status: 'Paid',
    });

    // 3. Reduce stock and log ledger for each item
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

    res.status(201).json({ success: true, orderId: order._id, message: 'Order placed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error placing order' });
  }
};

// @desc    Get current user's order history
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

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'title imageUrl cost')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error fetching all orders' });
  }
};
