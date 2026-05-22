import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart')
  .then(async () => {
    console.log('Connected. Dropping Products and Categories collections...');
    try {
      await mongoose.connection.db.collection('products').drop();
      console.log('Products dropped.');
    } catch (e) {
      console.log('Products collection not found or already dropped.');
    }
    
    try {
      await mongoose.connection.db.collection('categories').drop();
      console.log('Categories dropped.');
    } catch (e) {
      console.log('Categories collection not found or already dropped.');
    }

    console.log('All hardcoded data removed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
