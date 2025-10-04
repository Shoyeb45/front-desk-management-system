import dotenv from 'dotenv';

dotenv.config();

export const config = {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,

    jwtSecret: process.env.JWT_SECRET || "my-jwt-secret",
    jwtExpiry: process.env.JWT_EXPIRY || "1h"
}   