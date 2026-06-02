import express from "express";

import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../Controllers/cart.controller.js";

import { protectRoute } from "../Middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/add",
  protectRoute,
  addToCart
);

router.get(
  "/",
  protectRoute,
  getCart
);

router.put(
  "/update/:cartItemId",
  protectRoute,
  updateCartItemQuantity
);

router.delete(
  "/remove/:cartItemId",
  protectRoute,
  removeCartItem
);

router.delete(
  "/clear",
  protectRoute,
  clearCart
);

export default router;