// const path=require("path")
const express=require("express")

// const app=express();
const {app,httpServer}=require("../socket/socket")
const authRoutes=require("../routes/authRoutes")
const messageRoutes=require("../routes/messageRoutes")
const userRoutes=require("../routes/userRoutes")
const dotenv=require("dotenv")
const cookieParser =require("cookie-parser")
const connectToMongoDB=require("../db/connectToMongoDB")
dotenv.config();


const PORT =process.env.PORT || 5000;
// const __dirname=path.resolve();
app.use(express.json())
app.use(cookieParser())   //to parse the incoming cookies coming from req.cookies


app.use("/api/auth",authRoutes) 
app.use("/api/messages",messageRoutes) 
app.use("/api/users",userRoutes)
// app.use(express.static(path.join(__dirname,"/client/dist")))

// app.get("*",(req,res)=>{
//   res.sendFile(path.join(__dirname,"client","dist","index.html"))
// })

httpServer.listen(PORT,()=>{
  connectToMongoDB()
    console.log(`server running on ${PORT}`)}
)










// import path from "path";
// import express from "express";
// import { app, httpServer } from "../socket/socket";
// import authRoutes from "../routes/authRoutes";
// import messageRoutes from "../routes/messageRoutes";
// import userRoutes from "../routes/userRoutes";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import connectToMongoDB from "../db/connectToMongoDB";

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser()); // to parse the incoming cookies coming from req.cookies

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);
// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// // Use this to export the app handler for Vercel serverless functions
// export default (req, res) => {
//   app(req, res);
// };
