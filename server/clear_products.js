import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart')
  .then(async () => {
    const result = await Product.deleteMany({});
    console.log('Deleted products:', result.deletedCount);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
