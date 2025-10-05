export interface Employee {
    id: string;
    email: string;
    name: string;
    // Add other fields as needed
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