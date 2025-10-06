import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { DayOfWeek, DoctorAvailability } from "@/types/adminTypes";


interface AddScheduleFormProps {
    formData: Omit<DoctorAvailability, "id">,
    onFormDataChange: React.Dispatch<React.SetStateAction<Omit<DoctorAvailability, "id">>>,
    onAdd: () => Promise<void>,
    onCancel: () => void,
    loading: boolean,
}

export default function AddScheduleForm({
    formData,
    onFormDataChange,
    onAdd,
    onCancel,
    loading,
}: AddScheduleFormProps) {
    return (
        <Card className="border-2">
            <CardContent className="pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Schedule
                </h3>
                <div className="space-y-3">
                    <div>
                        <Label>Day of Week</Label>
                        <Select
                            value={formData.dayOfWeek}
                            onValueChange={(value) => onFormDataChange({ ...formData, dayOfWeek: value as DayOfWeek })}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {Object.values(DayOfWeek).map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>

                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Available From</Label>
                            <Input
                                type="time"
                                value={formData.availableFrom}
                                onChange={(e) => onFormDataChange({ ...formData, availableFrom: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Available To</Label>
                            <Input
                                type="time"
                                value={formData.availableTo}
                                onChange={(e) => onFormDataChange({ ...formData, availableTo: e.target.value })}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button onClick={onAdd} disabled={loading} className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Schedule
                        </Button>
                        <Button variant="outline" onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}