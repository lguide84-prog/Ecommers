import express from "express";
import { 
  isAuth, 
  loginUser, 
  logout, 
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateCart 
} from "../controllers/UserController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes (require authentication)
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);
userRouter.get("/isauth", authUser, isAuth);
userRouter.post("/logout", authUser, logout);
userRouter.post("/cart", authUser, updateCart);

export default userRouter;