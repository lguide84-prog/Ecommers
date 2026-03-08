import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { FaWhatsapp, FaShieldAlt, FaTruck, FaUndo, FaLock, FaHeart, FaTrash } from 'react-icons/fa';
import { MdLocalShipping, MdPayment, MdVerified } from 'react-icons/md';

const Cart = () => {
  const { 
    products, 
    cartItems, 
    removeFromCart, 
    getCartCount,
    updateCart, 
    navigate, 
    getCartTotal,
    axios, 
    user, 
    setCartItems,
    placeOrder,
    loading 
  } = useAppContext();
  
  const [showAddress, setShowAddress] = useState(false);
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);
  const [savedForLater, setSavedForLater] = useState([]);

  // Update cart whenever cartItems changes
  const updateCartFromItems = () => {
    console.log("Updating cart from cartItems:", cartItems);
    if (!products || !cartItems) {
      setCart([]);
      return;
    }
    
    let temp = []
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key)
      if (product) {
        temp.push({
          ...product,
          quantity: cartItems[key]
        })
      }
    }
    console.log("Updated cart:", temp);
    setCart(temp);
    setInitialLoad(false);
  }

  // Call updateCartFromItems whenever cartItems or products change
  useEffect(() => {
    updateCartFromItems();
  }, [cartItems, products]);

  const getUserAddress = async () => {
    if (!user) {
      console.log("No user, skipping address fetch");
      return;
    }
    
    setLoadingAddresses(true);
    try {
      console.log("Fetching addresses for user:", user._id);
      
      let response;
      try {
        response = await axios.get('/api/address/');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("Trying /api/address/get endpoint");
          response = await axios.get('/api/address/get');
        } else {
          throw error;
        }
      }
      
      console.log("Addresses response:", response.data);
      
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
        if (response.data.addresses && response.data.addresses.length > 0) {
          // Check if we have a previously selected address in localStorage
          const savedAddressId = localStorage.getItem('selectedAddressId');
          if (savedAddressId) {
            const savedAddress = response.data.addresses.find(a => a._id === savedAddressId);
            if (savedAddress) {
              setSelectedAddress(savedAddress);
            } else {
              setSelectedAddress(response.data.addresses[0]);
            }
          } else {
            setSelectedAddress(response.data.addresses[0]);
          }
        } else {
          console.log("No addresses found");
          setSelectedAddress(null);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      
      if (error.response?.status === 401) {
        toast.error("Please login to view addresses");
        navigate('/login');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check if backend is running.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to fetch addresses");
      }
    } finally {
      setLoadingAddresses(false);
    }
  }

  // Save selected address to localStorage
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('selectedAddressId', selectedAddress._id);
    }
  }, [selectedAddress]);

  // Get product image (handles both old and new schema)
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image && product.image.length > 0) {
      return product.image[0];
    }
    return assets.upload_area;
  };

  // Calculate product total
  const calculateProductTotal = (product) => {
    const gstPercentage = product.gstPercentage || 5;
    const basePrice = product.discountPrice || product.offerPrice || product.price || 0;
    const quantity = product.quantity || 1;
    const shippingCharges = product.shippingCharges || 0;
    
    const subtotal = basePrice * quantity;
    const gstAmount = (subtotal * gstPercentage) / 100;
    
    return {
      subtotal,
      gstAmount,
      shippingCharges: shippingCharges * quantity,
      total: subtotal + gstAmount + (shippingCharges * quantity),
      gstPercentage,
      basePrice
    };
  };

  const calculateTotalShipping = () => {
    let totalShipping = 0;
    cart.forEach(product => {
      const shipping = product.shippingCharges || 0;
      totalShipping += shipping * (product.quantity || 1);
    });
    return totalShipping;
  };

  const calculateTotalGST = () => {
    let totalGST = 0;
    cart.forEach(product => {
      const gstAmount = calculateProductTotal(product).gstAmount;
      totalGST += gstAmount;
    });
    return totalGST;
  };

  const calculateGrandTotal = () => {
    const subtotal = getCartTotal();
    const totalGST = calculateTotalGST();
    const totalShipping = calculateTotalShipping();
    return subtotal + totalGST + totalShipping;
  };

  const validateTransactionId = (id) => {
    if (!id || id.trim() === '') {
      return "Transaction ID is required";
    }
    if (id.trim().length < 8) {
      return "Transaction ID must be at least 8 characters";
    }
    return "";
  };

  const generateWhatsAppMessage = (orderData) => {
    const { orderId, totalAmount, transactionId } = orderData;
    
    const subtotal = getCartTotal();
    const totalGST = calculateTotalGST();
    const totalShipping = calculateTotalShipping();
    const grandTotal = calculateGrandTotal();
    
    let gstBreakdown = "";
    let shippingBreakdown = "";
    
    cart.forEach((item, index) => {
      const productTotal = calculateProductTotal(item);
      const shipping = item.shippingCharges || 0;
      
      gstBreakdown += `${index + 1}. ${item.name} (GST ${productTotal.gstPercentage}%): ₹${productTotal.gstAmount.toFixed(2)}\n`;
      shippingBreakdown += `${index + 1}. ${item.name}: ₹${(shipping * (item.quantity || 1)).toFixed(2)} ${shipping === 0 ? "(Free)" : ""}\n`;
    });
    
    const message = `🛒 *NEW ORDER RECEIVED!* 🛒

📋 *ORDER DETAILS:*
• Order ID: ${orderId}
• Customer: ${user?.name || "Customer"}
• Payment: Online
• Transaction ID: ${transactionId}
• Order Time: ${new Date().toLocaleString('en-IN', { 
  timeZone: 'Asia/Kolkata',
  dateStyle: 'full',
  timeStyle: 'medium'
})}

📍 *DELIVERY ADDRESS:*
${selectedAddress ? 
  `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.zipcode}\n📞 ${selectedAddress.phone || "No phone"}` 
  : "Address not provided"}

🛍️ *ORDER ITEMS:*
${cart.map((item, index) => {
  const productTotal = calculateProductTotal(item);
  const shipping = item.shippingCharges || 0;
  const basePrice = productTotal.basePrice;
  return `${index + 1}. ${item.name} x ${item.quantity} = ₹${basePrice * item.quantity} (GST ${productTotal.gstPercentage}%: ₹${productTotal.gstAmount.toFixed(2)}, Shipping: ₹${(shipping * item.quantity).toFixed(2)}${shipping === 0 ? " Free" : ""})`;
}).join('\n')}

📊 *PRICE BREAKDOWN:*
• Subtotal: ₹${subtotal.toFixed(2)}
• Total GST: ₹${totalGST.toFixed(2)}
${gstBreakdown}
• Total Shipping: ₹${totalShipping.toFixed(2)} ${totalShipping === 0 ? "(Free Shipping)" : ""}
${shippingBreakdown}

📦 *TOTAL ITEMS:* ${cart.length}
💰 *GRAND TOTAL:* ₹${grandTotal.toFixed(2)}

_This is an automated order notification. Please process the order._`;

    return message;
  };

  const sendWhatsAppNotification = (orderId, totalAmount, transactionId) => {
    const phoneNumber = "79064 82210";
    
    const orderData = {
      orderId,
      totalAmount,
      transactionId,
      customerPhone: user?.phone
    };
    
    const message = generateWhatsAppMessage(orderData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    setWhatsAppOpened(true);
    
    return whatsappUrl;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return toast.error("Please select an address");
    }

    const validationError = validateTransactionId(transactionId);
    if (validationError) {
      setTransactionError(validationError);
      return toast.error(validationError);
    }

    setIsPlacingOrder(true);
    
    const orderData = {
      items: cart.map(item => ({ 
        productId: item._id, 
        quantity: item.quantity
      })),
      addressId: selectedAddress._id,
      transactionId: transactionId.trim()
    };

    const result = await placeOrder(orderData);
    
    if (result.success) {
      // Save order details to localStorage before WhatsApp redirect
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: result.orderId,
        transactionId: transactionId.trim(),
        totalAmount: calculateGrandTotal()
      }));
      
      // Send WhatsApp notification
      sendWhatsAppNotification(result.orderId, calculateGrandTotal(), transactionId.trim());
      
      toast.success("Order placed successfully! Cart has been cleared.");
      
      // Clear cart after successful order
      setCartItems({});
      setCart([]);
      setTransactionId("");
      setTransactionError("");
      setOrderPlaced(true);
      
      // Navigate to orders page after WhatsApp opens
      setTimeout(() => {
        navigate("/myOrders");
      }, 1000);
    } else {
      setIsPlacingOrder(false);
    }
  };

  // Effect to handle cart clearing after order placement
  useEffect(() => {
    if (orderPlaced) {
      console.log("Order placed, cart cleared:", cartItems);
      setCart([]);
      setOrderPlaced(false);
      setIsPlacingOrder(false);
    }
  }, [orderPlaced, cartItems]);

  // Check for last order on component mount
  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      // Clear it after reading
      localStorage.removeItem('lastOrder');
    }
  }, []);

  // Debug authentication
  useEffect(() => {
    console.log("=== CART DEBUG ===");
    console.log("User:", user);
    console.log("User ID:", user?._id);
    console.log("Cart Items:", cartItems);
    console.log("Products:", products.length);
    console.log("Local Cart:", cart);
    console.log("Cart Items Keys:", Object.keys(cartItems).length);
    console.log("Local Cart Length:", cart.length);
  }, [cartItems, cart, products, user]);

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching addresses...");
      getUserAddress();
    } else {
      console.log("No user, skipping address fetch");
    }
  }, [user]);

  // Handle page visibility change (when returning from WhatsApp)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && whatsAppOpened) {
        console.log("Returned from WhatsApp, checking order status...");
        setWhatsAppOpened(false);
        
        // Check if we have a pending order
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
          // Order was placed successfully
          localStorage.removeItem('lastOrder');
          // Already navigating to myOrders, so no action needed
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [whatsAppOpened]);

  if (!products.length && initialLoad) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-rose-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-rose-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-rose-300 tracking-wider mt-6">LOADING YOUR BAG</p>
      </div>
    );
  }

  // Show empty cart message if cart is empty
  if (cart.length === 0 && !initialLoad) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 opacity-30">
            <svg className="w-full h-full text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-stone-700 mb-3">Your bag is empty</h2>
          <p className="text-stone-400 text-sm mb-8">Discover our latest collection and find your perfect style.</p>
          <button 
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="px-8 py-4 bg-stone-800 text-white text-sm tracking-wider hover:bg-stone-900 transition-all duration-300"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      </div>
    );
  }

  // Don't render anything if cart is empty but we're still loading
  if (cart.length === 0 && initialLoad) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-rose-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-rose-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-rose-300 tracking-wider mt-6">LOADING YOUR BAG</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-stone-800">Shopping Bag</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm text-stone-400">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</span>
          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
          <span className="text-sm text-stone-400">All prices include GST</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items - Left Column */}
        <div className="flex-1">
          <div className="space-y-6">
            {cart.map((product, index) => {
              const productTotal = calculateProductTotal(product);
              
              return (
                <div key={index} className="group bg-white p-6 border border-stone-100 hover:border-rose-100 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div 
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        window.scrollTo(0, 0);
                      }} 
                      className="cursor-pointer w-full sm:w-32 h-32 bg-stone-50 border border-stone-100 overflow-hidden group"
                    >
                      <img 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                        src={getProductImage(product)} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = assets.upload_area;
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 
                            onClick={() => {
                              navigate(`/product/${product._id}`);
                              window.scrollTo(0, 0);
                            }} 
                            className="text-base md:text-lg font-light text-stone-700 hover:text-rose-400 cursor-pointer transition-colors"
                          >
                            {product.name}
                          </h3>
                          
                          {/* Product Attributes */}
                          <div className="flex flex-wrap gap-4 mt-2">
                            {product.sizes && product.sizes.length > 0 && (
                              <p className="text-xs text-stone-400">
                                Size: <span className="text-stone-600 ml-1">{product.sizes.map(s => s.size).join(', ')}</span>
                              </p>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-stone-400">Color:</span>
                                {product.colors.map((color, idx) => (
                                  <div
                                    key={idx}
                                    className="w-3 h-3 rounded-full border border-stone-200 ml-1"
                                    style={{ backgroundColor: color.hexCode || '#ccc' }}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Price Breakdown */}
                          <div className="mt-3 space-y-1">
                            <p className="text-sm text-stone-600">
                              Base Price: <span className="font-medium">₹{productTotal.subtotal.toFixed(2)}</span>
                            </p>
                            <p className="text-xs text-rose-400">
                              GST ({productTotal.gstPercentage}%): ₹{productTotal.gstAmount.toFixed(2)}
                            </p>
                            <p className={`text-xs ${product.shippingCharges === 0 ? 'text-green-500' : 'text-stone-400'}`}>
                              Shipping: ₹{(product.shippingCharges || 0).toFixed(2)} {product.shippingCharges === 0 ? '(Free)' : ''}
                            </p>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                          <p className="text-xl font-light text-rose-400">₹{productTotal.total.toFixed(2)}</p>
                          
                          <div className="flex items-center gap-2">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-stone-200">
                              <select
                                onChange={(e) => updateCart(product._id, Number(e.target.value))}
                                value={cartItems[product._id] || 1}
                                className="px-2 py-1.5 text-sm outline-none bg-transparent text-stone-600"
                              >
                                {Array(5).fill('').map((_, index) => (
                                  <option key={index} value={index + 1}>{index + 1}</option>
                                ))}
                              </select>
                            </div>

                            {/* Remove Button */}
                            <button 
                              onClick={() => removeFromCart(product._id)}
                              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-rose-50 rounded-full transition-all"
                              title="Remove item"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Link */}
          <button 
            onClick={() => { 
              navigate("/products"); 
              window.scrollTo(0, 0) 
            }} 
            className="group inline-flex items-center gap-2 mt-8 text-sm text-stone-400 hover:text-rose-400 transition-colors"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            Continue Shopping
          </button>
        </div>

        {/* Order Summary - Right Column */}
        <div className="lg:w-[380px]">
          <div className="bg-white p-6 md:p-8 border border-stone-100 sticky top-24">
            <h2 className="text-lg font-light text-stone-800 mb-6">Order Summary</h2>

            {/* Delivery Address Section */}
            <div className="mb-6 pb-6 border-b border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-stone-400">Delivery Address</p>
                <button 
                  onClick={() => setShowAddress(!showAddress)} 
                  className="text-xs text-rose-400 hover:text-rose-500 transition-colors"
                >
                  {addresses.length > 0 ? 'Change' : 'Add'}
                </button>
              </div>
              
              {loadingAddresses ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin"></div>
                  <p className="text-xs text-stone-400">Loading addresses...</p>
                </div>
              ) : (
                <>
                  {selectedAddress ? (
                    <div className="text-sm text-stone-600">
                      <p className="font-medium mb-1">{selectedAddress.name || 'Delivery Address'}</p>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zipcode}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">📞 {selectedAddress.phone || 'Phone not provided'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400 py-2">No address selected</p>
                  )}

                  {/* Address Dropdown */}
                  {showAddress && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-xs text-stone-400 mb-2">Select an address:</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {addresses.length > 0 ? (
                          addresses.map((add, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setSelectedAddress(add);
                                setShowAddress(false);
                              }}
                              className={`p-3 text-xs border cursor-pointer transition-all ${
                                selectedAddress?._id === add._id 
                                  ? 'border-rose-400 bg-rose-50' 
                                  : 'border-stone-100 hover:border-stone-300'
                              }`}
                            >
                              <p className="font-medium text-stone-700">{add.street}</p>
                              <p className="text-stone-500 mt-1">{add.city}, {add.state} - {add.zipcode}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-stone-400 py-4">No addresses found</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowAddress(false);
                          navigate("/add-address");
                        }}
                        className="w-full mt-3 py-2 text-xs text-rose-400 border border-rose-200 hover:bg-rose-50 transition-colors"
                      >
                        + Add New Address
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Transaction ID */}
            <div className="mb-6 pb-6 border-b border-stone-100">
              <p className="text-xs uppercase tracking-wider text-stone-400 mb-3">Transaction ID *</p>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(e.target.value);
                  setTransactionError(validateTransactionId(e.target.value));
                }}
                placeholder="Enter payment transaction ID"
                className={`w-full px-4 py-3 text-sm border bg-stone-50 focus:bg-white transition-colors outline-none ${
                  transactionError ? 'border-rose-400' : 'border-stone-200 focus:border-rose-400'
                }`}
              />
              {transactionError && (
                <p className="text-xs text-rose-400 mt-2">{transactionError}</p>
              )}
              <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
                <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
                Enter the transaction ID from your payment confirmation
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({getCartCount()} items)</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              
              {/* GST Breakdown */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">GST Breakdown</p>
                {cart.map((item, index) => {
                  const productTotal = calculateProductTotal(item);
                  return (
                    <div key={index} className="flex justify-between text-xs text-stone-500 mb-1">
                      <span className="truncate max-w-[150px]">{item.name.substring(0, 20)}...</span>
                      <span>₹{productTotal.gstAmount.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm font-medium text-stone-700 mt-2 pt-2 border-t border-stone-100">
                  <span>Total GST</span>
                  <span>₹{calculateTotalGST().toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Breakdown */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">Shipping</p>
                {cart.map((item, index) => {
                  const shipping = item.shippingCharges || 0;
                  return (
                    <div key={index} className="flex justify-between text-xs text-stone-500 mb-1">
                      <span className="truncate max-w-[150px]">{item.name.substring(0, 20)}...</span>
                      <span className={shipping === 0 ? "text-green-500" : ""}>
                        ₹{(shipping * (item.quantity || 1)).toFixed(2)} {shipping === 0 ? "(Free)" : ""}
                      </span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm font-medium text-stone-700 mt-2 pt-2 border-t border-stone-100">
                  <span>Total Shipping</span>
                  <span className={calculateTotalShipping() === 0 ? "text-green-500" : ""}>
                    ₹{calculateTotalShipping().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between text-lg pt-4 mt-4 border-t-2 border-stone-200">
                <span className="font-light text-stone-700">Grand Total</span>
                <span className="font-light text-rose-400">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* WhatsApp Notification */}
            <div className="mt-6 p-4 bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <FaWhatsapp className="text-green-600 text-lg" />
                <p className="text-xs font-medium text-green-700 uppercase tracking-wider">WhatsApp Notification</p>
              </div>
              <p className="text-xs text-green-600">
                Order details will be sent to seller's WhatsApp for quick processing.
              </p>
            </div>

            {/* QR Code */}
            <div className="mt-6 text-center">
              <img
                src="/qr.jpg"
                alt="Payment QR Code"
                className="w-40 h-40 mx-auto border border-stone-100 p-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <p className="text-xs text-stone-400 mt-2 flex items-center justify-center gap-1">
                <FaLock className="text-rose-400 text-[10px]" />
                Secure Payment
              </p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !transactionId || transactionError || !selectedAddress || cart.length === 0}
              className={`w-full py-4 mt-6 text-sm tracking-wider transition-all duration-300 ${
                isPlacingOrder || !transactionId || transactionError || !selectedAddress || cart.length === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-stone-800 text-white hover:bg-rose-400'
              }`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `PLACE ORDER • ₹${calculateGrandTotal().toFixed(2)}`
              )}
            </button>

            {/* Trust Badges */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-1">
                <FaShieldAlt className="text-rose-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <FaTruck className="text-rose-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUndo className="text-rose-400" />
                <span>30-day Returns</span>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-stone-400 text-center mt-4">
              By placing your order, you agree to our{' '}
              <button className="text-rose-400 hover:underline">Terms</button> and{' '}
              <button className="text-rose-400 hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;