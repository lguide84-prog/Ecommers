import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product: /api/product/add
export const AddProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);

    // ✅ Ensure subCategory is included
    if (!productData.subCategory) {
      productData.subCategory = "";
    }

    // ✅ Ensure weightUnit is included
    if (!productData.weightUnit) {
      productData.weightUnit = "kg";
    }

    // ✅ Ensure weightValue is converted to number
    if (productData.weightValue) {
      productData.weightValue = Number(productData.weightValue);
    }

    // ✅ Ensure GST percentage is included
    if (!productData.gstPercentage) {
      productData.gstPercentage = 5; // Default 5%
    }

    const images = req.files;
    let imgUrl = await Promise.all(
      images.map(async (file) => {
        let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imgUrl });
    res.json({
      success: true,
      message: "Product added"
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Get all products: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Get single product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Change stock status: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock updated" });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Delete product: /api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Update product: /api/product/update
