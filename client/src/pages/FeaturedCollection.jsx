import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

// Custom Icons
const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg
    className={`w-3 h-3 ${filled ? "text-amber-400" : "text-stone-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

function FeaturedCollection() {
  const { navigate } = useAppContext();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [stopScroll, setStopScroll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const featuredProducts = [
    {
      id: 1,
      name: "Red Floral Silk",
      brand: "ESSENTIALS",
      price: 6999,
      originalPrice: 8999,
      image: "./red with print.jpeg",
      hoverImage: "./red with print.jpeg",
      size: "large",
      color: "Crimson",
      isNew: true,
    },
    {
      id: 2,
      name: "Crimson Contrast",
      brand: "COLLECTION",
      price: 6999,
      originalPrice: 8999,
      image: "./red white1.jpeg",
      hoverImage: "./red white1.jpeg",
      size: "small",
      color: "Scarlet",
      isNew: false,
    },
    {
      id: 3,
      name: "Red Velvate",
      brand: "COLLECTION",
      price: 6999,
      originalPrice: 8999,
      image: "./red (1).jpeg",
      hoverImage: "./red (1).jpeg",
      size: "medium",
      color: "Burgundy",
      isNew: true,
    },
    {
      id: 4,
      name: "Ivory Satin",
      brand: "EDIT",
      price: 6999,
      originalPrice: 8999,
      image: "./white.jpeg",
      hoverImage: "./white.jpeg",
      size: "medium",
      color: "Ivory",
      isNew: false,
    },
    {
      id: 5,
      name: "Cream Luxe Knit",
      brand: "LUXE",
      price: 6999,
      originalPrice: 8999,
      image: "./red (5).jpeg",
      hoverImage: "./red (5).jpeg",
      size: "small",
      color: "Champagne",
      isNew: false,
    },
    {
      id: 6,
      name: "Scarlet Print",
      brand: "BASIC",
      price: 6999,
      originalPrice: 8999,
      image: "./red with print.jpeg",
      hoverImage: "./red with print.jpeg",
      size: "medium",
      color: "Scarlet",
      isNew: true,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products`);
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white overflow-hidden"
    >
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="container mx-auto px-">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20  md:px-12 lg:px-8">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-amber-300"></span>
              <span className="text-xs tracking-[0.3em] uppercase text-stone-400 font-light">
                Curated Selection
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 mb-3 tracking-tight">
              Featured
              <span className="block text-amber-800/70 font-serif italic text-3xl md:text-4xl mt-2">
                Collection
              </span>
            </h2>
            
            <p className="text-stone-500 text-sm max-w-md mt-4 font-light leading-relaxed">
              Discover our handpicked selection of timeless pieces, 
              where contemporary design meets enduring elegance.
            </p>
          </div>
          
          <Link 
            to="/products" 
            className="group hidden md:flex items-center gap-3 px-6 py-3 border border-stone-200 hover:border-stone-800 rounded-full transition-all duration-500 hover:bg-stone-800 hover:text-white mt-8 md:mt-0"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium">Explore Collection</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRightIcon />
            </span>
          </Link>
        </div>

        {/* Marquee Scroll Section */}
        <div
          className="overflow-hidden w-full relative mb-16"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          {/* Left Gradient */}
         

          {/* Marquee Container */}
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: featuredProducts.length * 3 + "s",
            }}
          >
            {/* Double the products for seamless loop */}
            <div className="flex">
              {[...featuredProducts, ...featuredProducts].map(
                (product, index) => (
                  <div
                    key={index}
                    className="w-64 mx-4 group cursor-pointer transition-all duration-500 "
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative">
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 "
                        />


                        {/* Quick Add Overlay - Appears on hover */}
                       
                      </div>

                      {/* Product Info */}
                      <div className="text-left">
                       

                        {/* Brand */}
                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                          {product.brand}
                        </p>

                        {/* Product Name */}
                        <h3 className="text-sm text-stone-800 mb-2 line-clamp-2 font-medium">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-stone-900">
                            ₹{product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-stone-400 line-through">
                            ₹{product.originalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

         
        </div>

      

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-300 text-sm uppercase tracking-wider"
          >
            View All Products
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
