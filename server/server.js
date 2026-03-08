import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import UserRouter from './routes/UserRouter.js';
import sellerRouter from './routes/SellerRouter.js';
import connectCloudinary from './config/cloudconfig.js';
import ProductRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CardRoute.js';
import addressRouter from './routes/AddressRoute.js';
import orderRouter from './routes/OrderRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000; // Make sure this matches your frontend


// ⭐ ADD THIS LINE
app.set('trust proxy', 1);

// Database connect
await connectDB();
await connectCloudinary();

// CORS Configuration
// CORS Configuration - Replace the entire cors configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ecommers-seven-omega.vercel.app', // Remove trailing slash
  'https://ecommers-seven-omega.vercel.app/' // Keep both for safety
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
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Add this after cors middleware to handle preflight requests
app.options('*', cors()); // Enable preflight for all routes

// Cookie parser middleware
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers['content-type']);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin:`, req.headers.origin);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running locally'
  });
});

app.use('/api/user', UserRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Handle CORS errors
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
  console.log(`✅ Server running locally on port ${port}`);
  console.log(`✅ Accepting requests from: http://localhost:3000`);
});