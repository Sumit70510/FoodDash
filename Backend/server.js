import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv';
import menuRoutes from "./Routes/menu.routes.js";
import userRoutes from './Routes/user.routes.js';
import restaurantRoutes from './Routes/restaurant.routes.js';
import deliveryPartnerRoutes from "./Routes/deliveryPartner.routes.js";
import cookieParser from "cookie-parser";
import connectDB from "./Utils/db.js";
import cors from 'cors';
import path from 'path';
import menuItemRoutes from "./routes/menu.item.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT||4000;

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOption={
    origin : process.env.URL,
    credentials : true,  
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}; 
app.use(cors(corsOption));

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/restaurant',restaurantRoutes);
app.use('/api/v1/deliveryPartner',deliveryPartnerRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/menu-item", menuItemRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/cart", cartRoutes);

app.get("/",(req,res)=>{
    res.send('Server Running'); 
});

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server started at ${PORT}`);
});