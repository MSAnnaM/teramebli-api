import express from "express";
import { createOrder } from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/order", createOrder);

export default orderRouter;
