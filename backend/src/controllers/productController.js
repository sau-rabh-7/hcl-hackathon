import Product from '../models/Product.js';
import StockLedger from '../models/StockLedger.js';

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { categoryId, title, description, cost, taxPercentage, imageUrl, stockQuantity, isCombo, addons } = req.body;

    const product = await Product.create({
      categoryId,
      title,
      description,
      cost,
      taxPercentage: taxPercentage || 0,
      imageUrl,
      stockQuantity,
      isCombo: isCombo || false,
      addons: addons || [],
    });

    if (stockQuantity > 0) {
      await StockLedger.create({
        productId: product._id,
        changeAmount: stockQuantity,
        reason: 'Initial Stock Deposit',
        performedBy: req.user._id,
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error creating product' });
  }
};

// @desc    Get all products (paginated)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .populate('categoryId', 'name')
      .populate('addons')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({});

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error fetching products' });
  }
};

// @desc    Search products
// @route   GET /api/products/search
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Search query parameter "q" is required' });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).populate('addons');

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error searching products' });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
export const updateStock = async (req, res) => {
  try {
    const { changeAmount, reason } = req.body;
    const productId = req.params.id;

    if (!changeAmount || !reason) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Please provide changeAmount and reason' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
    }

    const newStock = product.stockQuantity + Number(changeAmount);
    if (newStock < 0) {
      return res.status(400).json({ error: 'INSUFFICIENT_STOCK', message: 'Stock cannot be negative' });
    }

    // Atomic update
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { stockQuantity: Number(changeAmount) } },
      { new: true, runValidators: true }
    );

    // Create ledger entry
    await StockLedger.create({
      productId,
      changeAmount: Number(changeAmount),
      reason,
      performedBy: req.user._id,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error updating stock' });
  }
};
