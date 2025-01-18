const jwt=require("jsonwebtoken")
const User=require("../models/usermodel")
const protectRoute=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt;
    if(!token)
    {
      return res.status(401).json({error:"Unauthorized -No Token Provided"})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded)
    {
      return res.status(401).json({error:"Unauthorized Invalid Token "})
    }
    // decoded.userId --> it will extract the userid(._id) 
    //.select("-password")  --> remove the password field form the object
    const user =await User.findById(decoded.userId).select("-password")
    if(!user)
    {
      return res.status(401).json({error:"User Not found"})
    }

    req.user=user;
    next();
    
  } catch (error) {
    console.log("error in protected route middleware",error.message)
    res.status(500).json({error:"INternal server error"})
    
  }
}


module.exports=protectRoute;