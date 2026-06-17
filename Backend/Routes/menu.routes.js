import express from "express";
import { createMenu, deleteMenu, getMenusByRestaurant, getTargatedMenuByRestaurant, updateMenu } from "../Controllers/menu.controller.js";
const router = express.Router();

router.post("/create", createMenu);
router.get("/:restaurantId/menu", getMenusByRestaurant);
router.get("/:id", getTargatedMenuByRestaurant);
router.put("/edit/:id", updateMenu);
router.delete("/deleteMenu/:id", deleteMenu);

export default router; 