import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    quantity: { type: Number, required: true },
    size: { type: String }, // For clothing items
    price: { type: Number, required: true }
  }],
  amount: { type: Number, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  status: { 
    type: String, 
    enum: ['Order Placed', 'Payment Pending', 'Payment Received', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Payment Pending' 
  },
  paymentType: { type: String, default: 'QR Code' },
  isPaid: { type: Boolean, default: false },
  transactionId: { type: String },
  qrCodeUrl: { type: String }, // URL to QR code image
  whatsappSent: { type: Boolean, default: false } // Track if WhatsApp notification sent
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;