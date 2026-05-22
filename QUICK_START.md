# 🚀 ZeeCart - Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas connection string
- npm or yarn package manager

## ⚡ Fast Setup (5 minutes)

### Terminal 1: Start Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

**Server runs on:** `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
cd client
npm install
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 🔐 Admin Login

Navigate to: `http://localhost:5173/admin`

**Credentials:**
- **Username:** `Adiljaseem`
- **Password:** `Adiljaz@123`

---

## 📍 Navigation Links

### Public Pages
- **Home**: `http://localhost:5173/`
- **Products**: `http://localhost:5173/products`
- **About**: `http://localhost:5173/about`
- **Contact**: `http://localhost:5173/contact`
- **Product Detail**: `http://localhost:5173/products/{productId}`

### Admin Pages
- **Admin Login**: `http://localhost:5173/admin`
- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Products**: `http://localhost:5173/admin/products`
- **Add Product**: `http://localhost:5173/admin/products/add`
- **Categories**: `http://localhost:5173/admin/categories`
- **Reviews**: `http://localhost:5173/admin/reviews`
- **Settings**: `http://localhost:5173/admin/settings`

---

## 🎯 Key Features to Try

### 1. **Product Browsing**
   - Go to `/products`
   - Filter by gender, category, price
   - Click product to view details
   - See 360° view badge on supported products

### 2. **WhatsApp Ordering**
   - Select product size and quantity
   - Click "Order via WhatsApp"
   - Message pre-fills with product details

### 3. **Product Reviews**
   - Scroll to reviews section
   - Submit rating & comment
   - Admin approval required (check `/admin/reviews`)

### 4. **Admin Management**
   - Login with credentials above
   - Add new products with images
   - Manage categories
   - Moderate reviews
   - Update store settings

---

## 📦 Sample Data

**15 Products** are pre-loaded with categories:
- Women's: Ornaments, Watches, Dresses, Accessories
- Men's: Watches, Clothing, Shoes, Accessories

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Update MONGO_URI in server/.env if needed
# Clear node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend won't start
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port conflicts
- Backend default: 5000 (change in `server/.env`)
- Frontend default: 5173 (Vite will use next available)

### MongoDB connection error
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Update `MONGO_URI` in `server/.env`

---

## 📱 Responsive Testing

Open DevTools (F12) and test:
- **Mobile** (375px)
- **Tablet** (768px)
- **Desktop** (1024px)
- **Large** (1280px+)

---

## 🎨 Customize Theme

Edit `client/tailwind.config.js` to change colors:
```javascript
colors: {
  'primary-bg': '#0A0F1E',      // Deep navy
  'accent-gold': '#C9A84C',     // Gold
  'text-white': '#FFFFFF',      // White
  'card-bg': '#1E2535',         // Soft charcoal
}
```

---

## 🚀 Production Build

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

---

## 📚 Full Documentation

See [README.md](./README.md) for comprehensive docs and API reference.

---

## ✅ Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Database seeded with sample data
- [ ] Can access `http://localhost:5173`
- [ ] Admin login works
- [ ] Products display with images
- [ ] Filters work
- [ ] WhatsApp button opens correctly
- [ ] Reviews can be submitted
- [ ] Can add products in admin

---

## 🎉 You're All Set!

Start exploring ZeeCart - your premium e-commerce platform is ready to go!

Need help? Check the README.md or API documentation for detailed info.

Happy selling! 🛍️✨
