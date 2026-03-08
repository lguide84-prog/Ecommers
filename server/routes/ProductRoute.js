import express from "express";
import { upload } from "../config/multer.js";
import authSeller from "../middlewares/authSeller.js";
import { 
  AddProduct, 
  changeStock, 
  deleteProduct, 
  productById, 
  productList, 
  updateProduct 
} from "../controllers/ProductController.js";

const productRouter = express.Router();

// Public routes
productRouter.get('/list', productList);
productRouter.get('/:id', productById); // Changed from '/id' to '/:id' (RESTful)

// Seller/Admin routes
productRouter.post('/add', authSeller, upload.array("images", 5), AddProduct); // Changed 'image' to 'images'
productRouter.put('/:id', authSeller, upload.array("images", 5), updateProduct); // Changed from '/update' to '/:id'
productRouter.delete('/:id', authSeller, deleteProduct); // Changed from '/delete' to '/:id'
productRouter.patch('/stock', authSeller, changeStock); // Changed from '/stock' to PATCH

export default productRouter;