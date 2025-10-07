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
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
}


export function removeKeys<T extends Record<string, any>>(obj: T, keysToRemove: (keyof T)[]): Partial<T> {
  const newObj = { ...obj }; // create a shallow copy to avoid mutating the original
  for (const key of keysToRemove) {
    if (key in newObj) {
      delete newObj[key];
    }
  }
  return newObj;
}

export function getTodaysDateAttachedWithTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date(); // today
  const combinedDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0 // seconds
  );

  return combinedDate.toISOString();
}