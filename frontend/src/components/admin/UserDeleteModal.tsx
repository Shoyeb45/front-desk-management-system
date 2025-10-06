import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteEmployee } from "./api";
import { toast } from "sonner";
import { Employee } from "./types";


export function UserDeleteModal({ isDeleteDialogOpen, setIsDeleteDialogOpen, role, employee, onEmployeeDeleted}: {
    isDeleteDialogOpen: boolean, 
    setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    role: "doctor" | "staff", 
    employee: Employee, 
    onEmployeeDeleted?: () => void
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEmployee(role, employee.id);
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

    )
}