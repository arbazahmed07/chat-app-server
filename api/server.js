const express = require("express");
const { app, httpServer } = require("../socket/socket");
const authRoutes = require("../routes/authRoutes");
const messageRoutes = require("../routes/messageRoutes");
const userRoutes = require("../routes/userRoutes");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Import the cors middleware
const connectToMongoDB=require("../db/connectToMongoDB")
dotenv.config();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions)); // Use CORS middleware

app.use(express.json());
app.use(cookieParser()); // Parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

httpServer.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on ${PORT}`);
});
