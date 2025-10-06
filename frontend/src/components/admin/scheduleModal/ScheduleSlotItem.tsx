import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Save, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  DoctorAvailability } from '@/types/adminTypes';


interface ScheduleSlotType {
    schedule: DoctorAvailability;
    isEditing: boolean
    formData: Omit<DoctorAvailability, "id">,
    onEdit: (arg0: DoctorAvailability) => void,
    onCancelEdit: () => void,
    onUpdate: (arg0: string) => void,
    onDelete: (arg0: string) => void,
    onFormDataChange: React.Dispatch<React.SetStateAction<Omit<DoctorAvailability, "id">>>,
    loading: boolean,
}

export default function ScheduleSlotItem({
    schedule,
    isEditing,
    formData,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    onFormDataChange,
    loading,
}: ScheduleSlotType) {
    if (isEditing) {
        return (
            <div className="p-3 rounded-lg space-y-3 bg-muted/30">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs">From</Label>
                        <Input
                            type="time"
                            value={formData.availableFrom}
                            onChange={(e) => onFormDataChange({ ...formData, availableFrom: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">To</Label>
                        <Input
                            type="time"
                            value={formData.availableTo}
                            onChange={(e) => onFormDataChange({ ...formData, availableTo: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={() => onUpdate(schedule.id)}
                        disabled={loading}
                        className="flex-1"
                    >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onCancelEdit}
                        disabled={loading}
                    >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-1 rounded-lg border hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-sm">
                    {schedule.availableFrom} - {schedule.availableTo}
                </span>
            </div>
            <div className="flex gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(schedule)}
                    disabled={loading}
                >
                    <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(schedule.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}