import mongoose from "mongoose";

const restrauntSchema= new mongoose.Schema({
    name: {
            type: String,
            required: true
           },
    ownerName: {
            type: String,
            required: true
           },
    PAN: {
            type: String,
            required: true
           },
    FSSAI: {
            type: String,
            required: true
           },
    GST:  {
           // If Applicable
           type: String,
          },
    Address: {
                 type: String,
                 required: true
               },
    email : {type: String , required : true ,unique :true } ,
    ownerContactNo : {type: String , required : true ,unique :true } ,
    restrauntContactNo : {type: String , required : true ,unique :true } ,
    password : {type : String,required : true ,unique :true } ,
    profilePicture : {type : String,default : "/default.jpg" } ,
    Menu : [ {
       type : mongoose.Schema.Types.ObjectId,
       ref : "Menu"   
    }],
    operational : {type : String,enum : ['Open','Closed']} ,
    isOpen :{type : Boolean, default:true},
  }  
 ,{timestamps:true}
);

export const User = mongoose.model("User",restrauntSchema);