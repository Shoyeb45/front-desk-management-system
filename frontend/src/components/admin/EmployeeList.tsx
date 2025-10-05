import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeItem } from "./EmployeeItem";
import { getEmployees } from "./api";
import { Employee, EmployeeListProps } from "./types";



export function EmployeeList({ role, searchTerm, refreshTrigger }: EmployeeListProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, [role, refreshTrigger]);

    const fetchEmployees = async () => {
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
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="p-6 text-center">
                    <p className="text-destructive">Error: {error}</p>
                    <button 
                        onClick={fetchEmployees}
                        className="mt-2 text-blue-600 hover:underline"
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
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
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
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                        No {role}s found{searchTerm ? ` for "${searchTerm}"` : ""}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {filteredEmployees.map((employee) => (
                <EmployeeItem key={employee.id} employee={employee} role={role} id={employee.id} onEmployeeDeleted={fetchEmployees}/>
            ))}
        </div>
    );
}