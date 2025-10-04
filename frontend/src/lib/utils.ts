import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface JwtPayload {
  id: string,
  role: "ADMIN" | "STAFF"
}

export function decodeToken(token: string) {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
            id: decoded.id,
            role: decoded.role,
        };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}