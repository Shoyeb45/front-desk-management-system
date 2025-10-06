import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ScheduleSlotItem from './ScheduleSlotItem';
import { getDayColor } from '@/lib/utils';
import { DayOfWeek, DoctorAvailability } from '@/types/adminTypes';


interface ScheduleDayCardProps {
    day: DayOfWeek,
    slots: DoctorAvailability[],
    editingId: string | null,
    formData: Omit<DoctorAvailability, "id">,
    onEdit: (arg0: DoctorAvailability) => void,
    onCancelEdit: () => void,
    onUpdate: (arg0: string) => void,
    onDelete: (arg0: string) => void,
    onFormDataChange: React.Dispatch<React.SetStateAction<Omit<DoctorAvailability, "id">>>,
    loading: boolean,
}
export default function ScheduleDayCard({
    day,
    slots,
    editingId,
    formData,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
    onFormDataChange,
    loading,
}: ScheduleDayCardProps) {
    return (
        <Card className="border-l-4 border-l-blue-500 mr-2">
            <CardContent className="pt-1">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDayColor(day)}`}>
                        {day}
                    </span>
                    <span className="text-sm text-gray-500">
                        {slots.length} slot{slots.length > 1 ? 's' : ''}
                    </span>
                </div>
                <div className="space-y-2">
                    {slots.map((schedule: DoctorAvailability) => (
                        <ScheduleSlotItem
                            key={schedule.id}
                            schedule={schedule}
                            isEditing={editingId === schedule.id}
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
            </CardContent>
        </Card>
    );
}