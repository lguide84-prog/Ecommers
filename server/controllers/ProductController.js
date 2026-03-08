import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product
export const AddProduct = async (req, res) => {
  try {
    console.log("=== Add Product Request ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);
    console.log("Files length:", req.files?.length);

    // Check if user is authenticated
    if (!req.user && !req.seller) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Parse product data
    if (!req.body.productData) {
      return res.status(400).json({ 
        success: false, 
        message: "Product data is required" 
      });
    }

    let productData;
    try {
      productData = JSON.parse(req.body.productData);
      console.log("Parsed product data:", productData);
    } catch (parseError) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product data format" 
      });
    }

    // Handle images
    let imgUrls = [];
    if (req.files && req.files.length > 0) {
      console.log("Processing files...");
      imgUrls = req.files.map(file => {
        console.log("File path:", file.path);
        console.log("File filename:", file.filename);
        return file.path || file.filename;
      });
      console.log("Image URLs to save:", imgUrls);
    } else {
      console.log("No files received!");
      return res.status(400).json({ 
        success: false, 
        message: "At least one image is required" 
      });
    }

    // Add createdBy if user is available
    if (req.user) {
      productData.createdBy = req.user._id;
    }

    // Create product with new schema structure
    const product = await Product.create({ 
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : 0,
      images: imgUrls,  // Make sure this is being set
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      featured: productData.featured || false,
      createdBy: productData.createdBy,
      isActive: true
    });
    
    console.log("Product created with images:", product.images);
    
    res.json({ 
      success: true, 
      message: "Product added successfully",
      product 
    });
    
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to add product" 
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (parseError) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product data format" 
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path || file.filename);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        discountPrice: productData.discountPrice ? Number(productData.discountPrice) : 0,
        ...(productData.images && { images: productData.images }),
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        featured: productData.featured
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Product updated successfully",
      product: updatedProduct 
    });
    
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all products
export const productList = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 }); // Newest first
    
    console.log(`Found ${products.length} products`);
    
    res.json({ 
      success: true, 
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Product list error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single product
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Product by ID error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id, 
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Change stock (for simple products without sizes)
export const changeStock = async (req, res) => {
  try {
    const { id, stock } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // If product has sizes, update the first size's stock (or implement your logic)
    if (product.sizes && product.sizes.length > 0) {
      product.sizes[0].stock = stock;
    }
    
    await product.save();

    res.json({ 
      success: true, 
      message: "Stock updated successfully",
      product 
    });
  } catch (error) {
    console.error("Change stock error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};