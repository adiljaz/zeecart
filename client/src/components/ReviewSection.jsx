import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import StarRatings from 'react-star-ratings';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/api/reviews/${productId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await api.post(`/api/reviews/${productId}`, {
        rating: formData.rating,
        comment: formData.comment,
      });

      toast.success('Review submitted! It will appear after admin approval.');
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);

      // Refresh reviews
      const updated = await api.get(`/api/reviews/${productId}`);
      setReviews(updated.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair mb-8">Customer Reviews</h2>

      {/* Review Stats */}
      {reviews.length > 0 && (
        <div className="glass rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-3xl font-playfair text-accent-gold">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <StarRatings
                rating={reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length}
                starDimension="24px"
                starSpacing="2px"
                starRatedColor="#C9A84C"
              />
            </div>
            <span className="text-gray-400">Based on {reviews.length} reviews</span>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-8 bg-accent-gold text-primary-bg px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
      >
        {showForm ? 'Cancel' : 'Write a Review'}
      </button>

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitReview}
          className="glass rounded-lg p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Rating</label>
            <div className="flex items-center gap-2">
              <StarRatings
                rating={formData.rating}
                starRatedColor="#C9A84C"
                starDimension="28px"
                starSpacing="2px"
                changeRating={(rating) => setFormData({ ...formData, rating })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience..."
              className="w-full bg-card-bg px-4 py-3 rounded-lg text-text-white placeholder-gray-500 border border-accent-gold/20 focus:outline-none focus:border-accent-gold"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-accent-gold text-primary-bg px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Submit Review
          </button>
        </motion.form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card-bg rounded-lg h-24 animate-pulse"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass rounded-lg p-8 text-center">
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <StarRatings
                    rating={review.rating}
                    starDimension="16px"
                    starSpacing="1px"
                    starRatedColor="#C9A84C"
                  />
                  <span className="font-semibold">{review.rating}.0</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
