import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    
    if (tokenDecode.id) {
      // Get full user from database
      const user = await User.findById(tokenDecode.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      
      req.user = user; // Attach full user object
      next();
    } else {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authUser;