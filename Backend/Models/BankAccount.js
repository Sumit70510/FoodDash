import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ["User", "Restaurant", "DeliveryPartner"],
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel"
    },

    ownerModel: {
      type: String,
      enum: ["User", "Restaurant", "DeliveryPartner"],
      required: true
    },

    purpose: {
      type: String,
      enum: ["Payout", "Payment", "Refund"],
      default: "payment"
    },

    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },

    bankName: {
      type: String,
      required: true,
      trim: true
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true
    },

    accountNumberLast4: {
      type: String,
      required: true
    },

    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    upiId: {
      type: String,
      trim: true,
      lowercase: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending"
    },

    isPrimary: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default BankAccount= mongoose.model("BankAccount", bankAccountSchema);