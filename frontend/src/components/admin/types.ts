export enum Gender {
    MALE = "MALE",  FEMALE = "FEMALE"
}

export interface Employee {
    id: string;
    email: string;
    name: string;
    gender: Gender;
    phone?: string;
    location?: string;
    specialization?: string,
    doctorAvailability?: DoctorAvailability 
}

export interface EmployeeItemProps {
    employee: Employee;
    role: "doctor" | "staff";
    id: string;
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

export interface EditData  {
    name: string,
    email: string
}

export enum DayOfWeek {
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
}

export interface DoctorAvailability {
    dayOfWeek: DayOfWeek;
    availableFrom: Date,
    availableTod: Date,
}