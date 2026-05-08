import mongoose from "mongoose";

const restrauntSchema= new mongoose.Schema({
    name : { type: String,
             required: true },
            
    ownerName : { type: String,
                  required: true },
                  
    PAN : { type: String,
            unique : true ,
            required: true },
            
    FSSAI : { type: String,
            //   unique : true,
              required: true },
              
    GST : { // If Applicable
            type: String },
               
    location : {
        address : { type: String,
                    required: true },    
        lat: Number,
        lng: Number  },
                 
    email : {type: String , required : true ,unique :true },
    
    ownerContactNo : {type: String , required : true ,unique :true },
    
    restrauntContactNo : {type: String , required : true ,unique :true },
    
    password : {type : String,required : true },
    
    restrauntPicture : {type : String,default : "/default.jpg" },
    
    operational : {type : String,enum : ['Open','Closed']} ,
    
    isOpen :{type : Boolean, default:true},  
  },
  {timestamps:true}
);

export default mongoose.model("Restraunt",restrauntSchema);