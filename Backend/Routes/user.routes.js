import express from "express";
import { login, logout, logoutFromAll, register } from "../Controllers/user.controller.js";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(isAuthenticated,logout);
router.route('/logoutAll').post(isAuthenticated,logoutFromAll);

export default router;