import express from "express";
import { addAddress, getAddress } from "../controllers/AddressController.js";
import authUser from "../middlewares/authUser.js";

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/', authUser, getAddress); // RESTful style
addressRouter.get('/get', authUser, getAddress); // Backward compatibility

export default addressRouter;