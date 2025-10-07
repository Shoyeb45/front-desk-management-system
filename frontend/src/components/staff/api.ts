import { appConfig } from "@/config";
import { getToken } from "@/lib/utils";
import { Employee } from "@/types/adminTypes";
import { ApiErrorResponse, ApiSuccessReponse } from "@/types/apiTypes";
import { Patient, QueueCreate, QueueListType, TQueue, UpdateQueueData } from "@/types/staffTypes";

export async function getUserData(id: string | undefined) {
    if (!id) {
        return null;
    }

    const apiUrl = `${appConfig.backendUrl}/api/v1/user/${id}`;
    const response = await fetch(apiUrl, {
        credentials: "include"
    });

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to fetch user data: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<Employee> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

export async function addPatientInQueue(formData: QueueCreate) {
    const response = await fetch(`${appConfig.backendUrl}/api/v1/patient-queue`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
    });
    console.log(formData);
    

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to fetch user data: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<unknown> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

export async function getPatientData(email: string) {
    
    const response = await fetch(`${appConfig.backendUrl}/api/v1/patient-queue/patient?email=${encodeURIComponent(email)}`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
   

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to fetch user data: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<Patient> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

export async function getPatientQueue(filter: "TODAY" | "PAST") {
    
    const response = await fetch(`${appConfig.backendUrl}/api/v1/patient-queue?filter=${filter}`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
   
    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch(e) {
            console.error(`Some error occurred`, e);
        }
        const errorMessage = errorData?.message || `Failed to fetch user data: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<QueueListType[]> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

export async function updatePatientQueue(id: string, updateData: UpdateQueueData) {
    
    const response = await fetch(`${appConfig.backendUrl}/api/v1/patient-queue/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
    });
   
    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch(e) {
            console.error(`Some error occurred`, e);
        }
        const errorMessage = errorData?.message || `Failed to update queue data: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<TQueue> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

export async function deletePatientQueue(id: string) {
    
    const response = await fetch(`${appConfig.backendUrl}/api/v1/patient-queue/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
    });
   
    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch(e) {
            console.error(`Some error occurred`, e);
        }
        const errorMessage = errorData?.message || `Failed to remove patient from queue: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<TQueue> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}

