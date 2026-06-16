import express from "express";

import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemsByRestaurant,
  getSingleMenuItem,
  updateMenuItem,
} from "../Controllers/menu.item.controller.js";

import { protectRoute } from "../Middlewares/protectRoute.js";

import upload from "../Middlewares/multer.js";

const router = express.Router();

router.post(
  "/create",
  protectRoute,
  upload.array("image", 5),
  createMenuItem
);

router.get(
  "/restaurant/:restaurantId",
  getMenuItemsByRestaurant
);

router.get(
  "/restaurants",
  getAllMenuItems
);

router.get(
  "/:menuItemId",
  getSingleMenuItem
);

router.put(
  "/:menuItemId",
  protectRoute,
  upload.array("image", 5),
  updateMenuItem
);

router.delete(
  "/:menuItemId",
  protectRoute,
  deleteMenuItem
);

export default router;