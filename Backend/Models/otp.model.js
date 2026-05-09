const otpSchema = new mongoose.Schema({
  contact: String, 

  otp: String, 

  expiresAt: Date,

  attempts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });