import express from "express";

import { protectRoute } from "../Middlewares/protectRoute.js";

import {
createRazorpayOrder,
verifyPayment,
paymentHistory,
getPayment,
refundPayment
} from "../Controllers/payment.controller.js";

const router=express.Router();

router.post(
"/create-order",
protectRoute,
createRazorpayOrder
);

router.post(
"/verify",
protectRoute,
verifyPayment
);

router.get(
"/history",
protectRoute,
paymentHistory
);

router.get(
"/:paymentId",
protectRoute,
getPayment
);

router.post(
"/refund/:paymentId",
protectRoute,
refundPayment
);

export default router;