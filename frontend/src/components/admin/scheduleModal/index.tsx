import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { DayOfWeek, DoctorAvailability, Employee } from "@/types/adminTypes";
import { scheduleApi } from '../api';
import ScheduleList from './ScheduleList';
import AddScheduleForm from './AddScheduleForm';
import LoadingState from './LoadingState';

interface ScheduleModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    doctor: Employee;
}

const validateTimeRange = (from: string, to: string): boolean => {
    const [fromHour, fromMin] = from.split(':').map(Number);
    const [toHour, toMin] = to.split(':').map(Number);
    return toHour * 60 + toMin > fromHour * 60 + fromMin;
};

export default function ScheduleModal({ isOpen, onOpenChange, doctor }: ScheduleModalProps) {
    const [schedules, setSchedules] = useState<DoctorAvailability[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Omit<DoctorAvailability, "id">>({
        dayOfWeek: "MONDAY" as DayOfWeek,
        availableFrom: "09:00",
        availableTo: "17:00",
    });

    useEffect(() => {
        if (isOpen) loadSchedules();
    }, [isOpen, doctor.id]);

    const loadSchedules = useCallback(async () => {
        setLoading(true);
        try {
            const data = await scheduleApi.getSchedule(doctor.id);
            setSchedules(data);
        } catch (error) {
            toast.error("Failed to load schedules");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [doctor.id]);

    const handleAddSlot = async () => {
        if (!validateTimeRange(formData.availableFrom, formData.availableTo)) {
            toast.error("End time must be after start time");
            return;
        }

        setLoading(true);
        try {
            await scheduleApi.createSchedule(doctor.id, [formData]);
            toast.success("Schedule added successfully");
            await loadSchedules();
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            toast.error("Failed to add schedule");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSlot = async (slotId: string) => {
        if (!validateTimeRange(formData.availableFrom, formData.availableTo)) {
            toast.error("End time must be after start time");
            return;
        }

        setLoading(true);
        try {
            await scheduleApi.updateSlot(slotId, formData);
            toast.success("Schedule updated successfully");
            await loadSchedules();
            setEditingId(null);
            resetForm();
        } catch (error) {
            toast.error("Failed to update schedule");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return;

        setLoading(true);
        try {
            await scheduleApi.deleteSlot(slotId);
            toast.success("Schedule deleted successfully");
            await loadSchedules();
        } catch (error) {
            toast.error("Failed to delete schedule");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (schedule: DoctorAvailability) => {
        setEditingId(schedule.id);
        setFormData({
            dayOfWeek: schedule.dayOfWeek,
            availableFrom: schedule.availableFrom,
            availableTo: schedule.availableTo,
        });
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            dayOfWeek: DayOfWeek.MONDAY,
            availableFrom: "09:00",
            availableTo: "17:00",
        });
    };

    const groupedSchedules = schedules.reduce((acc, schedule) => {
        if (!acc[schedule.dayOfWeek]) acc[schedule.dayOfWeek] = [];
        acc[schedule.dayOfWeek].push(schedule);
        return acc;
    }, {} as Record<string, DoctorAvailability[]>);

    console.log(groupedSchedules);
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule for Dr. {doctor.name}
                    </DialogTitle>
                    <DialogDescription>
                        {doctor.specialization && (
                            <span className="text-sm">{doctor.specialization} • </span>
                        )}
                        Manage weekly availability schedule
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 py-4">
                    {loading && schedules.length === 0 ? (
                        <LoadingState />
                    ) : (
                        <>
                            <ScheduleList
                                groupedSchedules={groupedSchedules}
                                editingId={editingId}
                                formData={formData}
                                onEdit={startEdit}
                                onCancelEdit={cancelEdit}
                                onUpdate={handleUpdateSlot}
                                onDelete={handleDeleteSlot}
                                onFormDataChange={setFormData}
                                loading={loading}
                            />

                            {showAddForm && (
                                <AddScheduleForm
                                    formData={formData}
                                    onFormDataChange={setFormData}
                                    onAdd={handleAddSlot}
                                    onCancel={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                    loading={loading}
                                />
                            )}
                        </>
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        disabled={loading || editingId !== null}
                        variant={showAddForm ? "outline" : "default"}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {showAddForm ? "Cancel Adding" : "Add Schedule"}
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}