
// in order to prevent the confusion like as number of 
// code increase mess it creates so we used separeate file

import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../libs/cloudinary.js";

export const signup= async (req,res)=>{
   const { fullName,email,password}=req.body
   try {
    // signup user hash their passwords and create a token saying thta they are authenticated in the form of jwt cookie
    // hash password 123456=>bfhrytesefrrewww
     if(password.length<6){
        return res.status(400).json({message:"password must be atleast 6 characters"});
     }

     const user= await User.findOne({email})
     if(user) return res.status(400).json({message:"Email already exists"});
      
     const salt=await bcrypt.genSalt(10) //generate salt 10 is convention we do
     const hashedPassword= await bcrypt.hash(password,salt) // 123456=>bfhrytesefrrewww example

     const newUser =new User({
        fullName,
        email,
        password:hashedPassword
     })
     if(newUser){
        //generate jwt token here
        generateToken(newUser._id,res)
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName: newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })


     }
     else{
        res.status(400).json({message:"Invalid user data" });

     }

   } catch (error) {
    console.log("error",error.message);
    res.status(500).json({message:"Internal server error"});

    
   }
}


export const login= async (req,res)=>{
    console.log("Login route hit"); 
    console.log("Request body:", req.body);

   const{email,password} =req.body;
   try{

    const user =await User.findOne({email});
    
    if(!user){
    return res.status(400).json({ message:"INVALID CREDENTIALS" })
    }
    const iscorrectpwd=await bcrypt.compare(password,user.password);
    if(!iscorrectpwd){
        return res.status(400).json({message:"INVALID CREDENTIALS"})
    }
    generateToken(user._id, res);

    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
    });

   }
   catch(error){
    console.log("error",error.message);
    res.status(500).json({message:"Internal server error"});

   }
}

export const logout= (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    }
    catch(error){
        console.log("error",error.message);
        res.status(500).json({message:"Internal server error"});

    }
};

export const updateProfile=async(req,res)=>{
    try {
        const { profilePic} = req.body;
        const userId=req.user._id;

        if(!profilePic){
            return  res.status(400).json({message:"profile pic required"});
        }
        const uploadResponse= await cloudinary.uploader.upload(profilePic) 
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},
            {new:true});
            res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:"Internal server error"});
    }

};
export const checkAuth=(req,res)=>{
    try{
        if (!req.user) {
            return res.status(401).json({ auth: false, message: "Not authenticated" });
        }
        res.status(200).json({ auth: true, user: req.user });

  
    }
    catch(error){
        console.log("error in controller");
        res.status(500).json({message:"internal server error"});
    }
};