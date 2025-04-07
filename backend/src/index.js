
import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import path from "path";


// import { connect } from "mongoose";
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {io,app,server} from "./libs/socket.js";


import bodyParser from "body-parser"; 
 dotenv.config();
 const PORT=process.env.PORT|| 5000;
 const __dirname = path.resolve();

  
  //to grab the fulname email password  
 // we need to add middlelayer it is used to  extract the json data
 app.use(express.json({ limit: "10mb" }));
 app.use(express.urlencoded({ extended: true, limit: "10mb" }));
 app.use(cookieParser());//parse the cookie we get values out of it 
 
 app.use(cors({
   origin:"http://localhost:5173",
   credentials:true,
 }));
 app.use("/api/auth",authRoutes)
 app.use("/api/messages",messageRoutes)

 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

 server.listen(5000,()=>{ 
    console.log("server is running on the port:"+ PORT)
    connectDB();
 });
 