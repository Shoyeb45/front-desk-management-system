import React from 'react';
import ScheduleDayCard from './ScheduleDayCard';
import { DayOfWeek, DoctorAvailability } from '@/types/adminTypes';


interface ScheduleListProp {
    groupedSchedules: Record<string, DoctorAvailability[]>
    editingId: string | null,
    formData: Omit<DoctorAvailability, "id">,
    onEdit: (arg0: DoctorAvailability) => void,
    onCancelEdit: () => void,
    onUpdate: (arg0: string) => void,
    onDelete: (arg0: string) => void,
    onFormDataChange: React.Dispatch<React.SetStateAction<Omit<DoctorAvailability, "id">>>,
    loading: boolean,
}

export default function ScheduleList({
    groupedSchedules,
    editingId,
    formData,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    onFormDataChange,
    loading,
}: ScheduleListProp) {
    const hasSchedules = Object.keys(groupedSchedules).length > 0;

    if (!hasSchedules) {
        return (
            <div className="text-center py-12 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <p>No schedules added yet</p>
                <p className="text-sm">Click &quot;Add Schedule&quot; to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Object.entries(groupedSchedules).map(([day, slots]) => (
                <ScheduleDayCard
                    key={day}
                    day={day as DayOfWeek}
                    slots={slots}
                    editingId={editingId}
                    formData={formData}
                    onEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onFormDataChange={onFormDataChange}
                    loading={loading}
                />
            ))}
        </div>
    );
}