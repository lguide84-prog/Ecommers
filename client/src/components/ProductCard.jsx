import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

// Custom Icons
const HeartIcon = ({ filled }) => (
  <svg className={`w-5 h-5 transition-colors ${filled ? 'fill-rose-500 text-rose-500' : 'text-stone-400 group-hover:text-rose-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const QuickViewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function ProductCard({ product, variant = 'default' }) {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  const currency = "₹";
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if product is in stock
  const isInStock = () => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.some(size => size.stock > 0);
    }
    return true;
  };

  // Get display price
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0;

  // Get image - handle both 'image' (old) and 'images' (new) formats
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return isHovered && product.images.length > 1 ? product.images[1] : product.images[0];
    }
    if (product.image && product.image.length > 0) {
      return product.image[0];
    }
    return null;
  };

  const productImage = getProductImage();

  // Create a data URL for a simple placeholder
  const createPlaceholderSVG = () => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23faf9f8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Helvetica' font-size='14' fill='%23b76e79'%3ECREATION EMPIRE%3C/text%3E%3C/svg%3E`;
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('.wishlist-btn') || e.target.closest('.quick-view-btn')) {
      return;
    }
    navigate(`/product/${product._id}`);
    window.scrollTo(0, 0);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  // Determine card size based on variant
  const cardClasses = {
    default: "max-w-[18rem]",
    expanded: "max-w-full",
    small: "max-w-[14rem]"
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group bg-white w-full ${cardClasses[variant] || cardClasses.default}
          transition-all duration-500 cursor-pointer
          ${isHovered ? 'shadow-2xl -translate-y-1' : 'shadow-md'}
          rounded-2xl overflow-hidden relative
        `}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden">
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-stone-100 animate-pulse" />
          )}

          {/* Main Image */}
          <img
            className={`
              w-full h-full object-cover transition-all duration-700
              ${isHovered ? 'scale-105' : 'scale-100'}
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            src={imageError ? createPlaceholderSVG() : (productImage || createPlaceholderSVG())}
            alt={product.name}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg z-10">
              -{discountPercentage}%
            </div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg z-10">
              NEW
            </div>
          )}

       

          {/* Quick Add Button - Appears on Hover at Bottom */}
          <div className={`
            absolute bottom-0 left-0 right-0 transition-all duration-300 z-20
            ${isHovered ? 'translate-y-0' : 'translate-y-full'}
          `}>
            {isInStock() ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
                className="w-full bg-stone-800 text-white py-3 text-sm font-medium hover:bg-stone-900 transition-colors flex items-center justify-center gap-2"
              >
                <CartIcon />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="w-full bg-stone-400 text-white py-3 text-sm font-medium text-center">
                Out of Stock
              </div>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!isInStock() && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-15">
              <span className="text-xs tracking-wider text-stone-600 bg-white/90 px-4 py-2 rounded-full border border-stone-200 shadow-lg">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white">
          
          {/* Brand/Category */}
          <p className="text-[10px] text-amber-600 tracking-[0.2em] uppercase mb-1 font-medium">
            {product.brand || product.category || 'CREATION EMPIRE'}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-stone-800 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array(5).fill('').map((_, i) => (
              <img
                key={i}
                className="w-3 h-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
            <span className="text-[10px] text-stone-400 ml-1">(12)</span>
          </div>

          {/* Price and Cart Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-stone-900">
                  {currency}{displayPrice}
                </span>
                {originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    {currency}{originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Quantity Controls */}
            {cartItems[product._id] ? (
              <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(product._id);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-rose-500 transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm text-stone-700">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product._id);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-emerald-500 transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-stone-400">
                <CheckIcon />
                <span>In Stock</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickView(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6">
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors"
              >
                <CloseIcon />
              </button>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={productImage || createPlaceholderSVG()} 
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-light text-stone-800">{product.name}</h2>
                  <p className="text-stone-600">{product.description || 'Product description goes here...'}</p>
                  <div className="text-3xl font-light text-amber-600">
                    {currency}{displayPrice}
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product._id);
                      setShowQuickView(false);
                    }}
                    className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-900 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;