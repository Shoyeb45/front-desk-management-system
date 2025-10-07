export enum Gender {
    MALE = "MALE", FEMALE = "FEMALE"
}

export interface Employee {
    id: string;
    email: string;
    name: string;
    gender: Gender;
    phone?: string;
    location?: string;
    specialization?: string,
    role?: "ADMIN" | "STAFF";
}

export interface EmployeeItemProps {
    employee: Employee;
    role: "doctor" | "staff";
    id?: string;
    onEmployeeDeleted?: () => void;
}

export interface AddEmployeeModalProps {
    role: "doctor" | "staff";
    isOpen: boolean;
    onClose: () => void;
    onEmployeeAdded?: () => void;
}


export interface EmployeeListProps {
    role: "doctor" | "staff";
    searchTerm: string;
    refreshTrigger: number;
}

export interface EditData {
    name: string,
    email: string
}

export enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}

export interface DoctorAvailability {
    id: string;
    dayOfWeek: DayOfWeek;
    availableFrom: string;
    availableTo: string;
}

export interface DecodedUser {
    id: string;
    role: "ADMIN" | "STAFF"
}