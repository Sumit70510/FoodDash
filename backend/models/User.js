const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema= new Schema(
    {
    name:{
      type : String,
      required:true
    }
    ,location:{
        type : String,
        requireed:true
    }
    ,email:{
        type : String,
        requireed:true
    }
    ,password:{
        type : String,
        requireed:true
    }
    ,date:{
        type : Date,
        default:Date.now
    }
    }
)

module.exports= mongoose.model('user',UserSchema);