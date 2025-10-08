import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { EmployeeList } from "./EmployeeList";
import { AddEmployeeModal } from "./AddEmployeeModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { alloHealthClinicLocation, doctorSpecializations } from "@/lib/constants";
import { DayOfWeek } from "@/types/adminTypes";

interface ManagementCardProps {
    role: "doctor" | "staff";
}

export function ManagementCard({ role }: ManagementCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [specializationFilter, setSpecializationFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddEmployee = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);
    const handleEmployeeAdded = () => setRefreshTrigger((prev) => prev + 1);

    const handleClearFilters = () => {
        setSpecializationFilter("");
        setLocationFilter("");
        setAvailabilityFilter("");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold capitalize">{role}s Management</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage all {role} accounts and information
                    </p>
                </div>
                <Button onClick={handleAddEmployee} className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm sm:text-base">
                    <Plus className="h-4 w-4" />
                    Add New {role === "doctor" ? "Doctor" : "Staff"}
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={`Search ${role}s by name or email...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-2 text-sm"
                />
            </div>

            {/* Doctor Filters */}
            {role === "doctor" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border">
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Specialization</label>
                        <Select
                            value={specializationFilter}
                            onValueChange={(val) => {
                                setSpecializationFilter(val === "nil" ? "" : val);
                            }}
                        >
                            <SelectTrigger className="text-xs sm:text-sm">
                                <SelectValue placeholder="All Specializations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nil">All Specializations</SelectItem>
                                {doctorSpecializations.map((spec, idx) => (
                                    <SelectItem key={idx} value={spec.name} title={spec.description}>
                                        {spec.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Location</label>
                        <Select
                            value={locationFilter}
                            onValueChange={(val) => {
                                setLocationFilter(val === "nil" ? "" : val);
                            }}
                        >
                            <SelectTrigger className="text-xs sm:text-sm">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nil">All Locations</SelectItem>
                                {alloHealthClinicLocation.map((loc) => (
                                    <SelectItem key={loc} value={loc}>
                                        {loc}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Available On</label>
                        <Select
                            value={availabilityFilter}
                            onValueChange={(val) => {
                                setAvailabilityFilter(val === "nil" ? "" : val);
                            }}
                        >
                            <SelectTrigger className="text-xs sm:text-sm">
                                <SelectValue placeholder="Any Day" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(DayOfWeek).map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-1.5 h-9"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Clear Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Employee List */}
            <EmployeeList
                role={role}
                searchTerm={searchTerm}
                specializationFilter={specializationFilter}
                locationFilter={locationFilter}
                availabilityFilter={availabilityFilter}
                refreshTrigger={refreshTrigger}
            />

            {/* Modal */}
            <AddEmployeeModal
                role={role}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onEmployeeAdded={handleEmployeeAdded}
            />
        </div>
    );
}