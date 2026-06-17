import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name : {
             type : String, 
             required :true,
             trim : true  },
             
    restaurantId : {
             type : mongoose.Schema.Types.ObjectId,
             ref :"Restaurant",
             required : true },
             
    menuId : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Menu",
            required : true },
 
    description: {
            type: String,
            trim: true,
            default: "",},        
                              
    isAvailable : {
             type: Boolean,
             default: true }
   }
   ,{timestamps:true}
);

export default mongoose.model("Category", categorySchema);
