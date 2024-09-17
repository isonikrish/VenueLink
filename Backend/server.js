import express from "express";
import authRoutes from "./routes/auth.js";
import eventRoutes from './routes/event.js';
import userRoutes from './routes/user.js'
import dotenv from "dotenv";
import connectMongoDB from "./config/dbconfig.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinary from 'cloudinary'
dotenv.config();
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials like cookies to be sent
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use('/api/user', userRoutes)



app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
  connectMongoDB();
});
