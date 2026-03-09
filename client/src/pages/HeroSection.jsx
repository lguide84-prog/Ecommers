import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

// Import laptop/desktop videos
import laptopVideo1 from '/public/vl1.mp4';
import laptopVideo2 from '/public/vl2.mp4';
import laptopVideo3 from '/public/vl3.mp4';
// Import mobile videos
import mobileVideo1 from '/public/vi2.mp4';
import mobileVideo2 from '/public/vi1.mp4';
import mobileVideo3 from '/public/vi3.mp4';

// Custom Icons
const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MuteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const UnmuteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

function HeroSection() {
  const { navigate } = useAppContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Refs for video elements
  const laptopVideoRefs = useRef([]);
  const mobileVideoRefs = useRef([]);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Laptop/Desktop videos data
  const laptopVideos = [
    {
      id: 1,
      src: laptopVideo3,
      alt: "Laptop Heritage Collection",
      title: "Heritage Collection",
      subtitle: "Timeless Weaves",
      color: "from-amber-900/40"
    },
    {
      id: 2,
      src: laptopVideo1,
      alt: "Laptop Heritage Collection",
      title: "Heritage Collection",
      subtitle: "Timeless Weaves",
      color: "from-amber-900/40"
    },
    {
      id: 3,
      src: laptopVideo2,
      alt: "Laptop Contemporary Grace",
      title: "Contemporary Grace",
      subtitle: "Modern Silhouettes",
      color: "from-rose-900/40"
    }
  ];

  // Mobile videos data
  const mobileVideos = [
    {
      id: 1,
      src: mobileVideo1,
      alt: "Mobile Heritage Collection",
      title: "Heritage Collection",
      subtitle: "Timeless Weaves",
      color: "from-amber-900/40"
    },
    {
      id: 2,
      src: mobileVideo2,
      alt: "Mobile Contemporary Grace",
      title: "Contemporary Grace",
      subtitle: "Modern Silhouettes",
      color: "from-rose-900/40"
    },
    {
      id: 3,
      src: mobileVideo3,
      alt: "Mobile Contemporary Grace",
      title: "Contemporary Grace",
      subtitle: "Modern Silhouettes",
      color: "from-rose-900/40"
    }
  ];

  // Get current videos based on screen size
  const currentVideos = isMobile ? mobileVideos : laptopVideos;
  const videoRefs = isMobile ? mobileVideoRefs : laptopVideoRefs;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle video playback based on current slide
  useEffect(() => {
    // Pause all videos first
    if (videoRefs.current) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }

    // Play current video
    const currentVideo = videoRefs.current?.[currentSlide];
    if (currentVideo && isAutoPlaying) {
      currentVideo.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [currentSlide, isAutoPlaying, isMobile, videoRefs]);

  // Handle video end
  const handleVideoEnd = () => {
    setCurrentSlide((prev) => (prev + 1) % currentVideos.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % currentVideos.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + currentVideos.length) % currentVideos.length);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % currentVideos.length);
  }, [currentVideos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + currentVideos.length) % currentVideos.length);
  }, [currentVideos.length]);

  // Toggle mute for all videos
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRefs.current) {
      videoRefs.current.forEach(video => {
        if (video) {
          video.muted = !isMuted;
        }
      });
    }
  };

  // Add error handling for videos
  const [videoErrors, setVideoErrors] = useState({});

  const handleVideoError = (videoId, deviceType) => {
    setVideoErrors(prev => ({
      ...prev,
      [`${deviceType}-${videoId}`]: true
    }));
  };

  return (
    <section className="relative w-full h-screen bg-stone-950 overflow-hidden">
      {/* Full-screen Video Slider - No padding */}
      <div 
        className="absolute inset-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentVideos.map((video, index) => (
          <div
            key={`${isMobile ? 'mobile' : 'laptop'}-${video.id}`}
            className={`absolute inset-0 transition-opacity duration-1500 ease-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Video Player */}
            <video
              ref={el => {
                if (isMobile) {
                  mobileVideoRefs.current[index] = el;
                } else {
                  laptopVideoRefs.current[index] = el;
                }
              }}
              className="absolute inset-0 w-full h-full object-cover"
              src={video.src}
              muted={isMuted}
              loop={false}
              playsInline
              onEnded={handleVideoEnd}
              onError={() => handleVideoError(video.id, isMobile ? 'mobile' : 'laptop')}
              onLoadedData={(e) => {
                setVideoErrors(prev => ({
                  ...prev,
                  [`${isMobile ? 'mobile' : 'laptop'}-${video.id}`]: false
                }));
              }}
            />
            
            {/* Fallback if video fails to load */}
            {videoErrors[`${isMobile ? 'mobile' : 'laptop'}-${video.id}`] && (
              <div className="absolute inset-0 bg-stone-800 flex items-center justify-center text-stone-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>Video not available</p>
                </div>
              </div>
            )}
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${video.color} via-transparent to-stone-950/90`} />
            
            {/* Slide Content */}
            <div className="absolute inset-0 flex items-end pb-16 lg:pb-24">
              <div className="w-full px-6 lg:px-16">
                <div className="max-w-2xl">
                  <div className={`transform transition-all duration-1000 delay-500 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}>
                    
                    {/* Shop Now Button - Bottom aligned */}
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 text-sm uppercase tracking-[0.3em] hover:bg-stone-100 transition-all duration-700 group exo"
                    >
                      Shop Now
                      <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
              <div 
                className="h-full bg-white/50 transition-all duration-300"
                style={{ 
                  width: index === currentSlide ? '100%' : '0%',
                  transition: `width ${currentVideos[currentSlide]?.duration || 5}s linear`
                }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 right-12 transform -translate-y-1/2 hidden lg:block">
              <div className="text-white/20 text-[8px] rotate-90 origin-left whitespace-nowrap tracking-[0.8em] uppercase">
                {video.subtitle.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {currentVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`group relative transition-all duration-500 ${
              index === currentSlide ? 'w-12' : 'w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className={`block h-0.5 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-12 bg-white' 
                : 'w-2 bg-white/50 group-hover:bg-white/80'
            }`} />
          </button>
        ))}
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => {
            setIsAutoPlaying(!isAutoPlaying);
            const currentVideo = videoRefs.current?.[currentSlide];
            if (currentVideo) {
              if (isAutoPlaying) {
                currentVideo.pause();
              } else {
                currentVideo.play().catch(error => {
                  console.log("Video play failed:", error);
                });
              }
            }
          }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* Side Editorial Labels */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block z-20">
        <div className="relative">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="text-white/30 text-[8px] rotate-90 origin-left whitespace-nowrap tracking-[0.8em] uppercase font-light transform -translate-y-1/2">
            TIMELESS
          </div>
        </div>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block z-20">
        <div className="relative">
          <div className="text-white/30 text-[8px] -rotate-90 origin-right whitespace-nowrap tracking-[0.8em] uppercase font-light transform -translate-y-1/2">
            ELEGANCE
          </div>
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;