import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EmployeeItemProps } from "@/types/adminTypes";
import { EditModal } from "./EditModal";
import { UserDeleteModal } from "./UserDeleteModal";
import { getInitials } from "@/lib/utils";
import ScheduleModal from "./scheduleModal/index";

export function EmployeeItem({ employee, role, onEmployeeDeleted }: EmployeeItemProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/${encodeURIComponent(employee.email)}`}
                                alt={employee.name}
                            />
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">{employee.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                <p className="text-xs sm:text-sm text-muted-foreground break-all">
                                    {employee.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                        <Badge
                            variant={role === "doctor" ? "default" : "secondary"}
                            className="py-1 text-xs sm:text-sm whitespace-nowrap"
                        >
                            {role === "doctor" ? employee?.specialization ?? "Doctor" : "Staff"}
                        </Badge>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setIsEditDialogOpen(true);
                                    }}
                                >
                                    Edit {role === "doctor" ? "Doctor" : "Staff"}
                                </DropdownMenuItem>

                                {role === "doctor" && (
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setIsScheduleModalOpen(true);
                                        }}
                                    >
                                        View Schedule
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    Remove {role === "doctor" ? "Doctor" : "Staff"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <UserDeleteModal
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    role={role}
                    employee={employee}
                    onEmployeeDeleted={onEmployeeDeleted}
                />

                <EditModal
                    role={role}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    employee={employee}
                    onEmployeeEdited={onEmployeeDeleted}
                />

                {role === "doctor" && (
                    <ScheduleModal
                        isOpen={isScheduleModalOpen}
                        onOpenChange={setIsScheduleModalOpen}
                        doctor={employee}
                    />
                )}
            </CardContent>
        </Card>
    );
}