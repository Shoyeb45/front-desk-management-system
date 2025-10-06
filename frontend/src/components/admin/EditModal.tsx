import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Employee, Gender } from "@/types/adminTypes";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { editEmployee, fetchUserDetail } from "./api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

export function EditModal({
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

                <DialogFooter className="flex gap-2 sm:gap-2">
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