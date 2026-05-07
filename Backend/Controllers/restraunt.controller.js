import Restraunt from '../Models/restraunt.model.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>
  {
    try{
        const {name,username,contactNo,email,password,location}=req.body;
        console.log(req.body);
        if(!username||!email||!password)
         {
           return res.status(401).json({
            message:"Something is Missing, Please Check !",
            success:false
           });
         }
        const user= await Restraunt.findOne({$or: [{ email }, { username }]});
        if(user)
         {
           return res.status(409).json({
            message:"Restraunt Already Exists",
            success:false
           }); 
         }  
        const hashedPassword = await bcrypt.hash(password,10); 
        const newUser = await Restraunt.create({
            name : username,
            contactNo : email,
            location : {address : location},
            username,
            email,
            password:hashedPassword
        })       
        return res.status(201).json({
            message : "Account Created Successfully",
            success : true
        });
     }
    catch(error)
     {
       console.log(error); 
       return res.status(500).json({ message: "Internal Server Error", success: false }); 
     }
  }