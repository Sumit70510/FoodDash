import jwt from "jsonwebtoken";
import crypto from "crypto";

import Session from "../models/session.model.js";
import Restaurant from "../models/restaurant.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const session = await Session.findOne({
      ownerId: decoded._id,
      token: hashedToken,
      isActive: true,
    });

    if (!session) { 
      return res.status(401).json({
        success: false,
        message: "Session Expired",
      });
    }

    const restaurant = await Restaurant.findById(
      decoded._id
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    req.restaurant = restaurant;

    next();
  } catch (error) {
    console.log("Protect Route Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};