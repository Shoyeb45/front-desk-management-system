import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { EmployeeList } from "./EmployeeList";
import { AddEmployeeModal } from "./AddEmployeeModal";

interface ManagementCardProps {
    role: "doctor" | "staff";
}

export function ManagementCard({ role }: ManagementCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // This variable to propogate the changes like adding the new employee to the child components
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleEmployeeAdded = () => {
        // Increment to trigger refresh
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold capitalize">{role}s Management</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage all {role} accounts and information
                    </p>
                </div>
                <Button onClick={handleAddEmployee} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New {role === "doctor" ? "Doctor" : "Staff"}
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${role}s by name...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <EmployeeList
                role={role}
                searchTerm={searchTerm}
                refreshTrigger={refreshTrigger}
            />

            <AddEmployeeModal
                role={role}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onEmployeeAdded={handleEmployeeAdded}
            />
        </div>
    );
}