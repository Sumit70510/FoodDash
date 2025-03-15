const express=require('express');
const router=express.Router();
const User=require('../models/User'); 

const { body, validationResult } = require('express-validator');

const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const jwtSecret="Thisisa32charactersjwtSecRETKey.";

router.post(
    '/createuser'
    ,[
        body('email','Incorrect Email').isEmail(),
        body('name','Incorrect Name').isLength({ min: 4 }),
        body('password','Incorrect Password').isLength({ min: 6 })
    ]
    ,async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try{
            const salt= await bcrypt.genSalt(10);
            const SecPassword= await bcrypt.hash(req.body.password,salt);
            await User.create(
                {
             name:req.body.name,
             location:req.body.geolocation,
             email:req.body.email,
             password:SecPassword
            }
        );
         res.json({success:true}); 
       }
      catch(error)
       {
       console.log('error countered',error);
       res.json({success:false});
       } 
    }
)


router.post(
    '/loginuser'
    ,[
        body('email','Incorrect Email').isEmail(),
        body('password','Incorrect Password').isLength({ min: 6 })
    ]
    ,async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty())
         {
          return res.status(400).json({ error: errors.array() });
         }

       let email=req.body.email; 
       
       try
       {
        let userData = await User.findOne({email});

        if(!userData)
         {
          return res.status(400).json({ error: "Wrong Credentials" });
         }

        const pwdCompare=bcrypt.compare(req.body.password,userData.password);
         
        if(!pwdCompare)
         {
          return res.status(400).json({ error: "Wrong Password" });  
         }
         
        const data={
            user:{id:userData.id}
        }

        const authToken=jwt.sign(data,jwtSecret);
        return res.json({success:true,authToken:authToken}); 
       }
      catch(error)
       {
       console.log('error countered',error);
       res.json({success:false});
       } 
    }
)

module.exports=router;