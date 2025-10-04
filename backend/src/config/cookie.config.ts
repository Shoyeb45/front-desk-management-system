import { CookieOptions } from "express";
import { config } from "./app.config";

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 1000,
    path: '/',
}