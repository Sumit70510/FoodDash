import express from "express";
import { login, logout, logoutFromAll, register } from "../Controllers/user.controller.js";
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/logoutAll').get(logoutFromAll);
// router.route('/editUserDetails/:id');
// router.route();
export default router;