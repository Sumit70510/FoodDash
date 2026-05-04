// import mongoose from "mongoose";

// const partnerEarningSchema = new mongoose.Schema(
//   {
//     deliveryPartnerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "DeliveryPartner",
//       required: true
//     },

//     deliveryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Delivery"
//     },

//     type: {
//       type: String,
//       enum: ["Delivery Fee", "Incentive", "Bonus", "Deduction", "Adjustment"],
//       required: true
//     },

//     amount: {
//       type: Number,
//       required: true
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Approved", "Paid", "Reversed"],
//       default: "Pending"
//     },

//     note: {
//       type: String,
//       trim: true
//     },

//     settledAt: Date
//   },
//   { timestamps: true }
// );

// partnerEarningSchema.index({ deliveryPartnerId: 1, status: 1 });

// export default PartnerEarning = mongoose.model("PartnerEarning", partnerEarningSchema);