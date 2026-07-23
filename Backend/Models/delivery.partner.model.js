import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    permanentAddress: {
      type: String,
      required: false,
      trim: true,
      maxlength: 300,
    },

    username: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
      index: true,
    },

    profilePicture: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer Not To Say"],
      required: false,
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
      required: false,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    licenseNo: {
      type: String,
      unique: true,
      required: [true, "License number is required"],
      trim: true,
      uppercase: true,
      index: true,
    },

    PAN: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
      trim: true,
      uppercase: true,
    },

    AADHAR: {
      type: String,
      unique: true,
      required: [true, "Aadhaar number is required"],
      trim: true,
      match: [/^\d{12}$/, "Aadhaar number must contain 12 digits"],
      index: true,
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Scooter", "Cycle", "Car"],
      required: [true, "Vehicle type is required"],
    },

    vehicleNo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
      required: [true, "Vehicle number is required"],
      index: true,
    },

    availabilityStatus: {
      type: String,
      enum: ["Offline", "Online", "Busy"],
      default: "Offline",
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    currentLocation: {
      address: {
        type: String,
        trim: true,
        default: "",
      },
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },

    totalDeliveriesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalLifetimeEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentUnsettledEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalIncentives: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDeductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryPartner =
  mongoose.models.DeliveryPartner ||
  mongoose.model("DeliveryPartner", deliveryPartnerSchema);

export default DeliveryPartner;