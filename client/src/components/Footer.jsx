import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Social Icons - Updated with better visibility
const InstagramIcon = () => (
  <svg
    className="w-5 h-5 md:w-6 md:h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState({});

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Toggle mobile menu sections
  const toggleSection = (title) => {
    setMobileMenuOpen(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Show scroll to top button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const footerSections = [
    {
      title: "Support",
      links: [
        { text: "Collection", url: "/products" },
        { text: "Contact", url: "/contact" },
        { text: "FAQs", url: "/faqs" },
        { text: "Shipping", url: "/shipping" }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Careers", url: "/careers" },
        { text: "Press", url: "/press" },
        { text: "Sustainability", url: "/sustainability" }
      ]
    },
    {
      title: "Follow Us",
      isSocial: true,
      links: [
        {
          name: "Instagram",
          url: "https://www.instagram.com/creationempirebypriya",
          icon: <InstagramIcon />,
          handle: "@creationempire",
          color: "hover:text-pink-500"
        },
        {
          name: "Facebook",
          url: "https://www.facebook.com/creationempire",
          icon: <FacebookIcon />,
          handle: "/creationempire",
          color: "hover:text-blue-500"
        },
        {
          name: "YouTube",
          url: "https://youtube.com/@creationempire",
          icon: <YouTubeIcon />,
          handle: "Creation Empire TV",
          color: "hover:text-red-500"
        }
      ]
    }
  ];

  return (
    <footer 
      className="relative mt-16 md:mt-24 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('./foo.jpg')" 
      }}
    >
      {/* Dark overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/70"></div>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon />
        </button>
      )}
      
      {/* Content - with relative z-index to appear above overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        
        {/* Responsive Grid: Mobile - 1 column, Tablet - 2 columns, Desktop - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          
          {/* Brand Section - Full width on all devices */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-4 md:space-y-6 text-left">
            <Link to="/" className="inline-block group">
              <h2 className="text-xl sm:text-2xl tracking-[0.2em] font-light text-white group-hover:text-amber-400 transition-colors duration-300">
                CREATION EMPIRE
              </h2>
              <p className="text-[10px] sm:text-xs tracking-widest mt-1 text-amber-400">
                BY PRIYA
              </p>
            </Link>
            
            <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
              Where every stitch tells a story. Luxury fashion crafted for the modern woman who embraces her power with grace.
            </p>
            
            {/* Contact Info - Left aligned */}
            <div className="space-y-3 pt-2">
              <a 
                href="mailto:info@creationempire.com" 
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors group"
              >
                <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                  <MailIcon />
                </span>
                <span className="group-hover:underline">info@creationempire.com</span>
              </a>
              <a 
                href="tel:+917906482210" 
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white transition-colors group"
              >
                <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                  <PhoneIcon />
                </span>
                <span className="group-hover:underline">+91 79064 82210</span>
              </a>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <span className="text-amber-400">
                  <LocationIcon />
                </span>
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Dynamic Sections - Mobile Accordion Style */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              {/* Mobile Accordion Header */}
              <div 
                className="sm:hidden flex items-center justify-between cursor-pointer py-3 border-b border-gray-700/60"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-sm uppercase tracking-wider text-amber-400 font-medium">
                  {section.title}
                </h3>
                <span className="text-amber-400 text-lg">
                  {mobileMenuOpen[section.title] ? '−' : '+'}
                </span>
              </div>

              {/* Desktop Title */}
              <h3 className="hidden sm:block text-sm uppercase tracking-wider text-amber-400 font-medium mb-4 md:mb-6 relative">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-400/50 rounded-full"></span>
              </h3>

              {/* Links - Hidden on mobile when closed, always visible on desktop */}
              <div className={`${!mobileMenuOpen[section.title] && 'hidden sm:block'} mt-2 sm:mt-0`}>
                {section.isSocial ? (
                  <ul className="space-y-3 md:space-y-4 py-2 sm:py-0">
                    {section.links.map((social, i) => (
                      <li key={i}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-all duration-300 group ${social.color}`}
                        >
                          <span className="flex-shrink-0 transform group-hover:scale-110 group-hover:text-amber-400 transition-all duration-300">
                            {social.icon}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-medium leading-none group-hover:text-amber-400 transition-colors">
                              {social.name}
                            </span>
                            <span className="text-[8px] sm:text-[10px] text-gray-500 mt-1">
                              {social.handle}
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2 md:space-y-3 py-2 sm:py-0">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link
                          to={link.url}
                          className="text-xs sm:text-sm text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 inline-block relative group"
                        >
                          <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <div className="mt-8 pt-6 border-t border-gray-700/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            
            {/* Copyright */}
            <p className="text-[10px] sm:text-xs text-gray-400 order-2 sm:order-1">
              © {currentYear} Creation Empire by Priya. All rights reserved.
            </p>
            
            {/* Legal Links - Horizontal scroll on mobile if needed */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 order-1 sm:order-2">
              <Link to="/privacy" className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors relative group whitespace-nowrap">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link to="/terms" className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors relative group whitespace-nowrap">
                Terms
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <Link to="/returns" className="text-[10px] sm:text-xs text-gray-400 hover:text-white transition-colors relative group whitespace-nowrap">
                Returns
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
          
          {/* Made with love */}
          <p className="text-center text-[8px] text-gray-600 mt-4">
            Made with ❤️ by Creation Empire team in India
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;