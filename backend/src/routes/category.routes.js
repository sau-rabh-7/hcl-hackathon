import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory, getCategoryProducts } from '../controllers/categoryController.js';
import { protect } from '../middlewares/auth.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const router = express.Router();

router.route('/')
  .post(protect, adminOnly, createCategory)
  .get(getCategories);

router.get('/:id/products', getCategoryProducts);

router.route('/:id')
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

export default router;
