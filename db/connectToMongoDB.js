const mongoose=require("mongoose")

const connectToMongoDB=async()=>{

  try {
    // console.log(process.env.MONGO_DB_URI)
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log("db connected") 
    
  } catch (error) {
    console.log("error in connecting to db",error.message);
  }
}


module.exports=connectToMongoDB