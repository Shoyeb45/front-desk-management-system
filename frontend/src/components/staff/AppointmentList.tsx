"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { AddNewAppointmentModal } from "./AddNewAppointmentModal";
import { TAppointment } from "@/types/staffTypes";
import { getAppointments } from "./api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteAppointment } from "./api";
import { EditAppointmentModal } from "./EditAppointmentModal";
import { toast } from "sonner";


export function AppointmentList({ filter, searchTerm, updateList }: { filter: "TODAY" | "PAST", searchTerm: string, updateList: number }) {
    const [appointments, setAppointments] = useState<TAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editAppointment, setEditAppointment] = useState<TAppointment | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appt) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                appt.patient.name.toLowerCase().includes(searchLower) ||
                appt.patient.email?.toLowerCase().includes(searchLower) ||
                appt.patient.phone?.includes(searchLower)
            );
        });
    }, [appointments, searchTerm]);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAppointments(filter);
            setAppointments(data);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load appointments. Please check your connection and try again."
            );
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    }, [filter, updateList]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleUpdateSuccess = () => {
        fetchAppointments(); // Refetch list
    };

    const handleDeleteSuccess = () => {
        fetchAppointments();
    };


    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-48 mt-3" />
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={fetchAppointments}>
                    Retry
                </Button>
            </Card>
        );
    }

    if (appointments.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                    {filter === "TODAY"
                        ? "No appointments scheduled for today."
                        : "No past appointments found."}
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
                <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={() => {
                        setEditAppointment(appointment);
                        setIsEditModalOpen(true);
                    }}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            ))}
            <EditAppointmentModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                appointment={editAppointment}
                onSuccess={handleUpdateSuccess}
            />
        </div>
    );
}

function AppointmentItem({
    appointment,
    onEdit,
    onDeleteSuccess,
}: {
    appointment: TAppointment;
    onEdit: () => void;
    onDeleteSuccess: () => void;
}) {
    const formattedDate = format(new Date(appointment.appointmentDate), "PPP p");
    const statusColorMap: Record<TAppointment["status"], "default" | "secondary" | "destructive" | "outline" | "success"> = {
        BOOKED: "outline",
        CONFIRMED: "default",
        CANCELLED: "destructive",
        DONE: "success",
        NO_SHOW: "destructive",
    };

    const handleDelete = async () => {
        try {
            await deleteAppointment(appointment.id);
            onDeleteSuccess();
            toast.success("Deleted appointment successfully.");
        } catch (err) {
            console.error("Failed to delete appointment:", err);
            // Optional: show toast error
            toast.error("Failed to delete appointment " + (err instanceof Error ? `: ${err.message}` : ""));
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{appointment.patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            Age: {appointment.patient.age} • {appointment.patient.gender}
                        </p>
                        <p className="text-sm mt-1">
                            <span className="font-medium">Doctor:</span> {appointment.doctor.name}
                            {appointment.doctor.specialization && (
                                <span className="ml-2 text-muted-foreground">({appointment.doctor.specialization})</span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={onEdit}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the appointment for {appointment.patient.name}. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium">Scheduled:</span> {formattedDate}
                </div>
                <div className="mt-2">
                    <Badge variant={statusColorMap[appointment.status]}>
                        {makeProper(appointment.status)}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}

function makeProper(str: string) {
    const strs = str.split("_");
    let strAns = "";

    strs.forEach((s) => {
        const x = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        strAns = strAns.concat(x, " ");
    });

    return strAns.trim();
}