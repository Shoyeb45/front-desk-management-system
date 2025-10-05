import { appConfig } from "@/config";
import { getToken } from "@/lib/utils";
import { ApiErrorResponse, ApiSuccessReponse } from "@/types/apiTypes";
import { Employee } from "./types";

export async function getEmployees(role: "doctor" | "staff"): Promise<Employee[]> {
    const apiUrl = role === "doctor" 
        ? `${appConfig.backendUrl}/api/v1/doctor`
        : `${appConfig.backendUrl}/api/v1/user?role=STAFF`;

    const response = await fetch(apiUrl, {
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }
        
        const errorMessage = errorData?.message || `Failed to fetch ${role}s: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<{ users: Employee[] }> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data.users;
}

export async function createEmployee(
    role: "doctor" | "staff", 
    employeeData: Omit<Employee, 'id'>
): Promise<Employee> {
    const apiUrl = role === "doctor" 
        ? `${appConfig.backendUrl}/api/v1/doctor`
        : `${appConfig.backendUrl}/api/v1/user`;

    const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }
        
        const errorMessage = errorData?.message || `Failed to create ${role}: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<{ data: Employee,  }> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data.data;
}