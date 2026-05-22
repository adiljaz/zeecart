# ZeeCart - Premium MERN E-commerce Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) e-commerce platform with premium design, animations, and comprehensive admin panel.

## 🎯 Features

### Frontend
- **Premium UI/UX**: Dark theme with gold accents, glassmorphism effects
- **Animations**: Framer Motion, GSAP, Three.js particle effects
- **Product Showcase**: 
  - Dynamic filtering (category, subcategory, price, gender)
  - Product detail pages with image gallery
  - 360° view support badge
  - Star ratings and reviews
- **WhatsApp Integration**: Direct ordering via WhatsApp
- **Responsive Design**: Mobile-first approach
- **Performance**: Lazy loading, skeleton screens, debounced search

### Backend
- **RESTful API**: Complete product, category, review, and settings management
- **Authentication**: JWT-based admin authentication
- **Image Upload**: Multer integration for file handling
- **Database**: MongoDB with comprehensive schemas
- **Rate Limiting**: Review submission rate limiting by IP
- **CORS & Security**: Helmet, CORS middleware

### Admin Panel
- **Dashboard**: Overview of products, categories, reviews, and 360° views
- **Product Management**: Create, read, update, delete products
- **Image Management**: Multi-image upload with drag-to-reorder
- **Category Management**: Manage categories and subcategories
- **Review Moderation**: Approve/delete user reviews
- **Settings**: Configure WhatsApp number and store details

## 📦 Project Structure

```
zeecart/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── styles/        # Global styles
│   │   ├── api.js         # Axios instance
│   │   ├── store.js       # Zustand stores
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                # Node.js backend (Express)
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # Uploaded images
│   ├── server.js         # Main server file
│   ├── seed.js           # Database seeding
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Installation

#### 1. Clone the Repository
```bash
cd zeecart
```

#### 2. Setup Backend

```bash
cd server
npm install

# Create .env file (already exists, update if needed)
# MONGO_URI=mongodb://localhost:27017/zeecart
# JWT_SECRET=zeecart_super_secret_key_2026
# ADMIN_USERNAME=Adiljaseem
# ADMIN_PASSWORD=Adiljaz@123
# PORT=5000
# CLIENT_URL=http://localhost:5173

# Seed the database
npm run seed

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd client
npm install

# Create .env file (already exists)
# VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Admin Access

Navigate to `http://localhost:5173/admin`

**Credentials:**
- Username: `Adiljaseem`
- Password: `Adiljaz@123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews/:productId` - Submit review
- `PUT /api/reviews/:id/approve` - Approve review (admin only)
- `DELETE /api/reviews/:id` - Delete review (admin only)

### Settings
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update settings (admin only)

### Upload
- `POST /api/upload` - Upload images (admin only)

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0A0F1E` (Deep Navy)
- **Accent Gold**: `#C9A84C`
- **Text**: `#FFFFFF` (Pure White)
- **Card Background**: `#1E2535` (Soft Charcoal)

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: DM Sans (Sans-serif)

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/zeecart
JWT_SECRET=your_secret_key
ADMIN_USERNAME=Adiljaseem
ADMIN_PASSWORD=Adiljaz@123
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 📦 Key Dependencies

### Frontend
- `react` - UI library
- `react-router-dom` - Routing
- `framer-motion` - Animations
- `gsap` - Advanced animations
- `three` - 3D graphics
- `react-parallax-tilt` - 3D tilt effects
- `axios` - HTTP client
- `zustand` - State management
- `tailwindcss` - Styling
- `react-hot-toast` - Notifications
- `react-quill` - Rich text editor

### Backend
- `express` - Server framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - Authentication
- `multer` - File upload
- `express-rate-limit` - Rate limiting
- `helmet` - Security
- `cors` - Cross-origin requests

## 🌐 WhatsApp Order Flow

1. User selects product, size, and quantity
2. Clicks "Order via WhatsApp"
3. WhatsApp Web opens with pre-filled message
4. Admin receives message and processes order
5. Admin WhatsApp number configurable in admin settings

## 📱 Responsive Design

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🔒 Security

- JWT authentication for admin routes
- Rate limiting on review submissions
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

## 🚀 Deployment

### Backend (Node.js + MongoDB)
- Recommended: Heroku, Railway, or Render
- Environment variables: Configure in deployment dashboard
- MongoDB Atlas for cloud database

### Frontend (React + Vite)
- Recommended: Vercel, Netlify, or GitHub Pages
- Build: `npm run build`
- Preview: `npm run preview`

### Build Commands
```bash
# Frontend build
cd client
npm run build

# Backend uses npm start
cd server
npm start
```

## 📝 License

MIT License - feel free to use this project for personal or commercial use.

## 🤝 Contributing

Feel free to fork, modify, and improve!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**ZeeCart** - Premium E-commerce, Redefined ✨
