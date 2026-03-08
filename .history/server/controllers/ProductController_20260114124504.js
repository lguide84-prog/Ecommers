import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";



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
