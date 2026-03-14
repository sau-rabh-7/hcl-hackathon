import express from 'express';
import {
  createProduct,
  getProducts,
  getAdminProducts,
  searchProducts,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController.js';
import { protect } from '../middlewares/auth.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const router = express.Router();

router.route('/')
  .post(protect, adminOnly, createProduct)
  .get(getProducts);

router.get('/search', searchProducts);
router.get('/admin/all', protect, adminOnly, getAdminProducts);

router.route('/:id')
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.put('/:id/stock', protect, adminOnly, updateStock);

export default router;
