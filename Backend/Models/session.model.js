import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

  ownerType: {
    type: String,
    enum: ["User", "Restaurant", "DeliveryPartner"],
    required: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "ownerType"
  },

  token: {
    type: String,
    required: true
  },

  deviceInfo: {
    userAgent: String,
    deviceName: String
  },

  ip: String,

  isActive: {
    type: Boolean,
    default: true
  },

  lastUsedAt: Date,

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

sessionSchema.index({ ownerId: 1, isActive: 1 });
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session =
  mongoose.models.Session ||
  mongoose.model("Session", sessionSchema);

export default Session;