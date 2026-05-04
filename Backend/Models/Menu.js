import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
    name : {
             type : String  , 
             required :true ,
             trim : true  } ,
    restrauntId : {
             type : mongoose.Schema.Types.ObjectId,
             ref :"Restraunt",
             required : true },
    // categoryId : [{
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref :"Category",
    //         required : true }], 
            
    // menuItemId : [{
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref :"MenuItem",
    //         required : true}],
                            
    isAvailable : {
             type: Boolean,
             default: true }
   }
   ,{timestamps:true}
);

export default Menu = mongoose.model("Menu", menuSchema);
