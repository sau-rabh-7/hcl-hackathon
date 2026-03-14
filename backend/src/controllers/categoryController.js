import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Create a category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description, logoUrl } = req.body;

    if (!name || !description || !logoUrl) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Please provide name, description, and logoUrl' });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ error: 'CATEGORY_EXISTS', message: 'Category already exists' });
    }

    const category = await Category.create({ name, description, logoUrl });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error creating category' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error fetching categories' });
  }
};

// @desc    Get products by category ID
// @route   GET /api/categories/:id/products
export const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ categoryId: id }).skip(skip).limit(limit).populate('addons');
    const total = await Product.countDocuments({ categoryId: id });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error fetching category products' });
  }
};
