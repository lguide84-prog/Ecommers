import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Configure axios defaults
// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Add this to ensure cookies are sent with every request
axios.defaults.headers.common['Content-Type'] = 'application/json';
// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!error.config.url.includes('/seller/')) {
        localStorage.removeItem('user');
        localStorage.removeItem('guestCart');
      }
    }
    return Promise.reject(error);
  }
);

// Create context
export const AppContext = createContext();

// Custom hook - THIS IS THE CORRECT EXPORT
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

// Provider component
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({
    products: false,
    user: false,
    seller: false,
    order: false,
    initialLoad: true
  });

  // Load guest cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart && !user) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Check seller authentication
  // Check seller authentication
const fetchSeller = async () => {
  setLoading(prev => ({ ...prev, seller: true }));
  try {
    console.log("=== CHECKING SELLER AUTH ===");
    const { data } = await axios.get("/api/seller/isauth");
    console.log("Seller auth response:", data);
    
    if (data.success) {
      setIsSeller(true);
      console.log("✅ Seller authenticated");
    } else {
      setIsSeller(false);
      console.log("❌ Seller not authenticated:", data.message);
    }
  } catch (error) {
    console.error("Error checking seller auth:", error);
    console.log("Error response:", error.response?.data);
    setIsSeller(false);
  } finally {
    setLoading(prev => ({ ...prev, seller: false }));
  }
};
  // Fetch user data
  const fetchUser = async () => {
    setLoading(prev => ({ ...prev, user: true }));
    try {
      console.log("=== FETCHING USER ===");
      const { data } = await axios.get('/api/user/isauth');
      console.log("User data from backend:", data);
      
      if (data.success) {
        setUser(data.user);
        
        // Load cart from database
        if (data.user.cartItems && Object.keys(data.user.cartItems).length > 0) {
          console.log("✅ Loading cart from database:", data.user.cartItems);
          setCartItems(data.user.cartItems);
        }
        
        // Clear guest cart from localStorage
        localStorage.removeItem('guestCart');
      } else {
        console.log("❌ User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(prev => ({ ...prev, user: false, initialLoad: false }));
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Sync cart with backend
  const syncCartWithBackend = async (newCartItems) => {
    if (!user) return;
    
    try {
      console.log("Syncing cart to database:", newCartItems);
      const { data } = await axios.post('/api/user/cart', {
        cartItems: newCartItems
      });
      
      if (data.success) {
        console.log("✅ Cart synced successfully");
      } else {
        toast.error(data.message || "Failed to sync cart");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  // Add to cart
  const addToCart = (itemId) => {
    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    
    if (user) {
      syncCartWithBackend(cartData);
    }
    
    toast.success("Added to Cart", {
      icon: '🛍️',
      duration: 2000
    });
  };

  // Update cart quantity
  const updateCartQuantity = (itemId, quantity) => {
    let cartData = { ...cartItems };
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    
    if (user) {
      syncCartWithBackend(cartData);
    }
  };

  // Remove product from cart completely
  const removeFromCart = (itemId) => {
    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      delete cartData[itemId];
      setCartItems(cartData);
      
      if (user) {
        syncCartWithBackend(cartData);
      }
      
      toast.success("Removed from Cart", {
        icon: '🗑️',
        duration: 2000
      });
    }
  };

  // Get cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // Get cart total
  const getCartTotal = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((pro) => pro._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        const itemPrice = itemInfo.discountPrice || itemInfo.price;
        totalAmount += itemPrice * cartItems[itemId];
      }
    }
    return Number(totalAmount.toFixed(2));
  };

  // Add this function to AppContext.jsx
const fetchUserCart = async () => {
  if (!user) return;
  try {
    console.log("=== FETCHING USER CART ===");
    const { data } = await axios.get('/api/user/isauth');
    if (data.success && data.user.cartItems) {
      console.log("✅ Loading cart from database:", data.user.cartItems);
      setCartItems(data.user.cartItems);
    }
  } catch (error) {
    console.error("Error fetching user cart:", error);
  }
};

  // Place order
  const placeOrder = async (orderData) => {
    setLoading(prev => ({ ...prev, order: true }));
    try {
      const { data } = await axios.post('/api/order/place', orderData);
      
      if (data.success) {
        setCartItems({});
        if (user) {
          await syncCartWithBackend({});
        } else {
          localStorage.removeItem('guestCart');
        }
        toast.success("Order placed successfully!");
        return { success: true, orderId: data.orderId, whatsappUrl: data.whatsappUrl };
      } else {
        toast.error(data.message || "Failed to place order");
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const message = error.response?.data?.message || error.message || "Failed to place order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(prev => ({ ...prev, order: false }));
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post('/api/user/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsSeller(false);
      
      // Restore guest cart if exists
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      } else {
        setCartItems({});
      }
      
      localStorage.removeItem('user');
      localStorage.removeItem('selectedAddressId');
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  // Add this useEffect to watch for user changes and fetch cart
useEffect(() => {
  if (user) {
    console.log("👤 User changed, fetching cart...");
    // The cart is already loaded in fetchUser, but let's make sure
    if (user.cartItems) {
      setCartItems(user.cartItems);
    }
  }
}, [user]);

  // Initial data fetch
  useEffect(() => {
    const initializeApp = async () => {
      console.log("=== APP INITIALIZED ===");
      await Promise.all([
        fetchSeller(),
        fetchUser(),
        fetchProducts()
      ]);
    };
    
    initializeApp();
  }, []);

  const value = {
    // Navigation
    navigate,
    
    // User
    user,
    setUser,
    isSeller,
    setIsSeller,
    showLogin,
    setShowLogin,
    logout: handleLogout,
    
    // Products
    products,
    fetchProducts,
    
    // Cart
    cartItems,
    setCartItems,
    addToCart,
    updateCart: updateCartQuantity,
    removeFromCart,
    getCartCount,
    getCartTotal,
    
    // Search
    search,
    setSearch,
    
    // Loading states
    loading,
    
    // Order
    placeOrder,
    
    // Axios instance
    axios
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};