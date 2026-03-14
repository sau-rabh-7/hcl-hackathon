import express from 'express';
import { createMockOrder, getOrderHistory, getAllOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const router = express.Router();

router.post('/place', protect, createMockOrder);
router.get('/history', protect, getOrderHistory);
router.get('/admin/all', protect, adminOnly, getAllOrders);

export default router;
