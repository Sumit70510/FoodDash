import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref :"User",
      required : true
  },
  restrauntId : {
      type : mongoose.Schema.Types.ObjectId,
      ref :"Restraunt",
      required : true
  },
  items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true
        },
        name: {
          type: String,
          required: true
        },
        sizeType:
          {
            type: String,
            enum: ["Quarter", "Half", "Full", "Small", "Medium", "Large", "Extra Large"],
            required: true ,
            trim : true
           },
        quantity: {
          type: Number,
          required: true,
          min: 1 },
        price: {
          type: Number,
          required: true,
          min: 0 },
        discountPrice: {
            type: Number,
            min: 0 },
      }
    ],

    subTotal: {
      type: Number,
      required: true,
      min: 0
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },

    tax: {
      type: Number,
      default: 0,
      min: 0
     },

    discount: {
      type: Number,
      default: 0,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ["Cod", "UPI", "Card", "Wallet"],
      default: "Cod"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Preparing",
        "Picked Up",
        "Out For Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Preparing"
    },
  pickUpLocation : {
    type: String,
    required: true,
   },
  dropLocation : {
    type: String,
    required: true,
   },
  isDelivered :{type : Boolean, default:false}, 
  isCancelled :{type : Boolean, default:false}, 
  arivalTime : {type : Date }
  },
  {timestamps:true}
);

export default Order = mongoose.model("Order", orderSchema);
