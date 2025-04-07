import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute= async (req,res,next)=>{
    try{
         const token=req.cookies.jwt;
         if(!token){
            return res.status(401).json({message:"INVALID-unauthorized"}); 
         }
        //  we decode the userid in cookie 
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log("Decoded Token:", decoded); // Debugging

        //we used this secret to cretae token so to decode it we use same jwtsecret
        if(!decoded){
            return res.status(401).json({message:"INVALID-unauthorized token invalid"}); 

        }
        const user= await User.findById(decoded.userId  || decoded._id).select("-password"); //if user found get their info through id
        if(!user){
            return res.status(404).json({message:"user not found"}); 
        }
        // if user is authenticated add user to request
        req.user=user 
        next();


    }
    catch(error){
        console.log("error in protectedRoute middleware",error.message);
        return res.status(500).json({message:"internal server error"}); 
    }
};