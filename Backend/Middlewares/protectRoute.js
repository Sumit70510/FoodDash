import jwt from "jsonwebtoken";
import crypto from "crypto";

import Session from "../Models/session.model.js";
import Restaurant from "../Models/restaurant.model.js";


const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== 'DEVELOPMENT'
    };

export const protectRoute = async (req, res, next) => {
  try {
   const tokenName = process.env.TOKEN||"jwt";
       const token = req.cookies[tokenName];
       
    if (!token) {
       console.log(401);
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Access Denied",
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
       console.log(402)
      return res.status(401).json({
        success: false,
        message: "Session Expired",
      });
    }

    const restaurant = await Restaurant.findById(
      decoded._id
    );

    if (!restaurant) {
      console.log(404)
      return res.status(404).json({
        success: false,
        message: "Restaurant Not Found",
      });
    }

    req.restaurant = restaurant;
    console.log(200);
    next();
  } catch (error) {
    console.log("Protect Route Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};