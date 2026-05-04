import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
     
    orderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"Order",
        required : true ,
        unique : true },
        
    // restrauntId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref :"Restraunt",
    //     required : true },
        
    deliveryPartnerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"DeliveryPartner",
        default : null },
          
    status : {
        type: String,
        enum: [
         "Pending Assignment",
         "Assigned",
         "Arrived at Restaurant",
         "Picked Up",
         "Out For Delivery",
         "Delivered",
         "Failed",
         "Cancelled" ],
        default: "Pending Assignment"},
       
    payoutStatus : {
       type: String,
       enum: ["Pending", "Processed", "Paid"],
       default: "Pending"},    
 
    notes : {
       type: String,
       trim: true},
        
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0 },
    
    incentiveAmount: {
      type: Number,
      default: 0, min: 0 },
    
    deductionAmount: {
      type: Number,
      default: 0, min: 0},
    
    assignedAt : {
        type: Date },

    pickedUpAt : {
        type: Date },

    deliveredAt : {
        type: Date },

    cancelledAt : {
        type: Date },
  },
{timestamps:true});

deliverySchema.index({ deliveryPartnerId: 1, status: 1 });
deliverySchema.index({ deliveryPartnerId: 1, payoutStatus: 1 });

export default Delivery = mongoose.model("Delivery",deliverySchema);