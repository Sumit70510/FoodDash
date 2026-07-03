import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },

    payerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true
    },

    razorpayOrderId:String,

    razorpayPaymentId:String,

    razorpaySignature:String,

    amount:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        default:"INR"
    },

    method:{
        type:String,
        enum:["Cod","UPI","Card","Wallet"]
    },

    paymentStatus:{
        type:String,
        enum:["Pending","Paid","Failed","Refunded"],
        default:"Pending"
    }

},
{timestamps:true}
);

export default mongoose.model("Payment",paymentSchema);