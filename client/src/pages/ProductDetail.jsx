import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

// Custom Icons
const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ShippingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const ReturnIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ProductDetail = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [related, setRelated] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const relatedProducts = products
        .filter((item) => item._id !== product._id)
        .slice(0, 5);
      setRelated(relatedProducts);
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setThumbnail(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product._id, quantity);
    
    const btn = document.getElementById('add-to-cart-btn');
    btn.classList.add('bg-amber-50', 'text-amber-600');
    setTimeout(() => {
      btn.classList.remove('bg-amber-50', 'text-amber-600');
    }, 300);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product._id, quantity);
    navigate("/cart");
  };

  const displayPrice = product?.discountPrice || product?.price;
  const originalPrice = product?.discountPrice ? product?.price : null;
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0;

  const hasSizes = product?.sizes && product.sizes.length > 0;
  const hasColors = product?.colors && product.colors.length > 0;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-20">
        <div className="w-32 h-32 mb-8 opacity-20">
          <svg className="w-full h-full text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-2xl font-light text-stone-700 mb-3">Product not found</h3>
        <p className="text-base text-stone-400 mb-8 max-w-md font-light">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="group px-10 py-5 bg-stone-800 text-white text-sm uppercase tracking-wider hover:bg-stone-900 transition-all duration-500 rounded-full shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center gap-3">
            CONTINUE SHOPPING
            <ArrowRightIcon />
          </span>
        </button>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-stone-50 via-white to-stone-50 overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-stone-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className={`mb-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <nav className="flex items-center text-xs tracking-wide text-stone-400 font-light">
            <Link to="/" className="hover:text-amber-500 transition-colors">HOME</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-amber-500 transition-colors">COLLECTION</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-600">{product.category || 'PRODUCT'}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Product Images Section */}
          <div className={`lg:w-3/5 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="flex gap-4">
              {/* Thumbnail Strip */}
              <div className="flex flex-col gap-3 w-20">
                {product.images && product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`
                      relative aspect-[3/4] border overflow-hidden transition-all duration-300 rounded-2xl
                      ${thumbnail === image 
                        ? 'border-amber-400 ring-2 ring-amber-200' 
                        : 'border-stone-200 hover:border-stone-400'
                      }
                    `}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden group rounded-[3rem] shadow-lg">
                  <img
                    src={thumbnail || product.images?.[0] || "https://via.placeholder.com/800x1000?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x1000?text=No+Image";
                    }}
                  />
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

                  {/* Wishlist Button */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                  >
                    <HeartIcon filled={isWishlisted} />
                  </button>

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-6 left-6 bg-amber-400 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg">
                      -{discountPercentage}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className={`lg:w-2/5 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="sticky top-24">
              {/* Title & Share */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-800 leading-tight tracking-tight">
                  {product.name}
                </h1>
                <button className="text-stone-400 hover:text-amber-500 transition-colors">
                  <ShareIcon />
                </button>
              </div>

              {/* Product Code */}
              <p className="text-xs text-stone-400 tracking-wider mt-3 font-light">
                SKU: {product._id?.slice(-8) || 'N/A'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-0.5">
                  {Array(5).fill('').map((_, i) => (
                    <img
                      key={i}
                      src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                      alt="star"
                      className="w-4 h-4 opacity-75"
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-400 font-light">(12 reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-8 pb-8 border-b border-stone-100">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-light text-amber-600">₹{displayPrice}</span>
                  {originalPrice && (
                    <>
                      <span className="text-xl text-stone-300 line-through">₹{originalPrice}</span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
                        SAVE ₹{originalPrice - displayPrice}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-3 font-light">inclusive of all taxes</p>
              </div>

             

              {/* Size Selection */}
              {hasSizes && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs uppercase tracking-wider text-stone-500 font-light">Size</p>
                    <button className="text-xs text-amber-600 hover:text-amber-700 transition-colors font-light">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size.size)}
                        disabled={size.stock === 0}
                        className={`
                          min-w-[4rem] px-4 py-3 text-sm border transition-all duration-300 rounded-full
                          ${selectedSize === size.size
                            ? 'border-amber-400 bg-amber-50 text-amber-600'
                            : size.stock > 0
                            ? 'border-stone-200 text-stone-600 hover:border-stone-400'
                            : 'border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed'
                          }
                        `}
                      >
                        {size.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-4 font-light">Quantity</p>
                <div className="flex items-center border border-stone-200 rounded-full w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-14 text-center text-sm text-stone-600 font-light">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-4 border border-stone-300 text-stone-700 text-sm tracking-wider hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-all duration-500 rounded-full"
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-4 bg-stone-800 text-white text-sm tracking-wider hover:bg-stone-900 transition-all duration-500 rounded-full shadow-lg hover:shadow-xl"
                >
                  BUY NOW
                </button>
              </div>

              {/* Product Features */}
              <div className="mt-10 grid grid-cols-2 gap-4 p-6 bg-stone-50/80 rounded-2xl">
                <div className="flex items-center gap-3 text-xs text-stone-500 font-light">
                  <ShippingIcon />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 font-light">
                  <ReturnIcon />
                  <span>30-day returns</span>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="mt-10 border-t border-stone-100 pt-8">
                <div className="flex gap-8 border-b border-stone-100">
                  {['description', 'details', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        pb-4 text-xs uppercase tracking-wider transition-all duration-300 font-light
                        ${activeTab === tab
                          ? 'text-stone-800 border-b-2 border-amber-400'
                          : 'text-stone-400 hover:text-stone-600'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 text-sm text-stone-600 leading-relaxed font-light">
                  {activeTab === 'description' && (
                    <p>{product.description || 'Experience the perfect blend of contemporary design and timeless elegance with this carefully crafted piece.'}</p>
                  )}
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p>Material: 100% Cotton</p>
                      <p>Care: Machine wash cold</p>
                      <p>Fit: Regular fit</p>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-2">
                      <p>Free shipping on orders above ₹999</p>
                      <p>Estimated delivery: 3-5 business days</p>
                      <p>Easy 30-day returns</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className={`mt-20 pt-16 border-t border-stone-100 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="w-12 h-[2px] bg-amber-300"></span>
                <span className="text-xs tracking-[0.3em] uppercase text-stone-400 font-light">
                  Complete the look
                </span>
                <span className="w-12 h-[2px] bg-amber-300"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-stone-800 tracking-tight">
                You may also like
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
              {related.map((pro, index) => (
                <div 
                  key={pro._id || index}
                  className="transform transition-all duration-1000"
                  style={{ transitionDelay: `${index * 100 + 800}ms` }}
                >
                  <ProductCard product={pro} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decorative Note */}
        <div className={`mt-24 text-center max-w-2xl mx-auto transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="relative">
            <span className="text-6xl text-amber-200/50 font-serif absolute -top-8 left-0">"</span>
            <p className="text-sm text-stone-400 italic leading-relaxed font-light px-12">
              Each piece is thoughtfully designed to become a cherished part of your wardrobe, 
              celebrating the beauty of timeless elegance.
            </p>
            <span className="text-6xl text-amber-200/50 font-serif absolute -bottom-12 right-0">"</span>
          </div>
          <div className="mt-6 w-8 h-[1px] bg-stone-200 mx-auto"></div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;