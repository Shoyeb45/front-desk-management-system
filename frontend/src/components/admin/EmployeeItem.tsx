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
import ScheduleModal  from "./scheduleModal/index";


export function EmployeeItem({ employee, role, onEmployeeDeleted }: EmployeeItemProps) {
    // state variable for tracking delete modal
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // state variable for tracking edit modal
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // schedule modal for doctor
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/${employee.email}`}
                                alt={employee.name}
                            />
                            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{employee.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{employee.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge
                            variant={role === "doctor" ? "default" : "secondary"}
                            className="py-1"
                        >
                            {role === "doctor" ? "Doctor" : "Staff"}
                        </Badge>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setIsEditDialogOpen(true);
                                }}>
                                    Edit {role === "doctor" ? "Doctor" : "Staff"}
                                </DropdownMenuItem>

                                {/* Doctor specific menu */}
                                {role === "doctor" && <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setIsScheduleModalOpen(true);
                                }}>
                                    View Schedule
                                </DropdownMenuItem>}

                                <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => {
                                        e.preventDefault(); // Prevent dropdown from closing immediately
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    Remove {role === "doctor" ? "Doctor" : "Staff"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Delete modal */}
                <UserDeleteModal
                    isDeleteDialogOpen={isDeleteDialogOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    role={role}
                    employee={employee}
                    onEmployeeDeleted={onEmployeeDeleted}
                />

                {/* Edit modal */}
                <EditModal
                    role={role}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    employee={employee}
                    onEmployeeEdited={onEmployeeDeleted}
                />

                {/* Schedule modal for doctor */}
                {role === "doctor" && 
                    <ScheduleModal 
                        isOpen={isScheduleModalOpen}
                        onOpenChange={setIsScheduleModalOpen}
                        doctor={employee}
                    />
                }

            </CardContent>
        </Card>
    );
}