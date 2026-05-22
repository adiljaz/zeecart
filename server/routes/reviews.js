import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import getClientIp from '../middleware/getClientIp.js';
import createReviewLimiter from '../middleware/rateLimiter.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      approved: true,
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a review (with rate limiting by IP and product)
router.post('/:productId', createReviewLimiter(), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const ip = getClientIp(req);

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Create review
    const review = new Review({
      productId: req.params.productId,
      rating,
      comment,
      ip,
      approved: false, // Require admin approval
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({
      productId: req.params.productId,
      approved: true,
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(req.params.productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.status(201).json({ message: 'Review submitted. Awaiting approval.', review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete review (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Recalculate product rating
    const productId = review.productId;
    const reviews = await Review.find({
      productId,
      approved: true,
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve review (admin only)
router.put('/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Recalculate product rating
    const productId = review.productId;
    const reviews = await Review.find({
      productId,
      approved: true,
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
