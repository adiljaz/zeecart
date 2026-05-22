import express from 'express';
import Category from '../models/Category.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, gender, subcategories, requiresSize } = req.body;

    const category = new Category({
      name,
      gender,
      subcategories: subcategories || [],
      requiresSize: requiresSize || false,
    });

    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, gender, subcategories, requiresSize } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, gender, subcategories, requiresSize },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
