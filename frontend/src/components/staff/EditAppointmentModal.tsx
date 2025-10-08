// components/appointments/EditAppointmentModal.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus, TAppointment } from "@/types/staffTypes";
import { updateAppointment, getAvailableDoctors } from "./api";
import { useEffect, useState } from "react";
import { toLocalDateTimeString } from "@/lib/utils";
import { toast } from "sonner";

interface EditAppointmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: TAppointment | null;
    onSuccess: () => void;
}

export function EditAppointmentModal({
    open,
    onOpenChange,
    appointment,
    onSuccess,
}: EditAppointmentModalProps) {
    const [formData, setFormData] = useState({
        appointmentDate: new Date(),
        status: "" as AppointmentStatus,
        doctorId: "",
    });
    const [availableDoctors, setAvailableDoctors] = useState<
        { id: string; name: string; specialization?: string }[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form when appointment changes
    useEffect(() => {
        if (appointment) {
            setFormData({
                appointmentDate: appointment.appointmentDate,
                status: appointment.status,
                doctorId: appointment.doctor.id,
            });

            // Load available doctors for this time
            loadAvailableDoctors(new Date().toISOString());
        }
    }, [appointment]);

    const loadAvailableDoctors = async (timeString: string) => {
        try {
            setError(null);

            const x = timeString.split("T")[1];
            const time = `${x.split(':')[0]}:${x.split(":")[1]}`;
            const doctors = await getAvailableDoctors(time);
            setAvailableDoctors(doctors);
        } catch (err) {
            console.error("Failed to load available doctors:", err);
            setError("Could not load available doctors for this time.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment) return;

        setLoading(true);
        setError(null);
        try {
            await updateAppointment(appointment.id, {
                appointmentDate: formData.appointmentDate,
                status: formData.status,
                doctorId: formData.doctorId,
            });
            onSuccess();
            toast.success("Updated appointment.");
            onOpenChange(false);
        } catch (err) {
            console.error("Failed to update appointment:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update appointment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!appointment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-sm text-destructive">{error}</p>}

                    {/* Time */}
                    <div className="space-y-2">
                        <Label htmlFor="appointmentDate">Appointment Time</Label>
                        <Input
                            id="appointmentDate"
                            type="datetime-local"
                            value={toLocalDateTimeString(formData.appointmentDate)}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    // Optionally: set to null or ignore
                                    // But since your state expects Date, better to use a fallback
                                    setFormData({ ...formData, appointmentDate: new Date() });
                                } else {
                                    setFormData({ ...formData, appointmentDate: new Date(value) });
                                }
                            }}
                            onBlur={(e) => loadAvailableDoctors(e.target.value)}
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({ ...formData, status: value as AppointmentStatus })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>

                                <SelectItem value={AppointmentStatus.BOOKED}>Booked</SelectItem>
                                <SelectItem value={AppointmentStatus.CANCELLED}>Cancelled</SelectItem>
                                <SelectItem value={AppointmentStatus.CONFIRMED}>Confirmed</SelectItem>
                                <SelectItem value={AppointmentStatus.DONE}>Done</SelectItem>
                                <SelectItem value={AppointmentStatus.NO_SHOW}>No Show</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Doctor */}
                    <div className="space-y-2">
                        <Label>Doctor</Label>
                        <Select
                            value={formData.doctorId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, doctorId: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDoctors.length > 0 ? (
                                    availableDoctors.map((doc) => (
                                        <SelectItem key={doc.id} value={doc.id}>
                                            {doc.name}
                                            {doc.specialization && ` - ${doc.specialization}`}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="nil" disabled>
                                        No doctors available at this time
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}