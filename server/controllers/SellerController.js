import jwt from 'jsonwebtoken';

// ================== Seller Login ==================
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({
      id: 'admin_seller',
      email,
      role: 'seller',
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // FIXED: Uncommented and corrected cookie settings
    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      seller: {
        email,
        name: "Admin Seller",
        role: 'seller'
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== Check Seller Auth ==================
export const isSellerAuth = async (req, res) => {
  try {
    const token = req.cookies.sellerToken;
    
    if (!token) {
      return res.json({ 
        success: false, 
        message: "Not authorized - No token found" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a seller token
    if (decoded.role === 'seller' && decoded.email === process.env.SELLER_EMAIL) {
      return res.json({
        success: true,
        seller: {
          email: decoded.email,
          name: "Admin Seller",
          role: 'seller'
        },
      });
    } else {
      return res.json({ 
        success: false, 
        message: "Not a valid seller" 
      });
    }
  } catch (error) {
    console.log(error.message);
    
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    
    return res.json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ================== Seller Logout ==================
export const sellerLogout = async (req, res) => {
  try {
    // FIXED: Uncommented and corrected cookie clear settings
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    return res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.clearCookie("sellerToken");
    res.clearCookie("token");
    return res.json({ success: true });
  }
};