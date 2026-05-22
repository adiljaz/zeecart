import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import bannerRoutes from './routes/banners.js';

// Middleware
import getClientIp from './middleware/getClientIp.js';

dotenv.config();

const app = express();
app.use(compression());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security & Logging
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan('combined'));

// CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow localhost in development
      if (origin.includes('localhost')) return callback(null, true);
      // Allow all Vercel deployments
      if (origin.includes('vercel.app')) return callback(null, true);
      // Allow configured client URL
      if (clientUrl === '*' || origin === clientUrl) return callback(null, true);
      callback(null, true); // Allow all for now - restrict after testing
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add client IP to request object
app.use((req, res, next) => {
  req.clientIp = getClientIp(req);
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zeecart')
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => console.error('✗ MongoDB connection failed:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/banners', bannerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
