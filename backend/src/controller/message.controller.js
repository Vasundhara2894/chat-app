import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId,io } from "../libs/socket.js";
//sidebar shld list the user loggedin excluding myself it shld not show mine

export const getUserForSidebar =async(req,res)=>{
    try{
        const loggedInUserid=req.user._id;  //get the logged in user id like mine it gives
        const filteredUsers= await User.find({_id: {$ne:loggedInUserid}}).select("-password");//this tells mongoose u shld find all the users but not the currently loggedin user and not including the password
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("error in getuserforsidebar",error.message);
        res.status(500).json({message:"internal server error"});
        
    }
};

export const getMessages=async(req,res)=>{
    try{
       const{id:userToChatId}= req.params
       const myId=req.user._id;
       const message =await Message.find({ //all the messages btwn both of us
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId: myId}
        ]})

        res.status(200).json(message);
    } catch(error){
        console.log("error in getmessage",error.message);
        res.status(500).json({message:"internal server error"});

    }
}
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const{id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();


        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);



    }catch(error){
        console.log("error in sendmessage",error.message);
        res.status(500).json({message:"internal server error"});
    }
}