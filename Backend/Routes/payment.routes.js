import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import { protectRoute } from "../Middlewares/protectRoute.js";

import {
  createRazorpayOrder,
  verifyPayment,
  paymentHistory,
  getPayment,
  refundPayment,
} from "../Controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createRazorpayOrder);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/history", isAuthenticated, paymentHistory);
router.get("/:paymentId", isAuthenticated, getPayment);
router.post("/refund/:paymentId", protectRoute, refundPayment);

export default router;