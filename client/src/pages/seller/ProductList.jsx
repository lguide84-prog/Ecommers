import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { Edit, Trash2, Package, DollarSign, Percent, Layers, Truck } from 'lucide-react';

function ProductList() {
  const { products, axios, fetchProducts } = useAppContext();
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    featured: false,
    sizes: [],
    colors: []
  });
  const [editFiles, setEditFiles] = useState([]);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  
  // Size management
  const [currentSize, setCurrentSize] = useState({ size: "", stock: "" });
  const sizeEnum = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE SIZE'];
  
  // Color management
  const [currentColor, setCurrentColor] = useState({ name: "", hexCode: "" });

  const toggleStock = async (id, inStock) => {
    try {
      // For new schema, we need to update the first size's stock or handle differently
      const product = products.find(p => p._id === id);
      if (product?.sizes && product.sizes.length > 0) {
        // Update first size stock
        const { data } = await axios.patch("/api/product/stock", { 
          id, 
          stock: inStock ? 1 : 0 
        });
        if (data.success) {
          fetchProducts();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await axios.delete(`/api/product/${id}`);
        if (data.success) {
          fetchProducts();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Add size
  const addSize = () => {
    if (currentSize.size && currentSize.stock) {
      setEditData({
        ...editData,
        sizes: [...editData.sizes, { 
          size: currentSize.size, 
          stock: Number(currentSize.stock) 
        }]
      });
      setCurrentSize({ size: "", stock: "" });
    }
  };

  const removeSize = (index) => {
    const newSizes = editData.sizes.filter((_, i) => i !== index);
    setEditData({ ...editData, sizes: newSizes });
  };

  // Add color
  const addColor = () => {
    if (currentColor.name) {
      setEditData({
        ...editData,
        colors: [...editData.colors, { 
          name: currentColor.name,
          hexCode: currentColor.hexCode || undefined
        }]
      });
      setCurrentColor({ name: "", hexCode: "" });
    }
  };

  const removeColor = (index) => {
    const newColors = editData.colors.filter((_, i) => i !== index);
    setEditData({ ...editData, colors: newColors });
  };

  const openEditModal = (product) => {
    setEditingProduct(product._id);
    setCurrentProductImages(product.images || product.image || []);
    setEditData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || product.offerPrice || '',
      featured: product.featured || false,
      sizes: product.sizes || [],
      colors: product.colors || []
    });
    setEditFiles([]);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      featured: false,
      sizes: [],
      colors: []
    });
    setEditFiles([]);
    setCurrentProductImages([]);
    setCurrentSize({ size: "", stock: "" });
    setCurrentColor({ name: "", hexCode: "" });
  };

  const handleEditFileChange = (index, file) => {
    const newFiles = [...editFiles];
    newFiles[index] = file;
    setEditFiles(newFiles);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const productData = {
        name: editData.name,
        description: editData.description,
        price: Number(editData.price),
        discountPrice: editData.discountPrice ? Number(editData.discountPrice) : 0,
        featured: editData.featured,
        sizes: editData.sizes.length > 0 ? editData.sizes : undefined,
        colors: editData.colors.length > 0 ? editData.colors : undefined
      };
      
      formData.append("productData", JSON.stringify(productData));

      editFiles.forEach((file, index) => {
        if (file) {
          formData.append("images", file);
        }
      });

      const { data } = await axios.put(`/api/product/${editingProduct}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        }
      });

      if (data.success) {
        await fetchProducts();
        closeEditModal();
        toast.success("Product updated successfully!");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image && product.image.length > 0) {
      return product.image[0];
    }
    return assets.upload_area;
  };

  // Get display price
  const getDisplayPrice = (product) => {
    return product.discountPrice || product.offerPrice || product.price;
  };

  // Get original price
  const getOriginalPrice = (product) => {
    if (product.discountPrice || product.offerPrice) {
      return product.price;
    }
    return null;
  };

  return (
    <>
      <div className="no-scrollbar flex-1 min-h-[95vh] overflow-y-scroll flex flex-col">
        <div className="w-full md:p-8 p-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
            <p className="text-gray-600 text-sm mt-1">
              {products?.length || 0} products found
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sizes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colors
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products && products.length > 0 ? (
                  products.map((product) => {
                    const displayPrice = getDisplayPrice(product);
                    const originalPrice = getOriginalPrice(product);
                    
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img 
                                src={getProductImage(product)} 
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.src = assets.upload_area;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {product.description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {product.sizes && product.sizes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((size, idx) => (
                                <span 
                                  key={idx}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    size.stock > 0 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {size.size}: {size.stock}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No sizes</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {product.colors && product.colors.length > 0 ? (
                            <div className="flex gap-1">
                              {product.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full border border-gray-200"
                                  style={{ backgroundColor: color.hexCode || '#ccc' }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No colors</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-green-700">
                              ₹{displayPrice}
                            </span>
                            {originalPrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹{originalPrice}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.featured 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.featured ? 'Featured' : 'Regular'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <Edit className="w-4 h-4 mr-1.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-1.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {products && products.length > 0 ? (
              products.map((product) => {
                const displayPrice = getDisplayPrice(product);
                const originalPrice = getOriginalPrice(product);
                
                return (
                  <div key={product._id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    {/* Product Header */}
                    <div className="flex items-start space-x-3">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = assets.upload_area;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {product.featured && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {product.sizes?.length || 0} sizes
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, idx) => (
                            <span 
                              key={idx}
                              className={`text-xs px-2 py-1 rounded border ${
                                size.stock > 0 
                                  ? 'border-green-200 bg-green-50 text-green-700' 
                                  : 'border-gray-200 bg-gray-50 text-gray-400'
                              }`}
                            >
                              {size.size}: {size.stock}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mt-3 flex gap-1">
                        {product.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.hexCode || '#ccc' }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-primary">
                          ₹{displayPrice}
                        </p>
                        {originalPrice && (
                          <span className="text-xs text-gray-400 line-through block">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4 mr-1.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Add your first product to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
                  <p className="text-sm text-gray-500 mt-1">Update product details</p>
                </div>
                <button 
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={updateProduct} className="space-y-6">
                {/* Product Images */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-semibold text-gray-900">Product Images</p>
                    <p className="text-sm text-gray-500">Max 4 images</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array(4).fill('').map((_, index) => {
                      const currentImage = currentProductImages[index];
                      const hasNewImage = editFiles[index];
                      
                      return (
                        <label 
                          key={index} 
                          htmlFor={`edit-image-${index}`} 
                          className="cursor-pointer group"
                        >
                          <input 
                            onChange={(e) => handleEditFileChange(index, e.target.files[0])}
                            accept="image/*" 
                            type="file" 
                            id={`edit-image-${index}`} 
                            hidden 
                          />
                          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl p-2 flex items-center justify-center hover:border-primary transition-all group-hover:shadow-md">
                            <div className="relative w-full h-full">
                              <img 
                                src={hasNewImage ? 
                                  URL.createObjectURL(editFiles[index]) : 
                                  (currentImage || assets.upload_area)
                                }
                                alt="upload"
                                className="w-full h-full object-contain rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  {currentImage ? 'Change' : 'Upload'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                      placeholder="Enter product description"
                      required
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price (₹) *</label>
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) => setEditData({...editData, price: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                        required
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (₹)</label>
                      <input
                        type="number"
                        value={editData.discountPrice}
                        onChange={(e) => setEditData({...editData, discountPrice: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Sizes Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Sizes & Stock</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <select
                        value={currentSize.size}
                        onChange={(e) => setCurrentSize({ ...currentSize, size: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                        placeholder="Stock"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                      {editData.sizes.map((size, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">Size: {size.size}</span>
                            <span className="text-sm text-gray-600">Stock: {size.stock}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <input
                        type="text"
                        value={currentColor.name}
                        onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                        placeholder="Color name"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                      />
                      <input
                        type="text"
                        value={currentColor.hexCode}
                        onChange={(e) => setCurrentColor({ ...currentColor, hexCode: e.target.value })}
                        placeholder="Hex code (optional)"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
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
                      {editData.colors.map((color, index) => (
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
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Featured Product</p>
                      <p className="text-sm text-gray-500">Show this product on homepage</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {editData.featured ? 'Yes' : 'No'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditData({...editData, featured: !editData.featured})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          editData.featured ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          editData.featured ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                    >
                      Update Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductList;