import User from '../Models/user.model.js';
import Session from '../Models/session.model.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();


const tokenName = process.env.TOKEN || "jwt";
const tokenAge =  (parseInt(process.env.VALID_TILL)||2)*2*24*60*60*1000;
const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== 'DEVELOPMENT'
    };

    
export const register = async(req,res)=>{
    try{
        const data = req.body;

        if(!data.email||!data.password)
         {
           return res.status(401).json({
            message:"Something is Missing, Please Check !",
            success:false
           });
         }
        const user= await User.findOne({email: data?.email });
        if(user)
         {
           return res.status(409).json({
            message:"User Already Exists",
            success:false
            }); 
         }    
       const rounds =  parseInt(process.env.SALT_ROUND)||10; 
       const salt = await bcrypt.genSalt(rounds);
       const hashedPassword = await bcrypt.hash(data.password, salt);
       
       const newUser = await User.create({
            name : data?.name,
            contactNo : data.email,
            location : {address : data?.location},
            email : data.email,
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
       return res.status(500).json({ message: "Internal Server Error", success : false }); 
     }
  }
  
  
export const login = async(req,res)=>{  
    try
     {
       const {email , contactNo , password } = req.body;
       
       if((!email&&!contactNo)||!password)
        {
          return res.status(401).json({
           message:"Credentials Missing, Please Check !",
           success:false
          });
        }
      
       const query = email ? { email } : { contactNo }; 
       
       const user = await User.findOne(query).select("+password");   
       if(!user)
        {
          return res.status(400).json({
           message:"Incorrect Credentials",
           success:false
          });  
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password); 
        if(!isPasswordMatch)
         {
           return res.status(400).json({
            message:"Incorrect Credentials",
            success:false
           });  
         }
        
      let token = jwt.sign({_id : user._id},process.env.SECRET_KEY,{expiresIn : '2d'}); 
       
       //  const userResponse = user.toObject();
       //  delete userResponse.password;
    
      // hash token before storing
      const hashedToken = crypto
       .createHash("sha256")
       .update(token)
       .digest("hex");

      // Storing Session  
      await Session.create({
        ownerType: "User",                 
        ownerId: user._id,
        token: hashedToken,
        deviceInfo: {
          userAgent: req.headers["user-agent"] },
        ip: req.ip,
        expiresAt: new Date(Date.now() + tokenAge)
       });

      // Assigning Token
      res.cookie(tokenName,token,{...cookieOptions,maxAge : tokenAge});
      
      return res.status(200).json({
          message : "Logged In Successfully",
          success : true,
          user
       })
     }
    catch(error)
     {
       console.log(error);
       return res.status(500).json({message : "Internal Server Error", success : false}); 
     }
  }
  
export const logout = async(req,res)=>{
    try
     {
       const token = req.cookies[tokenName];
       
       res.clearCookie(tokenName,cookieOptions);
      
       if(!token) {
        return res.status(400)
        .json({
          message: "Already Loggedout",
          success: false
         });
        }

       // hash it 
       const hashed = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

       // lookup
       const session = await Session.findOneAndUpdate(
         { token: hashed, isActive: true },
         { isActive: false } );
          
       if(!session) 
        {
           return res.status(401).json({
           message: "Invalid session",
           success: false
            });
        }
        
       return  res.json({
          message : "Logged Out Successfully",
          success : true 
        });
     }
    catch(error)
     {
       console.log(error);
       return res.status(500).json({message : "Internal Server Error", success : false});
     } 
 }  
 
export const logoutFromAll = async(req,res)=>{
    try
     {
       const token = req.cookies[tokenName];
       
       res.clearCookie(tokenName,cookieOptions);
      
       if(!token) {
        return res.status(400)
        .json({
          message: "Already Loggedout",
          success: false
         });
        }
       
       let decode ;
       
       try 
        { decode = jwt.verify(token, process.env.SECRET_KEY); }
       catch
        {
          return res.status(401)
          .json({
            message: "Invalid Session",
            success: false
          });
        }
       const userId = decode._id;
        
       const result = await Session.updateMany({ ownerId: userId ,
            ownerType: "User" , isActive :true },
           { isActive: false });

       if(result.matchedCount === 0) {
         return res.status(404).json({
          message: "No active sessions found",
          success: false
          });
         }    
        
       return  res.json({
          message : "Logged Out From All Devices Successfully",
          success : true 
        });
     }
    catch(error)
     {
       console.log(error);
       return res.status(500).json({message : "Internal Server Error", success : false});
     }
 }