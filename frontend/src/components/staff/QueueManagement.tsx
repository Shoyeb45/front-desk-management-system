"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { CurrentStatusType } from "@/types/staffTypes";
import { Label } from "../ui/label";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { AddNewPatient } from "./AddNewPatient";

export function QueueManagement() {
    return <Queue />;
}

export function Queue() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filter, setFilter] = useState<CurrentStatusType>();

    return (
        <div className="space-y-6">
            <AddNewPatient />

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-card rounded-lg border">
                <div className="w-full sm:w-auto space-y-1.5">
                    <Label htmlFor="filter" className="text-xs font-medium">
                        Status Filter
                    </Label>
                    <Select value={filter} onValueChange={(value) => setFilter(value as CurrentStatusType)}>
                        <SelectTrigger id="filter" className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={CurrentStatusType.WAITING}>Waiting</SelectItem>
                            <SelectItem value={CurrentStatusType.WITH_DOCTOR}>With Doctor</SelectItem>
                            <SelectItem value={CurrentStatusType.DONE}>Done</SelectItem>
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
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Patient List (placeholder) */}
            <PatientList />
        </div>
    );
}

// Keep your existing PatientList component
export function PatientList() {
    return <div className="min-h-[400px]"> {/* Your list goes here */}</div>;
}