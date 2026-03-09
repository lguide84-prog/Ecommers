import express from "express";
import authSeller from "../middlewares/authSeller.js";
import { isSellerAuth, sellerLogin, sellerLogout } from "../controllers/SellerController.js";

const sellerRouter = express.Router();

// Public routes
sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/isauth", authSeller, isSellerAuth);

// Logout route
sellerRouter.post("/logout", sellerLogout);

export default sellerRouter;