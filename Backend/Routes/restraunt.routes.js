import express from "express";
import { register } from "../Controllers/restraunt.controller";
const router=express.Router();

router.route('/register').post(register);
// router.route('/login');
// router.route('/logout');
// router.route('/editUserDetails/:id');
// router.route();
export default router;