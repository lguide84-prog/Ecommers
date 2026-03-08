import React, { useState, useEffect } from 'react';

// Custom Icons
const HeartIcon = ({ filled }) => (
  <svg className={`w-5 h-5 transition-colors ${filled ? 'fill-rose-500 text-rose-500' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ImageShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [likedImages, setLikedImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { 
      id: 1, 
      title: "Ethereal Elegance", 
      category: "Evening Wear",
      description: "Hand-embroidered silk that catches the moonlight",
      year: "2024",
      dimension: "Custom Made",
      color: "from-rose-500/20 to-purple-500/20",
      accent: "rose",
      likes: 234,
      url: "./img1.jpg"
    },
    { 
      id: 2, 
      title: "Modern Heritage", 
      category: "Fusion Wear",
      description: "Where tradition meets contemporary silhouette",
      year: "2024",
      dimension: "Limited Edition",
      color: "from-blue-500/20 to-teal-500/20",
      accent: "blue",
      likes: 189,
      url: "./red white1.jpeg"
    },
    { 
      id: 3, 
      title: "Midnight Bloom", 
      category: "Cocktail",
      description: "Floral motifs on midnight blue fabric",
      year: "2024",
      dimension: "Exclusive",
      color: "from-indigo-500/20 to-violet-500/20",
      accent: "indigo",
      likes: 312,
      url: "./red with print.jpeg"
    },
    { 
      id: 4, 
      title: "Royal Legacy", 
      category: "Bridal",
      description: "Timeless elegance for your special day",
      year: "2024",
      dimension: "Bespoke",
      color: "from-amber-500/20 to-orange-500/20",
      accent: "amber",
      likes: 456,
      url: "./red with print2.jpeg"
    },
    { 
      id: 5, 
      title: "Urban Grace", 
      category: "Pret",
      description: "Effortless style for the modern woman",
      year: "2024",
      dimension: "Ready to Wear",
      color: "from-emerald-500/20 to-green-500/20",
      accent: "emerald",
      likes: 167,
      url: "./red with print3.jpeg"
    },
    { 
      id: 6, 
      title: "Golden Hour", 
      category: "Resort Wear",
      description: "Lightweight fabrics with subtle shimmer",
      year: "2024",
      dimension: "Seasonal",
      color: "from-yellow-500/20 to-amber-500/20",
      accent: "yellow",
      likes: 278,
      url: "./img2.jpg"
    },
    { 
      id: 7, 
      title: "Mystic Moon", 
      category: "Indo-Western",
      description: "Fusion of cultures in perfect harmony",
      year: "2024",
      dimension: "Signature",
      color: "from-purple-500/20 to-pink-500/20",
      accent: "purple",
      likes: 345,
      url: "./red white2.jpeg"
    },
    { 
      id: 8, 
      title: "Eternal Love", 
      category: "Special Occasion",
      description: "Celebrate life's precious moments",
      year: "2024",
      dimension: "Prestige",
      color: "from-red-500/20 to-rose-500/20",
      accent: "red",
      likes: 423,
      url: "./img1.jpg"
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    document.querySelectorAll('[data-id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLike = (e, id) => {
    e.stopPropagation();
    setLikedImages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      

      {/* Main Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Gallery Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-stone-800 mb-4">
            Featured <span className="italic font-serif text-amber-600">Collection</span>
          </h2>
          <p className="text-stone-400 text-sm max-w-2xl mx-auto">
            Explore our carefully curated selection of eight exclusive pieces, 
            each telling its own unique story through design and craftsmanship.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
          {images.map((image, index) => (
            <div
              key={image.id}
              data-id={image.id}
              className={`relative group cursor-pointer transform transition-all duration-700 ${
                isVisible[image.id] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveIndex(image.id)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => handleImageClick(image)}
            >
              {/* Image Container with Creative Shapes */}
              <div className={`
                relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500
                ${index % 4 === 0 ? 'aspect-[3/4]' : 
                  index % 4 === 1 ? 'aspect-[2/3]' : 
                  index % 4 === 2 ? 'aspect-[3/4]' : 
                  'aspect-[4/5]'}
                ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}
              `}>
                {/* Image with Gradient Overlay */}
                <img 
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${image.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Hover Content */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                  flex items-end p-6
                  transition-all duration-500
                  ${activeIndex === image.id ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="text-white transform translate-y-0">
                    <span className="text-xs tracking-[0.2em] text-amber-400 block mb-2">
                      {image.category}
                    </span>
                    <h3 className="text-lg font-medium mb-1">{image.title}</h3>
                    <p className="text-sm text-white/80 mb-3 line-clamp-2">{image.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{image.dimension}</span>
                      <button 
                        onClick={(e) => handleLike(e, image.id)}
                        className="flex items-center gap-1"
                      >
                        <HeartIcon filled={likedImages[image.id]} />
                        <span className="text-xs">{image.likes + (likedImages[image.id] ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className={`
                  absolute top-4 right-4 flex gap-2
                  transition-all duration-300
                  ${activeIndex === image.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                `}>
                 
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/30"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/30"></div>
                
                {/* Image Number */}
                <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                  {String(image.id).padStart(2, '0')}
                </div>

                {/* Year Badge */}
                <div className="absolute top-4 left-4 text-white/70 text-xs bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {image.year}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Stats Bar */}
        <div className="mt-24 py-12 bg-gradient-to-r from-stone-50 to-stone-100 rounded-3xl">
          <div className="flex flex-wrap justify-around items-center gap-8">
            <div className="text-center group">
              <p className="text-4xl font-light text-amber-600 group-hover:scale-110 transition-transform">08</p>
              <p className="text-xs text-stone-400 tracking-wider mt-2">EXQUISITE PIECES</p>
            </div>
            <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
            <div className="text-center group">
              <p className="text-4xl font-light text-amber-600 group-hover:scale-110 transition-transform">06</p>
              <p className="text-xs text-stone-400 tracking-wider mt-2">COLLECTIONS</p>
            </div>
            <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
            <div className="text-center group">
              <p className="text-4xl font-light text-amber-600 group-hover:scale-110 transition-transform">24/7</p>
              <p className="text-xs text-stone-400 tracking-wider mt-2">INQUIRIES</p>
            </div>
            <div className="w-px h-12 bg-stone-200 hidden md:block"></div>
            <div className="text-center group">
              <p className="text-4xl font-light text-amber-600 group-hover:scale-110 transition-transform">∞</p>
              <p className="text-xs text-stone-400 tracking-wider mt-2">INSPIRATION</p>
            </div>
          </div>
        </div>

       
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
          
          <button 
            onClick={handlePrev}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeftIcon />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowRightIcon />
          </button>

          <div className="max-w-5xl w-full mx-4">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            <div className="text-white text-center mt-6">
              <h3 className="text-2xl font-light mb-2">{selectedImage.title}</h3>
              <p className="text-stone-400">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

    
      
    

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
};

export default ImageShowcase;