import express from 'express';
import { createRazorpayOrder, verifyPaymentAndCreateOrder, getOrderHistory } from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPaymentAndCreateOrder);
router.get('/history', protect, getOrderHistory);

export default router;
