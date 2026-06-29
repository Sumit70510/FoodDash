import express from "express";
import { login, logout, logoutFromAll, register } from "../Controllers/restaurant.controller.js";
import isResAuthenticated from "../Middlewares/isResAuthenticated.js";
import {  getRestaurantProfile, updateRestaurantProfile, } from "../Controllers/restaurant.controller.js";
import upload from "../Middlewares/multer.js";

const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(isResAuthenticated,logout);
router.route('/logoutAll').post(isResAuthenticated,logoutFromAll);
router.get("/profile/view",isResAuthenticated,getRestaurantProfile);
router.put("/profile",isResAuthenticated,upload.single("image"),updateRestaurantProfile);

export default router;