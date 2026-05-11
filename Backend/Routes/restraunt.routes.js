import express from "express";
import { login, logout, logoutFromAll, register } from "../Controllers/restraunt.controller.js";
import isResAuthenticated from "../Middlewares/isResAuthenticated.js";
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(isResAuthenticated,logout);
router.route('/logoutAll').post(isResAuthenticated,logoutFromAll);

export default router;