import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      required: true,
    },
    subcategories: [
      {
        type: String,
      },
    ],
    requiresSize: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);
