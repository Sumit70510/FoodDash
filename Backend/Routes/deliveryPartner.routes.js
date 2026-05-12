import express from "express";
import { login, logout, logoutFromAll, register } from "../Controllers/deliveryPartner.controller.js";
import isDelParAuthenticated from "../Middlewares/isDelParAuthenticated.js";
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(isDelParAuthenticated,logout);
router.route('/logoutAll').post(isDelParAuthenticated,logoutFromAll);

export default router;