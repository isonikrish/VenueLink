import express from "express";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import connectMongoDB from "./config/dbconfig.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();

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

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
  connectMongoDB();
});
