import { useState } from "react";
import { EmployeeList } from "../admin/EmployeeList";
import { ManagementCard } from "../admin/ManagementCard";

export function DoctorManagement() {
    const [searchTerm, useSearchTerm] = useState("");
    const [updateList, setUpdateList] = useState(0);

    return (
        <div className="py-4 ">
            <ManagementCard role="doctor" />
        </div>
    );
}