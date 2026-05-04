import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
        
        totalPrice : {
             type : Number,
             min : 0, default :0 },
    
        restrauntId : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Restraunt",
            required : true },
            
        items : [{
            menuItemId : {
              type: mongoose.Schema.Types.ObjectId,
              ref: "MenuItem",
              required: true },
            
            quantity : {
              type: Number,
              min: 1, default: 1 },
            
            sizeType : {
              type: String,
              enum: ["Quarter", "Half", "Full", "Small", "Medium", "Large", "Extra Large"],
              required: true ,
              trim : true },
             
            price: {
              type: Number,
              required: true,min: 0 },

            discountPrice: {
            type: Number,
            min: 0 },    
           }]  
    },
   {timestamps:true}
  );

export default Cart = mongoose.model("Cart",cartSchema)
