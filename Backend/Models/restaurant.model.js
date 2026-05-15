import mongoose from "mongoose";

const restaurantSchema= new mongoose.Schema({
    name : { type: String,
             required: true },
            
    ownerName : { type: String,
                  required: true },
                  
    PAN : { type: String,
            required: true },
            
    FSSAI : { type: String,
              unique : true,
              required: true },
              
    GST : { // If Applicable
            type: String },
               
    location : {
        address : { type: String,
                    required: true},    
        lat: Number,
        lng: Number  },
                 
    email : {type: String , required : true , unique :true },
    
    ownerContactNo : {type: String , required : true  },
    
    restaurantContactNo : {type: String , required : true },
    
    password : {type : String,required : true ,select : false},
    
    restaurantPicture : {type : String,default : "/default.jpg" },
    
    isOpen :{type : Boolean, default:true},  
  },
  {timestamps:true}
);

restaurantSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

const Restaurant =
  mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;