import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";
import { ZUuid } from "../v1/types/shared.types";
import { DayOfWeek } from "@prisma/client";

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

  // Get current UTC date parts
  const now = new Date();

  // Compute today's IST midnight in UTC
  const utcFromISTOffset = 5.5 * 60; // minutes (IST = UTC+5:30)
  const totalMinutes = hours * 60 + minutes - utcFromISTOffset;

  // Construct UTC date corresponding to that IST time
  const combinedDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    totalMinutes,
    0
  ));

  return combinedDate.toISOString();
}


export function verifyUUID(id: string) {
  const data = ZUuid.safeParse({ id });
  if (!data.success) {
    return null;
  }
  return id;
}

export const getDayOfWeekEnum = (date: Date): DayOfWeek =>
  ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][date.getDay()] as DayOfWeek;
