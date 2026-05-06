import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv';
import userRoutes from './Routes/user.routes.js';
import cookieParser from "cookie-parser";
import connectDB from "./Utils/db.js";
import cors from 'cors';
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

app.get("/",(req,res)=>{
   res.send('Server Running'); 
 });
 
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server started at ${PORT}`);
}) 