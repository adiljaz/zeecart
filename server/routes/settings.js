import express from 'express';
import Settings from '../models/Settings.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings (admin only)
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const { whatsappNumber, storeName, storeEmail } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    Object.assign(settings, {
      whatsappNumber,
      storeName,
      storeEmail,
    });

    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
