import mongoose from "mongoose";

const deliveryLocationSchema = new mongoose.Schema(
{
    deliveryPartnerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPartner",
        required:true
    },

    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },

    latitude:Number,

    longitude:Number,

    heading:Number,

    speed:Number,

    accuracy:Number,

    isOnline:{
        type:Boolean,
        default:true
    },

    updatedAt:{
        type:Date,
        default:Date.now
    }

});

export default mongoose.model(
    "DeliveryLocation",
    deliveryLocationSchema
);