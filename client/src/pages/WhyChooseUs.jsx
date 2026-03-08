import React, { useState, useEffect } from 'react';

// Custom Icons
const QuoteIcon = () => (
  <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-200" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg 
    className={`w-4 h-4 md:w-5 md:h-5 ${filled ? 'text-amber-400' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const WhyChooseUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1); // Default to 1 for mobile
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const testimonials = [
    {
      id: 1,
      text: "Wearing Creation Empire feels like wearing art. The attention to detail, the way the fabric moves—it's unlike anything I've ever owned.",
      author: "Ananya Sharma",
      location: "Mumbai",
      rating: 5,
      initial: "A",
      bgColor: "from-amber-50 to-rose-50"
    },
    {
      id: 2,
      text: "I've never received so many compliments. The fit is perfection, and knowing it's sustainably made makes me love it even more.",
      author: "Riya Kapoor",
      location: "Delhi",
      rating: 5,
      initial: "R",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      id: 3,
      text: "Creation Empire understands what women want. Elegant, comfortable, and absolutely stunning. My wardrobe has been transformed.",
      author: "Meera Reddy",
      location: "Bangalore",
      rating: 5,
      initial: "M",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      id: 4,
      text: "The craftsmanship is exceptional. Every piece I've bought feels like it was made just for me. Absolutely love the brand!",
      author: "Priyanka Singh",
      location: "Jaipur",
      rating: 5,
      initial: "P",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      id: 5,
      text: "Finally a brand that understands modern Indian women. The designs are contemporary yet rooted in tradition. Perfection!",
      author: "Kavita Joshi",
      location: "Pune",
      rating: 5,
      initial: "K",
      bgColor: "from-orange-50 to-amber-50"
    },
    {
      id: 6,
      text: "The quality and design are unmatched. Every piece feels special and unique. Creation Empire is my go-to brand now.",
      author: "Shruti Desai",
      location: "Ahmedabad",
      rating: 5,
      initial: "S",
      bgColor: "from-cyan-50 to-blue-50"
    }
  ];

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, itemsPerView]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - itemsPerView : prevIndex - 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCurrentIndex((prevIndex) => 
      prevIndex >= testimonials.length - itemsPerView ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Generate star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 justify-center mb-3 md:mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>
    );
  };

  // Calculate max index for dots
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  return (
    <div className="w-full bg-gradient-to-b from-white to-stone-50 py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2">
          <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-stone-400 font-light block mb-2 sm:mb-3">
            Client Stories
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-stone-800 mb-3 sm:mb-4 leading-tight">
            What Our <span className="italic font-serif text-amber-700">Community</span> Says
          </h2>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-12 h-px bg-amber-300"></div>
            <span className="text-stone-400 text-xs sm:text-base">✦</span>
            <div className="w-8 sm:w-12 h-px bg-rose-300"></div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative px-2 sm:px-4 md:px-8">
          {/* Cards Container with Touch Support */}
          <div 
            className="overflow-hidden rounded-xl sm:rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` 
              }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className={`w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3 md:px-4`}
                >
                  <div className={`
                    relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 
                    shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-500
                    border border-stone-100 h-full flex flex-col
                    group hover:-translate-y-1
                  `}>
                    {/* Decorative Elements - Hidden on very small screens */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <QuoteIcon />
                    </div>

                    {/* Background Gradient on Hover */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${testimonial.bgColor} 
                      opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl sm:rounded-2xl
                    `}></div>

                    {/* Content - Relative to appear above background */}
                    <div className="relative z-10">
                      {/* Initial/Avatar with modern design */}
                      <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity"></div>
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center border-2 border-white shadow-md sm:shadow-lg">
                            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone-700 font-light">
                              {testimonial.initial}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      {renderStars(testimonial.rating)}

                      {/* Testimonial Text */}
                      <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-5 md:mb-6 text-center italic px-1">
                        "{testimonial.text.length > 100 ? `${testimonial.text.substring(0, 100)}...` : testimonial.text}"
                      </p>

                      {/* Author Info */}
                      <div className="mt-auto text-center">
                        <p className="font-medium text-stone-800 text-sm sm:text-base md:text-lg">
                          {testimonial.author}
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-stone-400 mt-0.5 sm:mt-1 flex items-center justify-center gap-1">
                          <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-stone-300"></span>
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Hidden on Mobile, Visible on Tablet/Desktop */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:-ml-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg hover:shadow-xl text-stone-600 hover:text-stone-900 transition-all duration-300 items-center justify-center focus:outline-none border border-stone-200 hover:border-stone-300 z-20"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon />
          </button>
          
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:-mr-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg hover:shadow-xl text-stone-600 hover:text-stone-900 transition-all duration-300 items-center justify-center focus:outline-none border border-stone-200 hover:border-stone-300 z-20"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon />
          </button>

          {/* Mobile Swipe Indicator */}
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="flex items-center gap-1 px-3 py-1 bg-stone-100 rounded-full">
              <span className="text-[8px] text-stone-400">←</span>
              <span className="text-[8px] text-stone-400 uppercase tracking-wider">Swipe</span>
              <span className="text-[8px] text-stone-400">→</span>
            </div>
          </div>

        

          {/* Dots Indicator - Mobile Optimized */}
          <div className="flex justify-center mt-4 sm:mt-6 gap-1.5 sm:gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative h-1.5 sm:h-2 transition-all duration-300 ${
                  currentIndex === index ? 'w-6 sm:w-8' : 'w-1.5 sm:w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className={`
                  absolute inset-0 rounded-full transition-all duration-300
                  ${currentIndex === index 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                    : 'bg-stone-300 group-hover:bg-stone-400'
                  }
                `} />
              </button>
            ))}
          </div>

        
        </div>

      </div>
    </div>
  );
};

export default WhyChooseUs;