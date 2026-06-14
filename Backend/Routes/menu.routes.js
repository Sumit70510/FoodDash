import express from "express";
import { createMenu, deleteMenu, getMenusByRestaurant, getTargatedMenuByRestaurant, updateMenu } from "../Controllers/menu.controller.js";
const router = express.Router();

router.post("/createMenu", createMenu);
router.get("/:restaurantId/allMenus", getMenusByRestaurant);
router.get("/menu/:id", getTargatedMenuByRestaurant);
router.put("/updateMenu/:id", updateMenu);
router.delete("/deleteMenu/:id", deleteMenu);

export default router;