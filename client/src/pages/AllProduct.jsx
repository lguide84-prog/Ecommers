import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

// Custom Icons
const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

function AllProduct() {
  const { products, search, loading } = useAppContext();
  const [filterProducts, setFilterProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isVisible, setIsVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sectionRef = useRef(null);
  const sortMenuRef = useRef(null);

  // Categories for filtering
  const categories = [
    'Dresses', 'Tops', 'Bottoms', 'Ethnic Wear', 
    'Accessories', 'Footwear', 'Jewelry', 'Bags'
  ];

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

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = products;
      
      // Apply search filter
      if (search && search.length > 0) {
        filtered = products.filter((product) =>
          product.name?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply category filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => 
          selectedCategories.includes(product.category)
        );
      }

      // Apply price filter
      filtered = filtered.filter(product => 
        (product.price || 0) >= priceRange.min && 
        (product.price || 0) <= priceRange.max
      );
      
      setFilterProducts(filtered);
    } else {
      setFilterProducts([]);
    }
  }, [products, search, selectedCategories, priceRange]);

  // Handle sort
  const getSortedProducts = () => {
    let sorted = [...filterProducts];
    
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  const displayedProducts = getSortedProducts();

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('featured');
  };

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  if (loading.products) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 to-[#FFF2D0]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-stone-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-2 border-amber-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-stone-400 tracking-wider mt-6 font-light">CURATING COLLECTION</p>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-stone-50 to-[#FFF2D0] min-h-screen"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <span className="text-amber-600 text-sm tracking-[0.3em] uppercase block mb-4">
              Our Collection
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-stone-800 mb-6">
              All <span className="italic font-serif text-amber-700">Products</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-amber-300 to-amber-500 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-stone-600 text-lg max-w-2xl mx-auto font-light">
              Discover our complete collection of thoughtfully designed pieces, 
              each crafted to celebrate your unique style.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left side - Results count */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-stone-500">
                <span className="font-medium text-stone-800">{displayedProducts.length}</span> products found
                {search && <span className="text-stone-400 ml-2">for "{search}"</span>}
              </p>
              
              {/* Active filters */}
              {(selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 10000 || sortBy !== 'featured') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-3">
              {/* Filter button - Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-stone-200 hover:border-amber-400 transition-colors"
              >
                <FilterIcon />
                <span className="text-sm">Filters</span>
                {(selectedCategories.length > 0) && (
                  <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

             
            </div>
          </div>
        </div>

        {/* Main content with filters sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          
         

          {/* Products Grid */}
          <div className="flex-1">
            {displayedProducts.length === 0 ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-3xl p-12">
                <div className="w-24 h-24 mb-6 text-stone-300">
                  <SearchIcon />
                </div>
                <h3 className="text-xl font-light text-stone-800 mb-2">No products found</h3>
                <p className="text-sm text-stone-400 mb-8 max-w-md">
                  We couldn't find any products matching your criteria. Try adjusting your filters or browse our collection.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-stone-800 text-white text-sm rounded-full hover:bg-stone-900 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={`
                  grid gap-6
                  ${viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                  }
                `}>
                  {displayedProducts.map((product, index) => (
                    <div 
                      key={product._id || index}
                      className={`
                        transform transition-all duration-700
                        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                      `}
                      style={{ transitionDelay: `${index * 100 + 400}ms` }}
                    >
                      <ProductCard 
                        product={product}
                        variant={viewMode === 'list' ? 'expanded' : 'default'}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More */}
                {displayedProducts.length > 0 && (
                  <div className={`mt-16 text-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                    <button className="group px-10 py-4 bg-white border-2 border-stone-200 text-stone-600 text-sm uppercase tracking-wider hover:border-amber-400 hover:bg-amber-400 hover:text-white transition-all duration-500 rounded-full shadow-lg hover:shadow-xl">
                      <span className="relative inline-block">
                        LOAD MORE
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-700"></span>
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Decorative Quote */}
        <div className={`mt-24 text-center max-w-2xl mx-auto transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="relative">
            <span className="text-6xl text-amber-200/50 font-serif absolute -top-8 left-0">"</span>
            <p className="text-base text-stone-500 italic leading-relaxed font-light px-12">
              Each piece is thoughtfully designed to become a cherished part of your wardrobe, 
              celebrating the beauty of timeless elegance.
            </p>
            <span className="text-6xl text-amber-200/50 font-serif absolute -bottom-12 right-0">"</span>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AllProduct;