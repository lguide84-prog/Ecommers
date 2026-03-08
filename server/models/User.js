import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin', 'seller'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
  cartItems: { type: Object, default: {} },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true, minimize: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;