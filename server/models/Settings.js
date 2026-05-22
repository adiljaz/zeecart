import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      default: '+1234567890',
    },
    storeName: {
      type: String,
      default: 'ZeeCart',
    },
    storeEmail: {
      type: String,
      default: 'info@zeecart.com',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', SettingsSchema);
