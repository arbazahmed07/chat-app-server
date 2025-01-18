const express=require("express")
const router=express.Router()
const protectRoute=require("../middleware/protectRoute");
const user = require("../models/usermodel");


// to get the all users for side bar
router.get("/",protectRoute,async(req,res)=>{
  try {

const loggedInUserId=req.user._id;
// fetch all users from the db but not one which is currently logged in
    const filteredUsers=await user.find({_id:{$ne:loggedInUserId}}).select("-password")
res.status(200).json(filteredUsers)    

  } catch (error) {
    console.log("error in getusersFor side bar",error.message)
    res.status(500).json({error:"Internal server error"})
    
  }

})













module.exports=router;