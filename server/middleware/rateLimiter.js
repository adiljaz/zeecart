import rateLimit from 'express-rate-limit';

export const createReviewLimiter = (windowMs = 24 * 60 * 60 * 1000, max = 1) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      return `${req.clientIp}-${req.params.productId}`;
    },
    message: 'You have already submitted a review for this product. Please try again later.',
    standardHeaders: false,
    legacyHeaders: false,
  });
};

export default createReviewLimiter;
