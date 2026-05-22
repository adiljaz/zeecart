import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Settings from './models/Settings.js';

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart');
    console.log('✓ MongoDB connected');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Settings.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create fashion categories
    const categories = await Category.insertMany([
      {
        name: 'Ornaments',
        gender: 'women',
        subcategories: ['Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Rings'],
        requiresSize: false,
      },
      {
        name: 'Watches',
        gender: 'unisex',
        subcategories: ['Analog', 'Digital', 'Smart', 'Luxury'],
        requiresSize: false,
      },
      {
        name: 'Dresses',
        gender: 'women',
        subcategories: ['Casual', 'Formal', 'Traditional', 'Western'],
        requiresSize: true,
      },
      {
        name: 'Clothing',
        gender: 'men',
        subcategories: ['Formal Shirts', 'T-Shirts', 'Casual', 'Suits'],
        requiresSize: true,
      },
      {
        name: 'Shoes',
        gender: 'unisex',
        subcategories: ['Formal', 'Casual', 'Sports', 'Sneakers'],
        requiresSize: true,
      },
      {
        name: 'Kids Wear',
        gender: 'kids',
        subcategories: ['T-Shirts', 'Pants', 'Dresses', 'Infant'],
        requiresSize: true,
      },
      {
        name: 'Toys',
        gender: 'kids',
        subcategories: ['Action Figures', 'Learning', 'Puzzles'],
        requiresSize: false,
      },
    ]);
    console.log('✓ Categories created');

    // Create sample fashion products
    const products = [
      {
        name: 'Adidas Ultraboost 5.0',
        description: 'Premium running shoes with responsive boost cushioning.',
        price: 18999,
        discountedPrice: 15999,
        category: 'Shoes',
        subcategory: 'Sports',
        gender: 'unisex',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        stock: 45,
        images: [{ filename: 'ultraboost.jpg', url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800' }],
        is360View: true,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
        rating: 4.8,
        reviewCount: 120,
      },
      {
        name: 'Nike Air Max 270',
        description: 'Iconic lifestyle sneaker with the largest Air unit yet.',
        price: 14999,
        discountedPrice: 12999,
        category: 'Shoes',
        subcategory: 'Sneakers',
        gender: 'unisex',
        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
        stock: 30,
        images: [{ filename: 'airmax.jpg', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' }],
        is360View: true,
        isFeatured: true,
        isTrending: true,
        isBestSeller: true,
      },
      {
        name: 'Premium Silk Evening Gown',
        description: 'Exquisite floor-length silk gown for high-fashion events.',
        price: 24999,
        discountedPrice: 19999,
        category: 'Dresses',
        subcategory: 'Formal',
        gender: 'women',
        sizes: ['S', 'M', 'L'],
        stock: 12,
        images: [{ filename: 'silk_gown.jpg', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800' }],
        is360View: false,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
      },
      {
        name: 'Rolex Submariner Date',
        description: 'The reference among divers\' watches, with a rotatable bezel.',
        price: 950000,
        category: 'Watches',
        subcategory: 'Luxury',
        gender: 'unisex',
        sizes: ['41mm'],
        stock: 3,
        images: [{ filename: 'rolex_sub.jpg', url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800' }],
        is360View: true,
        isFeatured: true,
        isTrending: false,
        isBestSeller: false,
      },
      {
        name: 'Zara Men Slim Fit Suit',
        description: 'Tailored slim fit suit in premium wool blend.',
        price: 12999,
        category: 'Clothing',
        subcategory: 'Suits',
        gender: 'men',
        sizes: ['48', '50', '52', '54'],
        stock: 20,
        images: [{ filename: 'suit.jpg', url: 'https://images.unsplash.com/photo-1594932224491-99630ec8d85e?auto=format&fit=crop&q=80&w=800' }],
        is360View: false,
        isFeatured: false,
        isTrending: true,
        isBestSeller: true,
      },
      {
        name: 'Cotton Kids T-Shirt',
        description: 'Soft 100% cotton T-shirt for all-day comfort.',
        price: 899,
        category: 'Kids Wear',
        subcategory: 'T-Shirts',
        gender: 'kids',
        sizes: ['2Y', '4Y', '6Y', '8Y'],
        stock: 100,
        images: [{ filename: 'kids_tshirt.jpg', url: 'https://images.unsplash.com/photo-1519234110483-e5df3a132429?auto=format&fit=crop&q=80&w=800' }],
        is360View: false,
        isFeatured: true,
        isTrending: true,
        isBestSeller: false,
      }
    ];

    await Product.insertMany(products);
    console.log('✓ Products created');

    // Create settings
    await Settings.create({
      whatsappNumber: '9497062038',
      storeName: 'Zee Cart',
      storeEmail: 'adiljaz17@gmail.com',
    });
    console.log('✓ Settings created');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
