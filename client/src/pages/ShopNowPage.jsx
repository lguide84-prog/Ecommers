import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ShopNowPage() {
  const [currentBg, setCurrentBg] = useState(0);

  // Background images array
  const backgrounds = [
    {
      url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Fashion Collection"
    },
    {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Luxury Fashion"
    },
    {
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Designer Collection"
    }
  ];

  // Auto-change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images with Fade Effect */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBg ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={bg.url}
            alt={bg.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center ">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-4 exo">
            Shop the Latest
          </h1>
          
          <p className="text-lg md:text-2xl font-light mb-8 exo">
            Discover our newest collection
          </p>
          
          <div className="w-24 h-px bg-white/50 mx-auto mb-8"></div>
          
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 text-sm uppercase tracking-[0.2em] hover:bg-stone-100 transition-all duration-500"
          >
            <span>Shop Now</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBg(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentBg 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase">
        Creation Empire by Priya
      </div>
    </div>
  );
}

export default ShopNowPage;