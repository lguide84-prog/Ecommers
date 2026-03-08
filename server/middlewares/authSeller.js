import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authSeller = async (req, res, next) => {
  console.log("=== authSeller Middleware ===");
  console.log("Cookies:", req.cookies);
  
  const { sellerToken } = req.cookies; // ✅ Look for sellerToken specifically
  console.log("sellerToken present:", !!sellerToken);

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: "Not Authorized - No token" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    console.log("Token decoded:", tokenDecode);
    
    // Case 1: Seller token (from seller login)
    if (tokenDecode.role === 'seller') {
      if (tokenDecode.email === process.env.SELLER_EMAIL) {
        console.log("Seller authenticated successfully");
        req.seller = tokenDecode;
        return next();
      }
      return res.status(403).json({ success: false, message: "Invalid seller" });
    }
    
    // Case 2: User token with admin/seller role
    if (tokenDecode.id) {
      const user = await User.findById(tokenDecode.id);
      if (user && (user.role === 'seller' || user.role === 'admin' || user.isAdmin === true)) {
        console.log("User with seller/admin role authenticated");
        req.user = user;
        return next();
      }
    }
    
    return res.status(403).json({ success: false, message: "Seller/Admin access required" });
    
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authSeller;