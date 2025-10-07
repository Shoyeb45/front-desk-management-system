import { appConfig } from "@/config";
import { getToken } from "@/lib/utils";
import { ApiErrorResponse, ApiSuccessReponse } from "@/types/apiTypes";
import { DoctorAvailability, Employee, Gender } from "@/types/adminTypes";

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


    const formData = { ...employeeData, gender: employeeData.gender === Gender.MALE ? "MALE" : "FEMALE"  };
    if (role === "staff") {
        formData.role = "STAFF";
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData })
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

    const apiResponse: ApiSuccessReponse<Employee> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }
    console.log(apiResponse);
    return apiResponse.data;
}


export async function deleteEmployee(role: "doctor" | "staff", id: string) {
    if (!id) {
        return;
    }
    const api = `${appConfig.backendUrl}/api/v1/${(role === "doctor" ? "doctor" : "user")}/${id}`;
    const response = await fetch(api, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to delete ${role}: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<Employee> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;

}

export async function fetchUserDetail(role: "doctor" | "staff", id: string) {
    if (!id) {
        return;
    }
    const api = `${appConfig.backendUrl}/api/v1/${(role === "doctor" ? "doctor" : "user")}/${id}`;
    const response = await fetch(api, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
    })

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to delete ${role}: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<Employee> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;
}


export async function editEmployee(role: "doctor" | "staff", id: string, formData: Omit<Employee, "id">) {
    if (!id) {
        return;
    }
    const api = `${appConfig.backendUrl}/api/v1/${(role === "doctor" ? "doctor" : "user")}/${id}`;
    const response = await fetch(api, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, gender: formData.gender === Gender.MALE ? "MALE" : "FEMALE" })
    });

    if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
            errorData = await response.json();
        } catch {
            // If JSON parsing fails, use status text
        }

        const errorMessage = errorData?.message || `Failed to delete ${role}: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    const apiResponse: ApiSuccessReponse<Employee> = await response.json();

    if (!apiResponse.success) {
        throw new Error(apiResponse.message);
    }

    return apiResponse.data;

}


export const scheduleApi = {
    async getSchedule(doctorId: string): Promise<DoctorAvailability[]> {
        const response = await fetch(`${appConfig.backendUrl}/api/v1/doctor-availability/doctor/${doctorId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        return data.data.availability;
    },

    async createSchedule(doctorId: string, slots: Omit<DoctorAvailability, 'id'>[]): Promise<void> {
        const response = await fetch(`${appConfig.backendUrl}/api/v1/doctor-availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                doctorId,
                availability: slots
            })
        });
        if (!response.ok) throw new Error('Failed to create schedule');
    },

    async updateSlot(slotId: string, data: Partial<Omit<DoctorAvailability, 'id'>>): Promise<void> {
        const response = await fetch(`${appConfig.backendUrl}/api/v1/doctor-availability/${slotId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update slot');
    },

    async deleteSlot(slotId: string): Promise<void> {
        const response = await fetch(`${appConfig.backendUrl}/api/v1/doctor-availability/${slotId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete slot');
    }
};