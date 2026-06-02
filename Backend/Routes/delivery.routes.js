import express from "express";

import {
  createDelivery,
  assignDeliveryPartner,
  getPartnerDeliveries,
  getSingleDelivery,
  updateDeliveryStatus,
  updatePayoutStatus,
  deleteDelivery,
} from "../Controllers/delivery.controller.js";

import { protectRoute } from "../Middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/create",
  protectRoute,
  createDelivery
);

router.put(
  "/assign/:deliveryId",
  protectRoute,
  assignDeliveryPartner
);

router.get(
  "/partner/:partnerId",
  protectRoute,
  getPartnerDeliveries
);

router.get(
  "/:deliveryId",
  protectRoute,
  getSingleDelivery
);

router.put(
  "/status/:deliveryId",
  protectRoute,
  updateDeliveryStatus
);

router.put(
  "/payout/:deliveryId",
  protectRoute,
  updatePayoutStatus
);

router.delete(
  "/:deliveryId",
  protectRoute,
  deleteDelivery
);

export default router;