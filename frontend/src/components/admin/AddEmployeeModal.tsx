import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployee } from "./api";
import { AddEmployeeModalProps, Employee, Gender } from "./types";
import { toast } from "sonner";



export function AddEmployeeModal({ role, isOpen, onClose, onEmployeeAdded }: AddEmployeeModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New {role === "doctor" ? "Doctor" : "Staff"}</DialogTitle>
                </DialogHeader>

                {role === "doctor" ?
                    <DoctorForm onClose={onClose} onEmployeeAdded={onEmployeeAdded} /> : <StaffForm onClose={onClose} onEmployeeAdded={onEmployeeAdded} />}


            </DialogContent>
        </Dialog>
    );
}




function DoctorForm({ onClose, onEmployeeAdded }: {
    onClose: () => void,
    onEmployeeAdded?: () => void
}) {
    const [formData, setFormData] = useState<Omit<Employee, "id">>({
        name: "",
        email: "",
        phone: "",
        location: "",
        gender: Gender.MALE,
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
            toast.success(`Successfully created doctor named ${newEmployee.name}.`);
            onClose();
            setFormData({
                name: "",
                email: "",
                location: "",
                specialization: "",
                gender: Gender.MALE,
                phone: ""
            });
            onEmployeeAdded?.();
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
            gender: value === "MALE" ? Gender.MALE : Gender.FEMALE
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
                <Select value={formData.gender === Gender.FEMALE ? "FEMALE" : "MALE"} onValueChange={handleGenderChange}>
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


function StaffForm({ onClose, onEmployeeAdded }: {
    onClose: () => void,
    onEmployeeAdded?: () => void
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: Gender.MALE
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenderChange = (value: "MALE" | "FEMALE") => {
        setFormData({
            ...formData,
            gender: value === "MALE" ? Gender.MALE : Gender.FEMALE
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newEmployee: Employee = await createEmployee("staff", formData);
            console.log("Employee created:", newEmployee);
            toast.success(`Successfully created staff named ${newEmployee.name}`);
            onClose();
            onEmployeeAdded?.();
            setFormData({ name: "", email: "", password: "", gender: Gender.MALE });
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

            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender === Gender.FEMALE ? "FEMALE" : "MALE"} onValueChange={handleGenderChange}>
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
    )
}