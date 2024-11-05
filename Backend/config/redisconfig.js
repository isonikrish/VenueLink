import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};

// Handle errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});

connectRedis();

export default client;
