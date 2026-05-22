import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://adiljaseem:adiljaz@cluster0.pvnidcl.mongodb.net/zeecart?retryWrites=true&w=majority')
  .then(async () => {
    const count = await Product.countDocuments();
    console.log('Total Products:', count);
    const products = await Product.find().sort({createdAt: -1}).limit(20);
    console.log(JSON.stringify(products, null, 2));
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
