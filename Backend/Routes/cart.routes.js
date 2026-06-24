import express from "express";

import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../Controllers/cart.controller.js";

import isAuthenticated from "../Middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/add", isAuthenticated, addToCart );

router.get("/items",isAuthenticated, getCart );

router.put("/update/:cartItemId",isAuthenticated,updateCartItemQuantity);

router.delete("/remove/:cartItemId",isAuthenticated,removeCartItem);

router.delete("/clear",isAuthenticated,clearCart);

export default router;