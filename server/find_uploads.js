import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://adiljaseem:adiljaz@cluster0.pvnidcl.mongodb.net/zeecart?retryWrites=true&w=majority')
  .then(async () => {
    const products = await Product.find({ 'images.url': { $regex: '1777' } });
    console.log('Found products with uploaded images:', products.length);
    if (products.length > 0) {
      console.log(JSON.stringify(products[0], null, 2));
    }
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
