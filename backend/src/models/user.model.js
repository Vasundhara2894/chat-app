//import mongoose
// create schema it takes argumnet as object
//user -> email unique ,full name,password,profilepic
// alomg with this we add createdAt and updatedAt which showes timestamp


import mongoose from "mongoose";
const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        profilePic:{
            type:String,
            default:"",
        },
    },
    {
        timestamps:true
    }
);

const User=mongoose.model("User",userSchema);

export default User;