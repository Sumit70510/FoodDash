import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: { type: String },
    
    location : {
       address : { type: String },    
       lat: Number,
       lng: Number  },
       
    username : {type : String , unique :true } ,
    
    email : {type: String , required : true ,unique :true } ,
    
    contactNo : {type: String , unique :true } ,
    
    password : {type : String , required : true , select : false } ,
    
    profilePicture : { type : String , default : "/default.jpg" } ,
    
    gender : {type : String,enum : ['male','female']} ,
    
  }  
 ,{timestamps:true}
);

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});


export default mongoose.model("User",userSchema);