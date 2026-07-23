import express from "express";

import {
  login,
  logout,
  logoutFromAll,
  register,
} from "../Controllers/deliveryPartner.controller.js";

import isDelParAuthenticated from "../Middlewares/isDelParAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post(
  "/logout",
  isDelParAuthenticated,
  logout
);

router.post(
  "/logoutAll",
  isDelParAuthenticated,
  logoutFromAll
);

export default router;