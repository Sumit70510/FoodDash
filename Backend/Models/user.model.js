import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
     name: {
            type: String,
            required: true
           },
           
    location : {
       address : { type: String,
                    required: true },    
       lat: Number,
       lng: Number  },
       
    username : {type : String , required : true ,unique :true } ,
    
    email : {type: String , required : true ,unique :true } ,
    
    contactNo : {type: String , required : true ,unique :true } ,
    
    password : {type : String,required : true } ,
    
    profilePicture : {type : String,default : "/default.jpg" } ,
    
    gender : {type : String,enum : ['male','female']} ,
    
  }  
 ,{timestamps:true}
);

export default User = mongoose.model("User",userSchema);