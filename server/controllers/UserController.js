import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'user'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // ✅
  sameSite: "none",    // ✅
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

   // In registerUser, loginUser functions - REPLACE the res.cookie line with:
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
});

// In logout function - REPLACE with:
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
});

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile - This was missing in your exports
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('orderHistory');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile - This was missing in your exports
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check Auth
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,        // ✅
  sameSite: "none",
});
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Cart
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    console.log("Updating cart for user:", req.user._id);
    console.log("New cart items:", cartItems);
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { cartItems },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    console.log("Cart updated successfully in database");
    res.json({ 
      success: true, 
      message: "Cart updated successfully",
      cartItems: user.cartItems 
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};