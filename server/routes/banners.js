import express from 'express';
import Banner from '../models/Banner.js';

const router = express.Router();

// Get all active banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all banners
router.get('/admin', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create banner
router.post('/', async (req, res) => {
  const banner = new Banner(req.body);
  try {
    const newBanner = await banner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update banner
router.put('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete banner
router.delete('/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
