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
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
}


export function getToken() {
  return localStorage.getItem("token");
}