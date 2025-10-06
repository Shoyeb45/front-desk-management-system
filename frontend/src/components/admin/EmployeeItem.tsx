import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Mail, Pencil } from "lucide-react";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Employee, EmployeeItemProps, Gender } from "./types";
import { deleteEmployee, editEmployee, fetchUserDetail } from "./api";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";



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
                <EditModal
                    role={role}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    employee={employee}
                    onEmployeeEdited={onEmployeeDeleted}
                />

            </CardContent>
        </Card>
    );
}


function EditModal({
    open,
    onOpenChange,
    employee,
    role,
    onEmployeeEdited,
}: {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    employee: Employee;
    role: "doctor" | "staff";
    onEmployeeEdited?: () => void;
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<Omit<Employee, "id">>({
        name: "Loading...",
        email: "Loading...",
        location: "Loading...",
        specialization: "Loading...",
        phone: "Loading...",
        gender: Gender.FEMALE,
    });

    // ✅ Only fetch when modal opens AND employee ID is valid
    useEffect(() => {
        if (open && employee.id) {
            setIsEditing(false); // reset edit mode on open
            fetchUserDetail(role, employee.id)
                .then((data) => {
                    if (data) {
                        setFormData({
                            name: data.name,
                            email: data.email,
                            gender: data.gender,
                            phone: data?.phone ?? "",
                            location: data?.location ?? "",
                            specialization: data?.specialization ?? "",
                            doctorAvailability: data?.doctorAvailability,
                        });
                    }
                })
                .catch((err) => {
                    console.error("Failed to load user details", err);
                    toast.error("Failed to load user data");
                });
        }
    }, [open, role, employee.id]); // ✅ depend on `open`

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!isEditing) return;
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleGenderChange = (value: Gender) => {
        if (!isEditing) return;
        setFormData((prev) => ({ ...prev, gender: value }));
    };

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const data = await editEmployee(role, employee.id, formData);
            toast.success(`Successfully edited ${data?.name}.`);
            onEmployeeEdited?.();
            onOpenChange(false); // close modal after success
        } catch (error) {
            console.error("Failed to edit employee:", error);
            toast.error(`Failed to edit ${role}`);
        }
    }

    const handleCancel = () => {
        onOpenChange(false);
        setIsEditing(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md sm:max-w-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit {role === "doctor" ? "Doctor" : "Staff"}: {employee.name}
                    </DialogTitle>
                    <DialogDescription>
                        Update the details below and click submit to save changes.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="col-span-3"
                        />
                    </div>

                    {/* Email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="col-span-3"
                        />
                    </div>

                    {/* Doctor-specific fields */}
                    {role === "doctor" && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="col-span-3"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="specialization" className="text-right">
                                    Specialization
                                </Label>
                                <Input
                                    id="specialization"
                                    name="specialization"
                                    value={formData.specialization || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="col-span-3"
                                />
                            </div>
                        </>
                    )}

                    {/* Gender */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                            Gender
                        </Label>
                        <Select
                            value={formData.gender}
                            disabled={!isEditing}
                            onValueChange={handleGenderChange}
                        >
                            <SelectTrigger id="gender" className="col-span-3">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Gender.MALE}>Male</SelectItem>
                                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isEditing}
                    >
                        Cancel
                    </Button>
                    {!isEditing ? (
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}