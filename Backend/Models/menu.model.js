import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    name : {
             type : String, 
             required :true,
             trim : true },
    
    restaurantId : {
             type : mongoose.Schema.Types.ObjectId,
             ref :"Restaurant",
             required : true },
                            
    isAvailable : {
             type: Boolean, 
             default: false }
   }
   ,{timestamps:true}
);

export default mongoose.model("Menu", menuSchema);
