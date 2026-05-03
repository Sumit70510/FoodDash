import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
     name: {
            type: String,
            required: true
           },
     Address: {
                 type: String,
                 required: true
               },
    username : {type : String , required : true ,unique :true } ,
    email : {type: String , required : true ,unique :true } ,
    contactNo : {type: String , required : true ,unique :true } ,
    password : {type : String,required : true ,unique :true } ,
    profilePicture : {type : String,default : "/default.jpg" } ,
    gender : {type : String,enum : ['male','female']} ,
    orders : [ {
       type : mongoose.Schema.Types.ObjectId,
       ref : "Orders"   
    }]
  }  
 ,{timestamps:true}
);

export const User = mongoose.model("User",userSchema);