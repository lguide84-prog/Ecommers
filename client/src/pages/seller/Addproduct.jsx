import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from "../../context/AppContext";
import toast from 'react-hot-toast';

// Custom Icons
const UploadIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function Addproduct() {
  const { axios, isSeller, navigate } = useAppContext();
  
  // Basic Information (Matches Schema)
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Changed to single string
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState(""); // Changed from offerPrice
  
  // Inventory
  const [sizes, setSizes] = useState([]);
  const [currentSize, setCurrentSize] = useState({ size: "", stock: "" });
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState({ name: "", hexCode: "" });
  
  // Status
  const [featured, setFeatured] = useState(false);
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enums from schema
  const sizeEnum = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE SIZE'];

  // Add size
  const addSize = () => {
    if (currentSize.size && currentSize.stock) {
      setSizes([...sizes, { 
        size: currentSize.size, 
        stock: Number(currentSize.stock) 
      }]);
      setCurrentSize({ size: "", stock: "" });
    }
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Add color
  const addColor = () => {
    if (currentColor.name) {
      setColors([...colors, { 
        name: currentColor.name,
        hexCode: currentColor.hexCode || undefined
      }]);
      setCurrentColor({ name: "", hexCode: "" });
    }
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSeller) {
      toast.error("Please login as seller first");
      navigate('/seller');
      return;
    }

    // Basic validation (matching schema requirements)
    if (!name) return toast.error("Product name is required");
    if (!description) return toast.error("Product description is required");
    if (!price) return toast.error("Price is required");
    if (files.length === 0 || !files[0]) return toast.error("At least one image is required");

    setIsSubmitting(true);

    try {
      // Prepare product data exactly matching schema
      const productData = {
        name,
        description, // Now a single string, not array
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        featured,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined
      };

      // Create FormData
      const formData = new FormData();
      
      // Append product data as JSON string
      formData.append("productData", JSON.stringify(productData));

      // Append images (only valid files)
      files.filter(file => file instanceof File).forEach((file) => {
        formData.append("images", file);
      });

      // Submit
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        toast.success("Product added successfully!");
        
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setDiscountPrice("");
        setSizes([]);
        setColors([]);
        setFeatured(false);
        setFiles([]);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-gray-900">
                Add New <span className="font-medium text-amber-600">Product</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create a new product for your store
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/seller/product-list')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Publish Product'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              
              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Classic Cotton T-Shirt"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-amber-600">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your product in detail..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition resize-none"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Price (₹) <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="999"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="799"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave empty if no discount</p>
                </div>
              </div>
            </div>

            {/* Inventory - Sizes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sizes & Stock</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <select
                  value={currentSize.size}
                  onChange={(e) => setCurrentSize({ ...currentSize, size: e.target.value })}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                >
                  <option value="">Select Size</option>
                  {sizeEnum.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={currentSize.stock}
                  onChange={(e) => setCurrentSize({ ...currentSize, stock: e.target.value })}
                  placeholder="Stock Quantity"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                  min="0"
                />
                <button
                  type="button"
                  onClick={addSize}
                  disabled={!currentSize.size || !currentSize.stock}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Size
                </button>
              </div>

              <div className="space-y-2">
                {sizes.map((size, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Size: {size.size}</span>
                      <span className="text-sm text-gray-600">Stock: {size.stock}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {sizes.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No sizes added yet. Add sizes if this product has size variations.
                  </p>
                )}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Colors</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={currentColor.name}
                  onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                  placeholder="Color name (e.g., Navy Blue)"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                />
                <input
                  type="text"
                  value={currentColor.hexCode}
                  onChange={(e) => setCurrentColor({ ...currentColor, hexCode: e.target.value })}
                  placeholder="Hex code (e.g., #000080)"
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-gray-400 outline-none transition"
                />
                <button
                  type="button"
                  onClick={addColor}
                  disabled={!currentColor.name}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Color
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {color.hexCode && (
                      <span 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.hexCode }}
                      ></span>
                    )}
                    {color.name}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {colors.length === 0 && (
                  <p className="text-sm text-gray-400">No colors added yet.</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Product Images <span className="text-amber-600">*</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill('').map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="relative aspect-square border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-400 transition cursor-pointer overflow-hidden group"
                  >
                    <input
                      onChange={(e) => {
                        const newFiles = [...files];
                        newFiles[index] = e.target.files[0];
                        setFiles(newFiles);
                      }}
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    {files[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(files[index])}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const newFiles = [...files];
                            newFiles[index] = null;
                            setFiles(newFiles);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <UploadIcon />
                        <span className="text-xs text-gray-400 mt-2">Upload</span>
                      </div>
                    )}
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-amber-600 text-white px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Upload up to 4 images. First image will be the main product image.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              
              {/* Featured Toggle */}
              <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-10 h-6 rounded-full transition ${featured ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${featured ? 'translate-x-4' : ''}`}></div>
                  </div>
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  Featured products appear on the homepage
                </p>
              </div>

              {/* Product Tips */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <InfoIcon />
                  Product Tips
                </h3>
                <ul className="space-y-2 text-xs text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Use high-quality images (1000x1000px recommended)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Write detailed product descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Add all available sizes with correct stock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>Set competitive discount prices</span>
                  </li>
                </ul>
              </div>

              {/* Quick Preview */}
              {name && (
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                        {files[0] ? (
                          <img src={URL.createObjectURL(files[0])} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{name}</p>
                        <p className="text-sm text-amber-600">
                          ₹{discountPrice || price || '0'}
                          {discountPrice && <span className="text-xs text-gray-400 line-through ml-2">₹{price}</span>}
                        </p>
                      </div>
                    </div>
                    {sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sizes.map((s, i) => (
                          <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                            {s.size}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Addproduct;