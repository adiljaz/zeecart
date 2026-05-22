import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart')
  .then(async () => {
    console.log('Connected. Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
