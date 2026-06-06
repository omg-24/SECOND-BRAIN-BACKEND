
import dotenv from "dotenv";

dotenv.config();

export const config = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET, 
};