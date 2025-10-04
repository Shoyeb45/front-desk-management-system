import { CookieOptions } from "express";
import { config } from "./app.config";

export const cookieOptions: CookieOptions = {
    httpOnly: true,           // prevents JS access (XSS protection)
    secure: true,             // MUST be true for sameSite: 'none'
    sameSite: 'none',         // allows cross-origin cookies
    maxAge: 60 * 60 * 1000,   // 1 hour
    domain: undefined,        // don't set domain for cross-origin
}