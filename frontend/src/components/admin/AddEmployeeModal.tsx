import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployee } from "./api";
import { Employee } from "./types";

interface AddEmployeeModalProps {
    role: "doctor" | "staff";
    isOpen: boolean;
    onClose: () => void;
}

export function AddEmployeeModal({ role, isOpen, onClose }: AddEmployeeModalProps) {
    console.log(`Modal role ${role}`);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New {role === "doctor" ? "Doctor" : "Staff"}</DialogTitle>
                </DialogHeader>

                {role === "doctor" ? <DoctorForm onClose={onClose} /> : <StaffForm onClose={onClose} />}


            </DialogContent>
        </Dialog>
    );
}




function DoctorForm({ onClose }: {
    onClose: () => void
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        gender: "MALE" as "MALE" | "FEMALE", // Update type to be more specific
        specialization: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newEmployee: Employee = await createEmployee("doctor", formData);
            console.log("Employee created:", newEmployee);
            onClose();
            setFormData({ 
                name: "", 
                email: "", 
                location: "", 
                specialization: "", 
                gender: "MALE", 
                phone: "" 
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create doctor");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGenderChange = (value: "MALE" | "FEMALE") => {
        setFormData({
            ...formData,
            gender: value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter location"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    placeholder="Enter specialization"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </DialogFooter>
        </form>
    );
}


function StaffForm({ onClose }: {
    onClose: () => void
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STAFF"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newEmployee: Employee = await createEmployee("staff", formData);
            console.log("Employee created:", newEmployee);
            onClose();
            setFormData({ name: "", email: "", password: "", role: "STAFF" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create employee");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                />
            </div>

            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </DialogFooter>
        </form>
    )
}