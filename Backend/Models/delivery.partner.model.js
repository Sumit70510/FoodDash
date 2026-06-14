import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
            type: String,
            required : true
           },
           
    permanentAddress: {
                type: String, 
                required : false
             },
             
    username : { type : String , required : false ,unique :true } ,
    
    email : { type: String , required : true ,unique :true } ,
    
    contactNo : { type: String , required : true ,unique :true } ,
    
    profilePicture: { url: {type: String },public_id: { type: String } }, 
       
    gender : { type : String,enum : ['Male','Female'] } ,
    
    age : { type : Number, min : 18 , required : false } ,
    
    password : { type : String,required : true } ,
    
    licenseNo : {type : String , unique : true , required : true},
    
    PAN : { type: String,
            unique : true,
            required : false },
    
    AADHAR : { type: String,
               unique : true,
               required : true }, 
                      
    vehicleType : {
          type: String,
          enum: ["Bike", "Scooter", "Cycle", "Car"],
          required : true },

    vehicleNo : {
          type: String,
          trim: true,
          uppercase: true,
          required : true
         },

    availabilityStatus : {
        type: String,
        enum: ["Offline", "Online", "Busy"],
        default: "Offline"
      },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending"
    },

    isActive: {
      type: Boolean,
      default : true
    },

    currentLocation: {
      address: {
        type: String,
        trim: true
      },
      lat: Number,
      lng: Number,
      updatedAt: Date
    },

    totalDeliveriesCompleted: {
      type: Number,
      default: 0,
      min: 0 },

    totalLifetimeEarnings: {
      type: Number,
      default: 0,
      min: 0 },

    currentUnsettledEarnings: {
      type: Number,
      default: 0,
      min: 0 },

    totalIncentives: {
      type: Number,
      default: 0,
      min: 0 },

    totalDeductions: {
      type: Number,
      default: 0,
      min: 0 },

    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5 },
 },
{timestamps:true});

export default mongoose.model("DeliveryPartner",deliveryPartnerSchema);