import express from "express";
import { createMenuItem } from "../Controllers/menu.controller.js";
const router = express.Router();

router.post("/create", createMenuItem);

export default router;