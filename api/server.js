const express = require("express");
const { app, httpServer } = require("../socket/socket");
const authRoutes = require("../routes/authRoutes");
const messageRoutes = require("../routes/messageRoutes");
const userRoutes = require("../routes/userRoutes");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToMongoDB = require("../db/connectToMongoDB");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Allow multiple origins based on environment
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-production-domain.com', // Add your production domain
  process.env.CLIENT_URL, // Optional: Configure via environment variable
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization",
    "X-Requested-With",
    "Accept"
  ],
  credentials: true,
  maxAge: 86400 // Cache CORS preflight request for 24 hours
};

app.use(cors(corsOptions));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

httpServer.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});