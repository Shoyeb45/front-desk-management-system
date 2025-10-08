"use client";
import { useState } from "react";
import { Label } from "../ui/label";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AddNewAppointmentModal } from "./AddNewAppointmentModal";
import { AppointmentList } from "./AppointmentList";

export function AppointmentManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<"TODAY" | "PAST">("TODAY");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [updateList, setUpdateList] = useState<number>(0);

    return (
        <div className="space-y-6">
            {/* Header with search and add button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <AppointmentFilters
                    filter={filter}
                    onFilterChange={setFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Add New Appointment
                </Button>
            </div>

            <AddNewAppointmentModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                setUpdateList={setUpdateList} // You can later call refetch here too
            />

            <AppointmentList filter={filter} searchTerm={searchTerm} updateList={updateList} />
        </div>
    );
}


function AppointmentFilters({
    filter,
    onFilterChange,
    searchTerm,
    setSearchTerm
}: {
    filter: "TODAY" | "PAST";
    onFilterChange: (value: "TODAY" | "PAST") => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex-1 space-y-1.5">
                <Label htmlFor="search" className="text-xs font-medium">
                    Search Patients
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    variant={filter === "TODAY" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("TODAY")}
                >
                    Today
                </Button>
                <Button
                    variant={filter === "PAST" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange("PAST")}
                >
                    Past
                </Button>
            </div>
        </div>
    );
}