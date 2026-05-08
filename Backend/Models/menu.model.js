import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    name : {
             type : String, 
             required :true,
             trim : true },
    
    restrauntId : {
             type : mongoose.Schema.Types.ObjectId,
             ref :"Restraunt",
             required : true },
                            
    isAvailable : {
             type: Boolean,
             default: true }
   }
   ,{timestamps:true}
);

export default mongoose.model("Menu", menuSchema);
