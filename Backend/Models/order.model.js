import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref :"User",
      required : true
  },
  restaurantId : {
      type : mongoose.Schema.Types.ObjectId,
      ref :"Restaurant",
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
        unitPrice: {
          type: Number,
          required: true,
          min: 0 },
        totalPrice: {
            type: Number,
            required : true,
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
      default: "Preparing"},
      
    pickUpLocation : {
        address: {
        type: String,
        required: true },
        
        lat: Number,
        lng: Number },

    dropLocation: {
        address: {
        type: String,
        required: true },
        
        lat: Number,
        lng: Number },
  
  deliveredAt : { type : Date },
  cancelledAt : { type : Date },
  cancellationReason : { type : String, trim : true },
  
  },
  {timestamps:true}
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, orderStatus: 1 });

export default mongoose.model("Order", orderSchema);