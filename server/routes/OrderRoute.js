import express from "express";
import { 
  getAllOrders, 
  getUserOrders,  
  placeOrderOnline,
  getOrderWhatsAppLink,
  updateOrderStatus,
  getQRCode 
} from "../controllers/OrderController.js";
import authSeller from "../middlewares/authSeller.js";
import authUser from "../middlewares/authUser.js";

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', authUser, placeOrderOnline); // Changed from '/cod' to '/place'
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/qr-code', getQRCode); // Get payment QR code

// Seller/Admin routes
orderRouter.get('/all', authSeller, getAllOrders); // Changed from '/seller' to '/all'
orderRouter.patch('/status', authSeller, updateOrderStatus); // Update order status
orderRouter.get('/whatsapp/:orderId', authSeller, getOrderWhatsAppLink);

export default orderRouter;