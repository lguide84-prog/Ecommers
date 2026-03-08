import express from "express";
import authUser from '../middlewares/authUser.js';
import { updateCart } from "../controllers/UserController.js";

const cartRouter = express.Router();

// Update cart - protected route
cartRouter.post('/update', authUser, updateCart);

export default cartRouter;