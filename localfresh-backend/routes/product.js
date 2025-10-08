// backend/routes/product.js

const router = require('express').Router();
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products from MongoDB
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Add a new product (for admin use)
// @route   POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

