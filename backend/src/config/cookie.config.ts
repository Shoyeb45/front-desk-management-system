import { CookieOptions } from "express";
import { config } from "./app.config";

export const cookieOptions: CookieOptions = {
    httpOnly: true,           // prevents JS access (XSS protection)
    secure: config.nodeEnv === 'production', // only send over HTTPS in prod
    sameSite: 'strict',       // CSRF protection
    maxAge: 60 * 60 * 1000,   // 1 hour
}