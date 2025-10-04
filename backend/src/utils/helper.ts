import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

type JwtPayload = {
    id: string,
    role: "ADMIN" | "STAFF"
}

export async function hashPassword(plainPassword: string) {
  const hash = await bcrypt.hash(plainPassword, 12);
  return hash; 
}
export async function verifyPassword(plainPassword: string, storedHash: string) {
  const isMatch = await bcrypt.compare(plainPassword, storedHash);
  return isMatch; // true if correct
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h"});
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
}
