import { DayOfWeek, DecodedUser } from "@/types/adminTypes";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};



export function decodeToken(token: string | null): DecodedUser | null {
    if (!token) {
        return null;
    }
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
}

export const getDayColor = (day: DayOfWeek): string => {
    const colors = {
        MONDAY: "bg-blue-100 text-blue-700",
        TUESDAY: "bg-green-100 text-green-700",
        WEDNESDAY: "bg-yellow-100 text-yellow-700",
        THURSDAY: "bg-purple-100 text-purple-700",
        FRIDAY: "bg-pink-100 text-pink-700",
        SATURDAY: "bg-orange-100 text-orange-700",
        SUNDAY: "bg-red-100 text-red-700"
    };
    return colors[day] || "bg-gray-100 text-gray-700";
};


export function getToken() {
  return localStorage.getItem("token");
}

export const getFormattedDoctorName = (name: string) => {
    if (name.startsWith("Dr") || name.startsWith("dr") || name.startsWith("doctor") || name.startsWith("Doctor")) {
        return name;
    }
    return `Dr ${name}`;
}