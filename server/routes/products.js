import express from 'express';
import Product from '../models/Product.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, gender, minPrice, maxPrice, sort, page = 1, limit = 12, isTrending, isBestSeller, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (isTrending === 'true') query.isTrending = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (gender) {
      if (gender === 'unisex') {
        query.gender = 'unisex';
      } else {
        query.gender = { $in: [gender, 'unisex'] };
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    let products = await Product.find({ isFeatured: true }).limit(6);
    if (products.length === 0) {
      products = await Product.find().sort({ createdAt: -1 }).limit(6);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Product upload request received. Files:', req.files?.length || 0);
    const {
      name,
      description,
      price,
      discountedPrice,
      category,
      subcategory,
      gender,
      sizes,
      stock,
      is360View,
      isFeatured,
      isTrending,
      isBestSeller,
    } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    } else if (req.body.images) {
      images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
    }

    const product = new Product({
      name,
      description,
      price,
      discountedPrice: discountedPrice || null,
      category,
      subcategory,
      gender,
      sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [],
      stock,
      images,
      is360View: is360View === 'true' || is360View === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isTrending: isTrending === 'true' || isTrending === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      category,
      subcategory,
      gender,
      sizes,
      stock,
      is360View,
      isFeatured,
      isTrending,
      isBestSeller,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let images = product.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    } else if (req.body.images) {
      images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
    }

    Object.assign(product, {
      name,
      description,
      price,
      discountedPrice: discountedPrice || null,
      category,
      subcategory,
      gender,
      sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : product.sizes,
      stock,
      images,
      is360View: is360View === 'true' || is360View === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isTrending: isTrending === 'true' || isTrending === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    });

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
