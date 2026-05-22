import express from 'express';
import upload from '../middleware/upload.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/', verifyAdmin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map((file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return {
        filename: file.originalname,
        url: dataURI,
      };
    });

    res.json({ message: 'Files uploaded successfully', files });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
