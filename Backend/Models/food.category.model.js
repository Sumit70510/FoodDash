import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name : {
             type : String, 
             required :true,
             trim : true  },
             
    restrauntId : {
             type : mongoose.Schema.Types.ObjectId,
             ref :"Restraunt",
             required : true },
             
    menuId : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Menu",
            required : true },
                              
    isAvailable : {
             type: Boolean,
             default: true }
   }
   ,{timestamps:true}
);

export default mongoose.model("Category", categorySchema);
