import User from '../Models/user.model.js';
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
        const user= await User.findOne({$or: [{ email }, { username }]});
        if(user)
         {
           return res.status(409).json({
            message:"User Already Exists",
            success:false
           }); 
         }  
        const hashedPassword = await bcrypt.hash(password,10); 
        const newUser = await User.create({
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

// have doubt  
// export const login = async(req,res)=>
//   {
//      try
//       {
//         const {email,password}=req.body;
        
//         if(!email||!password)
//          {
//            return res.status(400).json({
//             message:"Something is Missing, Please Check !",
//             success:false
//            });
//          }
//         let user = await User.findOne({email});
        
//         if(!user)
//          {
//            return res.status(400).json({
//             message:"Incorrect Credentials",
//             success:false
//            }); 
//          }  
//         const isPasswordMatch = await bcrypt.compare(password,user.password);
//         if(!isPasswordMatch) 
//          {
//            return res.status(400).json({
//             message:"Incorrect Credentials",
//             success:false
//            });   
//          }   
         
//          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,{expiresIn:'1d'});
         
//          const populatedPosts= await Promise.all(
//            user.posts.map(async(postId)=>{
//             const post = await Post.findById(postId);
//              if(post.author.equals(user._id))
//                {return post;}
//              return null; 
//            })) 
//       //    const populatedBookmarks = await Promise.all(
//       //     user.bookmarks.map(async (postId) => {
//       //     return await Post.findById(postId);
//       //  })
//       //   );  
//         //  user={
//         //      _id : user._id,
//         //      name : user.name,
//         //      gender : user.gender,
//         //     username : user.username,
//         //     email : user.email,
//         //     profilePicture : user.profilePicture,
//         //     bio : user.bio,
//         //     followers : user.followers,
//         //     following : user.following,
//         //     posts : populatedPosts,
//         //     bookmarks:user.bookmarks
//         //  }
        
//         return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000})
//         .json({
//             message : `Welcome Back ${user.username}`,
//             success : true,
//             user
//         });
  
//       }
//      catch(error)
//       {
//         console.log(error);
//         return res.status(500).json({ message: "Internal Server Error", success: false });
//       }     
//   }
  
// export const logout = async(req,res)=>
//   {
//     try
//      {
//        return res.cookie("token","",{maxAge:0}).
//        json({
//          message : "Logged Out Successfully",
//          success : true
//        });  
//      }
//     catch(error)
//      {
//        console.log(error); 
//        return res.status(500).json({ message: "Internal Server Error", success: false }); 
//      }    
//   }