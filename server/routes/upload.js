import express from 'express';
import upload from '../middleware/upload.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/', verifyAdmin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    }));

    res.json({ message: 'Files uploaded successfully', files });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
