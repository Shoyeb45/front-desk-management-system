// EmployeeList.tsx
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeItem } from "./EmployeeItem";
import { getEmployees } from "./api";
import { Employee, EmployeeListProps } from "@/types/adminTypes";

export function EmployeeList({
    role,
    searchTerm,
    specializationFilter,
    locationFilter,
    availabilityFilter,
    refreshTrigger,
}: EmployeeListProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getEmployees(role);
            setEmployees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch employees");
            console.error("Error fetching employees:", err);
        } finally {
            setIsLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees, refreshTrigger]);

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (role === "staff") {
            return matchesSearch;
        }

        const matchesSpecialization = specializationFilter
            ? employee.specialization === specializationFilter
            : true;

        const matchesLocation = locationFilter
            ? employee.location === locationFilter
            : true;

        const matchesAvailability = availabilityFilter
            ? employee.doctorAvailability?.some(
                (slot) => slot.dayOfWeek === availabilityFilter
            )
            : true;

        return matchesSearch && matchesSpecialization && matchesLocation && matchesAvailability;
    });

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="p-4 sm:p-6 text-center">
                    <p className="text-destructive text-sm sm:text-base">Error: {error}</p>
                    <button
                        onClick={fetchEmployees}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Retry
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (filteredEmployees.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-sm sm:text-base">
                        No {role}s found
                        {searchTerm || specializationFilter || locationFilter || availabilityFilter
                            ? ` matching your filters`
                            : ""}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {filteredEmployees.map((employee) => (
                <EmployeeItem
                    key={employee.id}
                    employee={employee}
                    role={role}
                    onEmployeeDeleted={fetchEmployees}
                />
            ))}
        </div>
    );
}