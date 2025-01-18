const express=require("express");
const { signup, login, logout } = require("../controllers/authControllers");
const router=express.Router();
const bcrypt=require("bcryptjs")
const User=require("../models/usermodel")
const generateTokenAndSetCookie=require("../utils/generateToken")
router.post("/signup",async(req,res)=>{
  try {
    const{fullName,username,password,confirmPassword,gender} =req.body
    // console.log(password)
    // console.log(confirmPassword)

  if(password!==confirmPassword)
  {
    return res.status(400).json({error:"passwords dont match"})
  }
  const user = await User.findOne({username});
  if(user)
  {
    return res.status(400).json({error:"username already exists"})
  }
  //hash the pass

const salt=await bcrypt.genSalt(10);
const hashpass=await bcrypt.hash(password,salt)
  //https://avatar.iran.liara.run/public/boy?username=Scott
  const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
  const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`

   const newUser= new User({
    fullName,
    username,
    password:hashpass,
    gender,
    profilePic:gender==="male"? boyProfilePic:girlProfilePic,
   })
   if(newUser)
   {
    //generate JWT token
    generateTokenAndSetCookie(newUser._id,res)
    // console.log("res is ",res)
    
    await newUser.save();
    res.status(201).json({
     _id:newUser._id,
     fullName:newUser.fullName,
     username:newUser.username,
     profilePic:newUser.profilePic
    })
   }
   else
   {
    res.status(400).json({error:"invaild user data"})
   }
 
  } catch (error) {
    console.log("err in signup",error.message);
    res.status(500).json({errpr:"internal server error"})
  }

})


router.post("/login",async(req,res)=>{
  try {
    const {username,password}=req.body;
    const user=await User.findOne({username});
    const isPassCorrect=await bcrypt.compare(password,user?.password || "");
    // console.log("user is",user)
    if(!user || !isPassCorrect)
    {
      return res.status(400).json({error:"invalid useranme or pass "});
     
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      username:user.username,
      profilePic:user.profilePic
     })
    
  } catch (error) {
    console.log("err in login controller",error.message);
    res.status(500).json({error:"internal server error"});
    
  }
})

router.post("/logout",async(req,res)=>{
 
try{
  res.cookie("jwt","",{maxAge:0})
  // console.log("res cooke",res)
  res.status(200).json({msg:"Logged out successfully"})
}
catch(error)
{
  console.log("err in logout controller",error.message);
  res.status(500).json({error:"internal server error"});
}
})



module.exports=router;