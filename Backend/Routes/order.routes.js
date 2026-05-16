import express from "express";

import {
  placeOrder,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
  getRestaurantOrders,
} from "../controllers/order.controller.js";

import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/place",
  protectRoute,
  placeOrder
);

router.get(
  "/user",
  protectRoute,
  getUserOrders
);

router.get(
  "/restaurant/:restaurantId",
  protectRoute,
  getRestaurantOrders
);

router.get(
  "/:orderId",
  protectRoute,
  getSingleOrder
);

router.put(
  "/status/:orderId",
  protectRoute,
  updateOrderStatus
);

router.put(
  "/cancel/:orderId",
  protectRoute,
  cancelOrder
);

export default router;