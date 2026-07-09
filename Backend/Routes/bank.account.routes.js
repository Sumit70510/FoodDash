import express from "express";
import isAuthenticated from "../Middlewares/isAuthenticated.js";
import {
  getMyBankAccounts,
  deleteBankAccount,
} from "../Controllers/bank.account.controller.js";

const router = express.Router();

router.get("/my", isAuthenticated, getMyBankAccounts);
router.delete("/:accountId", isAuthenticated, deleteBankAccount);

export default router;
