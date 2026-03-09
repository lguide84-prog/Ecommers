import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/SellerRoute.js';
import connectCloudinary from './config/cloudconfig.js';
import ProductRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CardRoute.js';
import addressRouter from './routes/AddressRoute.js';
import orderRouter from './routes/OrderRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Trust proxy - important for Vercel deployment
app.set('trust proxy', 1);

// Database connect
await connectDB();
await connectCloudinary();

// CORS Configuration - UPDATED for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ecommers-seven-omega.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins during development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Cookies:', req.cookies);
  console.log('Origin:', req.headers.origin);
  console.log('Host:', req.headers.host);
  console.log('Referer:', req.headers.referer);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    environment: process.env.NODE_ENV
  });
});

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed'
    });
  }
  
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});