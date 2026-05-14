import express from "express";

import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemsByRestraunt,
  getSingleMenuItem,
  updateMenuItem,
} from "../controllers/menu.item.controller.js";

import { protectRoute } from "../middlewares/protectRoute.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
  "/create",
  protectRoute,
  upload.array("image", 5),
  createMenuItem
);

router.get(
  "/restraunt/:restrauntId",
  getMenuItemsByRestraunt
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