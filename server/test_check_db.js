import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart')
  .then(async () => {
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log('Products in DB:', JSON.stringify(products, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
