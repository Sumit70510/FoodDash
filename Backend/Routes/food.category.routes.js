import express from "express";

import {
  createCategory,
  getCategoriesByRestaurant,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByMenuId,
} from "../Controllers/food.category.controller.js";

import { protectRoute } from "../Middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/create",
  protectRoute,
  createCategory
);

router.get(
  "/restaurant/:restaurantId", 
  getCategoriesByRestaurant);
  
  router.get(
    "/menu/:menuId", 
    getCategoriesByMenuId);

    router.get(
    "/:categoryId",
    getSingleCategory
    );

router.put(
  "/edit/:categoryId",
  protectRoute,
  updateCategory
);

router.delete(
  "/:categoryId",
  protectRoute,
  deleteCategory
);

export default router;