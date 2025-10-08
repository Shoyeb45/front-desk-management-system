"use client";
import { useState } from "react";
import { Label } from "../ui/label";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AddNewAppointmentModal } from "./AddNewAppointmentModal";
import { AppointmentList } from "./AppointmentList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AppointmentStatus } from "@/types/staffTypes";

export function AppointmentManagement() {
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<"TODAY" | "PAST">("TODAY");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [updateList, setUpdateList] = useState<number>(0);
    const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus | "">("");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                <div>
                    <h2 className="text-xl font-semibold capitalize">Manage appointment</h2>
                    <p className="text-sm text-muted-foreground">
                        Add appointment for patients with available doctors
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Add New Appointment
                </Button>

            </div>

            <AppointmentFilters
                filter={filter}
                onFilterChange={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                appointmentStatus={appointmentStatus}
                setAppointmentStatus={setAppointmentStatus}
            />

            <AddNewAppointmentModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                setUpdateList={setUpdateList}
            />

            <AppointmentList
                filter={filter}
                searchTerm={searchTerm}
                updateList={updateList}
                appointmentStatus={appointmentStatus}
            />

        </div>
    );
}


function AppointmentFilters({
    filter,
    onFilterChange,
    searchTerm,
    setSearchTerm,
    appointmentStatus,
    setAppointmentStatus
}: {
    filter: "TODAY" | "PAST";
    onFilterChange: (value: "TODAY" | "PAST") => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    appointmentStatus: AppointmentStatus | "",
    setAppointmentStatus: React.Dispatch<React.SetStateAction<AppointmentStatus | "">>
}) {
    return (
        <div className="space-y-6 container mx-auto ">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-card rounded-lg border">
                <div className="w-full sm:w-auto space-y-1.5">
                    <Label htmlFor="filter" className="text-xs font-medium">
                        Status Filter
                    </Label>
                    <Select value={appointmentStatus} onValueChange={(value) => setAppointmentStatus(value === "all" ? "" : value as AppointmentStatus)}>
                        <SelectTrigger id="filter" className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"}>No Filter</SelectItem>
                            <SelectItem value={AppointmentStatus.BOOKED}>Booked</SelectItem>
                            <SelectItem value={AppointmentStatus.CANCELLED}>Cancelled</SelectItem>
                            <SelectItem value={AppointmentStatus.CONFIRMED}>Confirmed</SelectItem>
                            <SelectItem value={AppointmentStatus.DONE}>Done</SelectItem>
                            <SelectItem value={AppointmentStatus.NO_SHOW}>No Show</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-auto space-y-1.5">
                    <Label htmlFor="filter" className="text-xs font-medium">
                        Patient List Time
                    </Label>
                    <Select value={filter} onValueChange={(value: "TODAY" | "PAST") => onFilterChange(value)}>
                        <SelectTrigger id="filter" className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All time filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"TODAY"}>Today&apos;s Appointments</SelectItem>
                            <SelectItem value={"PAST"}>Past Appointments</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 space-y-1.5">
                    <Label htmlFor="search" className="text-xs font-medium">
                        Search Patients
                    </Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}