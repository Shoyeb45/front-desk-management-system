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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {  EmployeeItemProps } from "./types";
import { deleteEmployee } from "./api";
import { toast } from "sonner";



export function EmployeeItem({ employee, role, id, onEmployeeDeleted }: EmployeeItemProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEmployee(role, id);
            // Optionally: trigger a refetch or show success toast here
            toast.success(`Successfully deleted ${role}.`);
            setIsDeleteDialogOpen(false);
            onEmployeeDeleted?.();
        } catch (error) {
            console.error("Failed to delete employee:", error);
            toast.error(`Failed to delete ${role}`)
        } finally {
            setIsDeleting(false);
        }
    };

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
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete the{" "}
                                {role === "doctor" ? "doctor" : "staff member"}{" "}
                                <strong>{employee.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit modal */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                Edit {(role === "doctor" ? " doctor ": " staff member ") + employee.name} 
                            </DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}