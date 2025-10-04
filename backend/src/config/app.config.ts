import dotenv from 'dotenv';

dotenv.config();

export const config = {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080
}   