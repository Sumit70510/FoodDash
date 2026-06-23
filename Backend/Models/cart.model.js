import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
        
        totalPrice : {
             type : Number,
             min : 0, default :0 },
    
        restaurantId : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Restaurant",
            required : true },
            
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"User",
            required : true },
            
       items: [
               {
                 menuItemId: {
                   type: mongoose.Schema.Types.ObjectId,
                   ref: "MenuItem",
                   required: true,
                 },
             
                 quantity: {
                   type: Number,
                   default: 1,
                   min: 1,
                 },
             
                 sizeType: {
                   type: String,
                   required: true,
                 },
             
                 price: {
                   type: Number,
                   required: true,
                 },
             
                 discountPrice: {
                   type: Number,
                   default: 0,
                 },
               },
             ]
    },
   {timestamps:true}
  );

export default mongoose.model("Cart",cartSchema)
