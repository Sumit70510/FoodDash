const mongoose=require('mongoose');
const {Schema}=mongoose;
const orderSchema=new Schema(
    {
      email:{
        type :String,
        require :true,
        unique:true
      },
      order_data:
      {
        type :Array,
        required : true
      }
    }
)
module.exports=mongoose.model("order",orderSchema);