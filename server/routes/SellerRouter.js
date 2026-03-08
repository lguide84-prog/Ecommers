import express from "express";
import authSeller from "../middlewares/authSeller.js";
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/SellerController.js";

const sellerRouter = express.Router();

// Public routes
sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/isauth", isSellerAuth);

// Logout should be POST (you're using POST, which is correct)
sellerRouter.post("/logout", sellerLogout);  // Make sure this line exists!

// Protected routes (if any)
// sellerRouter.get("/dashboard", authSeller, someController);

export default sellerRouter;