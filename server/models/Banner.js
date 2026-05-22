import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    default: 'Shop Now',
  },
  link: {
    type: String,
    default: '/products',
  },
  area: {
    type: String,
    enum: ['hero', 'kids', 'men', 'women', 'category-strip', 'highlight'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
