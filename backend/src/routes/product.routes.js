import express from 'express';
import { createProduct, getProducts, searchProducts, updateStock } from '../controllers/productController.js';
import { protect } from '../middlewares/auth.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const router = express.Router();

router.route('/')
  .post(protect, adminOnly, createProduct)
  .get(getProducts);

router.get('/search', searchProducts);

router.put('/:id/stock', protect, adminOnly, updateStock);

export default router;
