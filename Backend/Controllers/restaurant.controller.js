import Restaurant from '../Models/restaurant.model.js';
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

    
export const register = async (req, res) => {
  try {
    const {
      name,
      ownerName,
      PAN,
      FSSAI,
      GST,
      address,
      lat,
      lng,
      email,
      ownerContactNo,
      restaurantContactNo,
      password,
    } = req.body;

if (
  !name?.trim() ||
  !ownerName?.trim() ||
  !PAN?.trim() ||
  !FSSAI?.trim() ||
  !address?.trim() ||
  !email?.trim() ||
  !ownerContactNo?.trim() ||
  !restaurantContactNo?.trim() ||
  !password?.trim()
) {
     return res.status(400).json({
        message: "All required Fields Are Mandatory",
        success: false,
      });
    } 

    const existingRestaurant = await Restaurant.findOne({
      email,
    });

    if (existingRestaurant) {
      return res.status(409).json({
        message: "Restaurant already exists",
        success: false,
      });
    }

    const existingFSSAI = await Restaurant.findOne({
      FSSAI,
    });

    if (existingFSSAI) {
      return res.status(409).json({
        message: "FSSAI already registered",
        success: false,
      });
    }

    const rounds = parseInt(process.env.SALT_ROUND) || 10;

    const salt = await bcrypt.genSalt(rounds);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    await Restaurant.create({
      name,
      ownerName,
      PAN,
      FSSAI,
      GST,

      location: {
        address,
        lat,
        lng,
      },

      email,
      ownerContactNo,
      restaurantContactNo,

      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};  

export const login = async(req,res)=>{  
    try
     {
       const {email , contactNo , password , force } = req.body;
       const sessionLimit = parseInt(process.env.SESSION_LIMIT)||2;
       let message;
       
       if((!email&&!contactNo)||!password)
        {
          return res.status(401).json({
           message:"Credentials Missing, Please Check !",
           success:false
          });
        }
      
       const query = email ? { email } :  { ownerContactNo: contactNo }; 
       
       const restaurant = await Restaurant.findOne(query).select("+password");   
       if(!restaurant)
        {
          return res.status(400).json({
           message:"Incorrect Credentials",
           success:false
          });  
        }
        
        const isPasswordMatch = await bcrypt.compare(password, restaurant.password); 
        if(!isPasswordMatch)
         {
           return res.status(400).json({
            message:"Incorrect Credentials",
            success:false
           });  
         }
         
      const existingSession = await Session.findOneAndUpdate({
           ownerId: restaurant._id,
           "deviceInfo.userAgent": req.headers["user-agent"],
           isActive: true
        },{isActive:false});     
      
      const activeSessions = await Session.find({
         ownerId: restaurant._id,
         ownerType: "Restaurant",
         isActive: true }); 
         
      if((activeSessions.length+1) > sessionLimit && !force){
           return res.status(409).json({
           message : "Logged On Other device, Logout To Continue Here? ",
           success : false,
           requireConfirmation: true
          });
        
       }
        
      // if(existingSession) { 
      //  message = "Login ReFreshed"; 
      //  await Session.updateOne(
      //    {_id: existingSession._id },
      //    {isActive: false });
      //  }    
       
     if ((activeSessions.length+1) > sessionLimit&&force){
      message = 'Forced LogedOut And Then LogedIn Detected';
      const extraSessions = activeSessions
       .sort((a, b) => a.createdAt - b.createdAt) // oldest first
       .slice(0, activeSessions.length - sessionLimit + 1 );

       const ids = extraSessions.map(s => s._id);
         await Session.updateMany(
          { _id: { $in: ids } },
          { isActive: false }
         );
       }
     
      //  if(activeSessions.length >= sessionLimit &&force) {
      //   await Session.updateMany(
      //    { ownerId: restaurant._id, ownerType: "Restaurant", isActive: true },
      //    { isActive: false } );
      //  }   
         
      let token = jwt.sign({_id : restaurant._id},process.env.SECRET_KEY,{expiresIn : `${process.env.VALID_TILL}d`}); 
       
       //  const userResponse = restaurant.toObject();
       //  delete userResponse.password;
    
      const hashedToken = crypto
       .createHash("sha256")
       .update(token)
       .digest("hex");

      await Session.create({
        ownerType: "Restaurant",                 
        ownerId: restaurant._id,
        token: hashedToken,
        deviceInfo: {
          userAgent: req.headers["user-agent"] ,
          // deviceName: "Unknown"
        },
        ip: req.headers["x-forwarded-for"] || req.ip,
        expiresAt: new Date(Date.now() + tokenAge)
       });

      res.cookie(tokenName,token,{...cookieOptions,maxAge : tokenAge});
      
      return res.status(200).json({
          message : message || "Logged In Successfully",
          success : true,
          restaurant
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
           message: "Expired session",
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
       
       const restaurantId = req._id;
        
       const result = await Session.updateMany({ ownerId: restaurantId ,
            ownerType: "Restaurant" , isActive :true },
           { isActive: false });
        
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