import mongoose from "mongoose";
import express from "express";

const app = express();

app.get("/",(req,res)=>{
   res.send('Hello World!'); 
 });
 
app.listen(4000,()=>{
    console.log('Server started at 4000');
}) 