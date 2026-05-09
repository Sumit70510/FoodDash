import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../Models/session.model.js";

const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== 'DEVELOPMENT'
    };

const isAuthenticated = async(req,res,next)=>
  {
    try
     {
       const tokenName = process.env.TOKEN||"jwt";
       const token = req.cookies[tokenName];
       if(!token)
         { 
           res.clearCookie(tokenName,cookieOptions);
           return res.status(401).json({
             message : "User Not Authenticated",
             success : false
           })
         }
       
       let decode ;
       try 
        {
          decode = jwt.verify(token, process.env.SECRET_KEY);
        }
       catch(error)
        {
          res.clearCookie(tokenName,cookieOptions);
          return res.status(401).json({
             message : "Invalid Token",
             success : false
          });  
        } 
        
       const userId = decode._id;
       
       const hashedToken = crypto.createHash("sha256")
                                 .update(token)
                                 .digest("hex");
       
        const currentSession = await Session.findOne({token:hashedToken,isActive:true});
        
        if(!currentSession)
         {
           res.clearCookie(tokenName,cookieOptions);
           return res.status(401).json({
             message: "Session Expired or Logged Out",
             success: false});
         }
         
        await Session.updateOne(
          { _id: currentSession._id },
          { lastUsedAt: new Date() }
         );
 
         
        req._id = userId; 
        next();
     }
    catch(error)
     {
       res.clearCookie(tokenName, cookieOptions);
       return res.status(500).json({
         message : "Internal Server Error",
         success : false
       })
     } 
  }
  
export default isAuthenticated;  