import DeliveryPartner from "../Models/delivery.partner.model.js";
import Session from "../Models/session.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const tokenName = process.env.TOKEN || "jwt";

const validTillDays = Number.parseInt(
  process.env.VALID_TILL || "2",
  10
);

const tokenAge =
  validTillDays * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "PRODUCTION",
};

const normalizeVehicleType = (vehicleType) => {
  if (!vehicleType || typeof vehicleType !== "string") {
    return "";
  }

  const normalizedValue = vehicleType.trim().toLowerCase();

  const vehicleTypeMap = {
    bike: "Bike",
    scooter: "Scooter",
    cycle: "Cycle",
    car: "Car",
  };

  return vehicleTypeMap[normalizedValue] || "";
};

const normalizeRegistrationData = (body = {}) => {
  return {
    name:
      typeof body.name === "string"
        ? body.name.trim()
        : "",

    email:
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "",

    password:
      typeof body.password === "string"
        ? body.password
        : "",

    contactNo:
      typeof body.contactNo === "string"
        ? body.contactNo.replace(/\D/g, "")
        : "",

    licenseNo:
      typeof body.licenseNo === "string"
        ? body.licenseNo.trim().toUpperCase().replace(/\s+/g, "")
        : "",

    vehicleType: normalizeVehicleType(body.vehicleType),

    vehicleNo:
      typeof body.vehicleNo === "string"
        ? body.vehicleNo.trim().toUpperCase().replace(/\s+/g, "")
        : "",

    AADHAR:
      typeof body.AADHAR === "string"
        ? body.AADHAR.replace(/\D/g, "")
        : "",
  };
};

export const register = async (req, res) => {
  try {
    const data = normalizeRegistrationData(req.body);

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.contactNo ||
      !data.licenseNo ||
      !data.vehicleType ||
      !data.vehicleNo ||
      !data.AADHAR
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        success: false,
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(data.email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
        success: false,
      });
    }

    if (!/^[6-9]\d{9}$/.test(data.contactNo)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number.",
        success: false,
      });
    }

    if (!/^\d{12}$/.test(data.AADHAR)) {
      return res.status(400).json({
        message: "Aadhaar number must contain exactly 12 digits.",
        success: false,
      });
    }

    if (data.password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
        success: false,
      });
    }

    if (!["Bike", "Scooter", "Cycle", "Car"].includes(data.vehicleType)) {
      return res.status(400).json({
        message: "Please select a valid vehicle type.",
        success: false,
      });
    }

    const existingPartner = await DeliveryPartner.findOne({
      $or: [
        { email: data.email },
        { contactNo: data.contactNo },
        { AADHAR: data.AADHAR },
        { licenseNo: data.licenseNo },
        { vehicleNo: data.vehicleNo },
      ],
    }).select(
      "email contactNo AADHAR licenseNo vehicleNo"
    );

    if (existingPartner) {
      let duplicateMessage =
        "A delivery partner with these details already exists.";

      if (existingPartner.email === data.email) {
        duplicateMessage =
          "An account already exists with this email address.";
      } else if (
        existingPartner.contactNo === data.contactNo
      ) {
        duplicateMessage =
          "An account already exists with this mobile number.";
      } else if (
        existingPartner.AADHAR === data.AADHAR
      ) {
        duplicateMessage =
          "An account already exists with this Aadhaar number.";
      } else if (
        existingPartner.licenseNo === data.licenseNo
      ) {
        duplicateMessage =
          "An account already exists with this license number.";
      } else if (
        existingPartner.vehicleNo === data.vehicleNo
      ) {
        duplicateMessage =
          "This vehicle is already registered.";
      }

      return res.status(409).json({
        message: duplicateMessage,
        success: false,
      });
    }

    const saltRounds = Number.parseInt(
      process.env.SALT_ROUND || "10",
      10
    );

    const hashedPassword = await bcrypt.hash(
      data.password,
      saltRounds
    );

    const deliveryPartner =
      await DeliveryPartner.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,

        // This was incorrectly set to data.email before.
        contactNo: data.contactNo,

        licenseNo: data.licenseNo,
        vehicleType: data.vehicleType,
        vehicleNo: data.vehicleNo,
        AADHAR: data.AADHAR,

        availabilityStatus: "Offline",
        verificationStatus: "Pending",
        isActive: true,
      });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      deliveryPartner: {
        _id: deliveryPartner._id,
        name: deliveryPartner.name,
        email: deliveryPartner.email,
        contactNo: deliveryPartner.contactNo,
        licenseNo: deliveryPartner.licenseNo,
        vehicleType: deliveryPartner.vehicleType,
        vehicleNo: deliveryPartner.vehicleNo,
        verificationStatus:
          deliveryPartner.verificationStatus,
      },
    });
  } catch (error) {
    console.error(
      "Delivery partner registration error:",
      error
    );

    if (error?.code === 11000) {
      const duplicateField = Object.keys(
        error.keyPattern || error.keyValue || {}
      )[0];

      const duplicateMessages = {
        email:
          "An account already exists with this email address.",
        contactNo:
          "An account already exists with this mobile number.",
        AADHAR:
          "An account already exists with this Aadhaar number.",
        licenseNo:
          "An account already exists with this license number.",
        vehicleNo:
          "This vehicle is already registered.",
        username:
          "This username is already registered.",
      };

      return res.status(409).json({
        message:
          duplicateMessages[duplicateField] ||
          "An account with these details already exists.",
        success: false,
      });
    }

    if (error?.name === "ValidationError") {
      const firstValidationError = Object.values(
        error.errors || {}
      )[0];

      return res.status(400).json({
        message:
          firstValidationError?.message ||
          "Invalid registration information.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const {
      email,
      contactNo,
      password,
      force = false,
    } = req.body;

    const sessionLimit = Number.parseInt(
      process.env.SESSION_LIMIT || "2",
      10
    );

    if ((!email && !contactNo) || !password) {
      return res.status(400).json({
        message: "Email/mobile number and password are required.",
        success: false,
      });
    }

    const query = email
      ? {
          email: email.trim().toLowerCase(),
        }
      : {
          contactNo: String(contactNo).replace(/\D/g, ""),
        };

    const deliveryPartner =
      await DeliveryPartner.findOne(query).select("+password");

    if (!deliveryPartner) {
      return res.status(400).json({
        message: "Incorrect credentials.",
        success: false,
      });
    }

    if (!deliveryPartner.isActive) {
      return res.status(403).json({
        message:
          "Your account has been disabled. Please contact support.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      deliveryPartner.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect credentials.",
        success: false,
      });
    }

    const currentDeviceUserAgent =
      req.headers["user-agent"] || "Unknown";

    await Session.findOneAndUpdate(
      {
        ownerId: deliveryPartner._id,
        ownerType: "DeliveryPartner",
        "deviceInfo.userAgent":
          currentDeviceUserAgent,
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    let activeSessions = await Session.find({
      ownerId: deliveryPartner._id,
      ownerType: "DeliveryPartner",
      isActive: true,
    }).sort({
      createdAt: 1,
    });

    if (
      activeSessions.length + 1 > sessionLimit &&
      !force
    ) {
      return res.status(409).json({
        message:
          "You are logged in on other devices. Log out from an older device to continue?",
        success: false,
        requireConfirmation: true,
      });
    }

    let loginMessage = "Logged in successfully.";

    if (
      activeSessions.length + 1 > sessionLimit &&
      force
    ) {
      const sessionsToDeactivate =
        activeSessions.slice(
          0,
          activeSessions.length - sessionLimit + 1
        );

      const sessionIds = sessionsToDeactivate.map(
        (session) => session._id
      );

      if (sessionIds.length > 0) {
        await Session.updateMany(
          {
            _id: {
              $in: sessionIds,
            },
          },
          {
            isActive: false,
          }
        );
      }

      loginMessage =
        "Older session logged out. Login successful.";

      activeSessions = activeSessions.filter(
        (session) =>
          !sessionIds.some(
            (id) =>
              id.toString() === session._id.toString()
          )
      );
    }

    const token = jwt.sign(
      {
        _id: deliveryPartner._id,
        role: "DeliveryPartner",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: `${validTillDays}d`,
      }
    );

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await Session.create({
      ownerType: "DeliveryPartner",
      ownerId: deliveryPartner._id,
      token: hashedToken,
      deviceInfo: {
        userAgent: currentDeviceUserAgent,
      },
      ip:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip,
      expiresAt: new Date(Date.now() + tokenAge),
      isActive: true,
    });

    res.cookie(tokenName, token, {
      ...cookieOptions,
      maxAge: tokenAge,
    });

    const userResponse = deliveryPartner.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: loginMessage,
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Delivery partner login error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.[tokenName];

    res.clearCookie(tokenName, cookieOptions);

    if (!token) {
      return res.status(200).json({
        message: "You are already logged out.",
        success: true,
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await Session.findOneAndUpdate(
      {
        token: hashedToken,
        ownerType: "DeliveryPartner",
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Delivery partner logout error:", error);

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const logoutFromAll = async (req, res) => {
  try {
    res.clearCookie(tokenName, cookieOptions);

    /*
     * Make sure your isDelParAuthenticated middleware
     * stores the authenticated partner ID in req._id.
     */
    const deliveryPartnerId = req._id;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Authentication required.",
        success: false,
      });
    }

    await Session.updateMany(
      {
        ownerId: deliveryPartnerId,
        ownerType: "DeliveryPartner",
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    return res.status(200).json({
      message: "Logged out from all devices successfully.",
      success: true,
    });
  } catch (error) {
    console.error(
      "Delivery partner logout-all error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};