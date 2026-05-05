import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
   name : {  type : String , 
             required :true ,
             trim : true },
             
    description : {
             type : String , 
             required :true ,
             trim : true },
             
    image : [{type : String , required : true}],
    
    restrauntId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"Restraunt",
        required : true },
            
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"Category",
        required : true },
        
    foodType: {
      type: String,
      enum: ["Veg","Non-Veg","Egg-Only"],
      required: true },
      
    variants: 
      [ {
          // label: {
          //  type: String,
          //  required: true,
          //  trim: true },
         sizeType: {
            type: String,
            enum: ["Quarter", "Half", "Full", "Small", "Medium", "Large", "Extra Large"],
            required: true ,
            trim : true
           },
           
          price: {
           type: Number,
           required: true,
           min: 0 },
           
          discountPrice: {
            type: Number,
            min: 0 },
        } ],
        
    isAvailable: 
     { type: Boolean,
       default: true }
       
  },
{timestamps:true}
);

export default MenuItem = mongoose.model("MenuItem", menuItemSchema);
