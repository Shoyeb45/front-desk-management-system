"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { Patient, AppointmentCreate, AppointmentStatus } from "@/types/staffTypes";
import { Label } from "../ui/label";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Employee, Gender } from "@/types/adminTypes";
import { getCurrentTime } from "@/lib/utils";
import { getFormattedDoctorName } from "@/lib/utils";
import { createAppointment, getAvailableDoctors, getPatientData } from "./api";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

export function AddNewAppointmentModal({
    open,
    onOpenChange,
    setUpdateList
}: {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdateList: React.Dispatch<React.SetStateAction<number>>;
}) {

    const [patientData, setPatientData] = useState<Patient>({
        name: "",
        age: 0,
        email: "",
        address: "",
        phone: "",
        gender: Gender.MALE,
        isNewPatientNeeded: false
    });
    const [time, setTime] = useState<string>(getCurrentTime());

    const [appointmentData, setAppointmentData] = useState<Omit<AppointmentCreate, "patient">>({
        appointmentDate: getCurrentTime(),
        status: AppointmentStatus.BOOKED,
        doctorId: "",
    });

    const [doctors, setDoctors] = useState<Employee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
    const [existingPatientFound, setExistingPatientFound] = useState<boolean>(false);
    const [isPatientDataEditing, setIsPatientDataEditing] = useState<boolean>(false);

    const fetchAvailableDoctors = useCallback(async (time: string) => {
        const data = await getAvailableDoctors(time);
        setDoctors(data);
    }, []);

    useEffect(() => {
        fetchAvailableDoctors(time);
    }, [time, fetchAvailableDoctors]);

    useEffect(() => {
        if (open) {
            setTime(getCurrentTime());
            fetchAvailableDoctors(time);
            // Reset form when modal opens
            setPatientData({
                name: "",
                age: 0,
                email: "",
                address: "",
                phone: "",
                gender: Gender.MALE,
                isNewPatientNeeded: false
            });
            setAppointmentData({
                appointmentDate: getCurrentTime(),
                status: AppointmentStatus.BOOKED,
                doctorId: ""
            });
            setError(null);
            setExistingPatientFound(false);
            setIsPatientDataEditing(false);
        }
    }, [open]);

    // Debounced email lookup
    const checkPatientByEmail = useCallback(async (email: string) => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setExistingPatientFound(false);
            return;
        }

        setIsCheckingEmail(true);
        setError(null);
        try {
            const data = await getPatientData(email);
            if (data) {
                setPatientData(prev => ({
                    ...data,
                    email, // Ensure email is preserved
                    isNewPatientNeeded: prev.isNewPatientNeeded // Preserve switch state
                }));
                setExistingPatientFound(true);
            } else {
                setExistingPatientFound(false);
            }
        } catch (err) {
            console.error("Failed to fetch patient:", err);
            setError("Failed to check patient email.");
            setExistingPatientFound(false);
        } finally {
            setIsCheckingEmail(false);
        }
    }, []);

    // Handle email change IMMEDIATELY (reset fields)
    const handleEmailChange = (email: string) => {
        setPatientData(prev => ({
            ...prev,
            email,
            // Reset other fields immediately when email changes
            name: "",
            age: 0,
            address: "",
            phone: "",
            gender: Gender.MALE
        }));
        setExistingPatientFound(false);
        setIsPatientDataEditing(false);
    };

    // Debounce the API call
    useEffect(() => {
        const timer = setTimeout(() => {
            if (patientData.email) {
                checkPatientByEmail(patientData.email);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [patientData.email, checkPatientByEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        setError(null);


        try {
            const data = {
                patient: patientData,
                ...appointmentData
            };
            console.table(data);
            await createAppointment(data);
            toast.success("Patient added to the queue.");
            setUpdateList(prev => prev + 1);
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add patient to queue.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add Patient to Queue
                    </DialogTitle>
                    <DialogDescription>
                        Enter patient email to check if they exist, or fill in details to register a new patient.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={patientData.email}
                                onChange={e => handleEmailChange(e.target.value)} // ✅ Reset on change
                                placeholder="Enter patient email"
                                required
                                className={existingPatientFound ? "border-green-500 bg-green-50" : ""}
                            />
                            {isCheckingEmail && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                    Checking...
                                </div>
                            )}
                            {existingPatientFound && !isCheckingEmail && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-green-600 font-medium">
                                    Existing patient
                                </div>
                            )}
                        </div>
                        {existingPatientFound && (
                            <p className="text-sm text-green-600">Patient found! Details auto-filled below.</p>
                        )}
                    </div>

                    {/* Patient Info Section */}
                    <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                                Patient Information
                            </h3>
                            {existingPatientFound && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsPatientDataEditing(!isPatientDataEditing)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={patientData.name}
                                    onChange={e => setPatientData({ ...patientData, name: e.target.value })}
                                    required
                                    placeholder="e.g. John Doe"
                                    disabled={existingPatientFound && !isPatientDataEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    min="0"
                                    max="150"
                                    value={patientData.age || ""}
                                    onChange={e => setPatientData({ ...patientData, age: Number(e.target.value) })}
                                    required
                                    placeholder="e.g. 30"
                                    disabled={existingPatientFound && !isPatientDataEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <Select
                                    value={patientData.gender}
                                    onValueChange={(value: Gender) => setPatientData({ ...patientData, gender: value })}
                                    disabled={existingPatientFound && !isPatientDataEditing}
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={patientData.phone}
                                    onChange={e => setPatientData({ ...patientData, phone: e.target.value })}
                                    placeholder="e.g. +1 234 567 890"
                                    disabled={existingPatientFound && !isPatientDataEditing}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={patientData.address}
                                    onChange={e => setPatientData({ ...patientData, address: e.target.value })}
                                    placeholder="e.g. 123 Main St, City"
                                    disabled={existingPatientFound && !isPatientDataEditing}
                                />
                            </div>

                            {existingPatientFound && (
                                <div className="md:col-span-2 flex items-center space-x-2">
                                    <Switch
                                        id="isNewPatient"
                                        checked={patientData.isNewPatientNeeded}
                                        onCheckedChange={(checked) =>
                                            setPatientData({ ...patientData, isNewPatientNeeded: checked })
                                        }
                                    />
                                    <Label htmlFor="isNewPatient">Create new patient record?</Label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Info Section */}
                    <div className="border rounded-lg p-4 bg-muted/20">
                        <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                            Fill Appointment Data
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="arrivalTime">Appointment Time *</Label>
                                <Input
                                    id="arrivalTime"
                                    name="arrivalTime"
                                    type="time"
                                    value={appointmentData.appointmentDate}
                                    onChange={e => {
                                        setAppointmentData({ ...appointmentData, appointmentDate: e.target.value });
                                        setTime(e.target.value);
                                    }}
                                    required
                                />
                            </div>

                            {/* <div className="space-y-2">
                                <Label htmlFor="queueType">Queue Type *</Label>
                                <Select
                                    value={queueData.queueType}
                                    onValueChange={(value: QueueType) => setQueueData({ ...queueData, queueType: value })}
                                >
                                    <SelectTrigger id="queueType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={QueueType.NORMAL}>Normal</SelectItem>
                                        <SelectItem value={QueueType.EMERGENCY} className="text-destructive">
                                            Emergency
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="doctor">Assign Doctor *</Label>
                                <Select
                                    value={appointmentData.doctorId || ""}
                                    onValueChange={value => setAppointmentData({ ...appointmentData, doctorId: value })}
                                >
                                    <SelectTrigger id="doctor">
                                        <SelectValue placeholder="Select a doctor" />
                                    </SelectTrigger>
                                    {doctors.length > 0 &&
                                        <SelectContent>
                                            {doctors.map(doctor => (
                                                <SelectItem key={doctor.id} value={doctor.id}>
                                                    {getFormattedDoctorName(doctor.name)} ({doctor.specialization})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>}
                                    {doctors.length == 0 && <SelectContent>
                                        <SelectItem value="nil">No Doctors Present</SelectItem>
                                    </SelectContent>}
                                </Select>
                            </div>
                        </div>
                    </div>

                    {error && <div className="text-sm text-destructive">{error}</div>}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isAdding || isCheckingEmail}>
                            {isAdding ? "Adding..." : "Add to Queue"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}