import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name: { type: String },
    
    location : {
       address : { type: String },    
       lat: Number,
       lng: Number  },
       
    username : {type : String , unique :true } ,
    
    email : {type: String , required : true ,unique :true } ,
    
    contactNo : {type: String , required : true , unique :true } ,
    
    password : {type : String , required : true , select : false } ,
    
    profilePicture: {
      url: {type: String,},
      public_id: {type: String,} }, 
    
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