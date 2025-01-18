const express=require("express")
const router=express.Router();
const protectRoute=require("../middleware/protectRoute")
const Conversation=require("../models/conversationModel")
const Message=require("../models/messageModel");
const { getReceiverSocketId, io } = require("../socket/socket");


router.post("/send/:id",protectRoute,async(req,res)=>{
 try {
  const {message}=req.body;
  const {id:receiverId} =req.params;
  console.log("id",receiverId)
  const senderId=req.user._id;

let convo=await Conversation.findOne({
  participants:{$all:[senderId,receiverId]},
})
if(!convo)
{
  convo=await Conversation.create({
    participants:[senderId,receiverId]
  })
}
const newMsg=new Message({
  senderId,
  receiverId,
  message
})

if(newMsg)
{
  convo.messages.push(newMsg._id)
}

// await convo.save();  1 sec execution
// await newMsg.save();  2 sec execution

//this will run in parallel(1 sec)
await Promise.all([convo.save(),newMsg.save()])


//SOCKET IO FUNCTIONALUTY WILL GO HERE

const receiverSocketId=getReceiverSocketId(receiverId)
if(receiverSocketId){

  //io.to(<socketid>).emit()  used to send events to specififc client
  io.to(receiverSocketId).emit("newMessage",newMsg)
}




res.status(201).json(newMsg)
 } catch (error) {
  console.log("err in send message controller",error.message)
  res.status(500).json({error:"internal server error"})
  
 }
})


router.get("/:id",protectRoute,async(req,res)=>{
  try {
    const {id:userToChatId}=req.params;
    // console.log(userToChatId)
    const senderId=req.user._id;
    console.log(senderId)

    const convo=await Conversation.findOne({
      participants:{$all:[senderId,userToChatId]},
    }).populate("messages")

    
    if(!convo) return res.status(200).json([]);
    const msgs=convo.messages
    res.status(200).json(msgs)  //not reference but actual msgs

  } catch (error) {
    console.log("err in get message controller",error.message)
  res.status(500).json({error:"internal server error"})
    
  }

})








module.exports=router;