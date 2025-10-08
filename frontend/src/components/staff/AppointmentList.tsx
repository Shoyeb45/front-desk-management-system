"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { AppointmentStatus, TAppointment } from "@/types/staffTypes";
import { getAppointments } from "./api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAppointment } from "./api";
import { EditAppointmentModal } from "./EditAppointmentModal";
import { toast } from "sonner";

export function AppointmentList({
    filter,
    searchTerm,
    updateList,
    appointmentStatus,
}: {
    filter: "TODAY" | "PAST";
    searchTerm: string;
    updateList: number;
    appointmentStatus: AppointmentStatus | "";
}) {
    const [appointments, setAppointments] = useState<TAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editAppointment, setEditAppointment] = useState<TAppointment | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const filteredAppointments = useMemo(() => {
        return appointments.filter((appt) => {
            const searchLower = searchTerm.toLowerCase();

            const patientMatches =
                appt.patient.name.toLowerCase().includes(searchLower) ||
                appt.patient.email?.toLowerCase().includes(searchLower) ||
                appt.patient.phone?.includes(searchLower);

            const statusMatches = appointmentStatus !== "" ? appointmentStatus === appt.status : true;

            return patientMatches && statusMatches;
        });
    }, [appointments, searchTerm, appointmentStatus]);

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
        fetchAppointments();
    };

    const handleDeleteSuccess = () => {
        fetchAppointments();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-3/4 sm:w-1/3" />
                                    <Skeleton className="h-4 w-1/2 sm:w-1/4" />
                                    <Skeleton className="h-4 w-2/3 sm:w-1/2" />
                                </div>
                                <div className="flex gap-2 self-start sm:self-center">
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                </div>
                            </div>
                            <div className="mt-3 space-y-2">
                                <Skeleton className="h-4 w-full max-w-xs" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 text-center">
                <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 px-4 py-2 text-sm"
                    onClick={fetchAppointments}
                >
                    Retry
                </Button>
            </Card>
        );
    }

    if (appointments.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">
                    {filter === "TODAY"
                        ? "No appointments scheduled for today."
                        : "No past appointments found."}
                </p>
            </Card>
        );
    }

    if (filteredAppointments.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-sm sm:text-base">
                        No appointments found
                        {(searchTerm !== "") || appointmentStatus !== ""
                            ? ` matching your filters`
                            : ""}
                    </p>
                </CardContent>
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
    const statusColorMap: Record<
        TAppointment["status"],
        "default" | "secondary" | "destructive" | "outline" | "success"
    > = {
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
            toast.error("Failed to delete appointment" + (err instanceof Error ? `: ${err.message}` : ""));
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-4">
                {/* Main content: responsive flex */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Patient & Doctor Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{appointment.patient.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Age: {appointment.patient.age} • {appointment.patient.gender}
                        </p>
                        <p className="text-xs sm:text-sm mt-2">
                            <span className="font-medium">Doctor:</span>{" "}
                            <span className="truncate">{appointment.doctor.name}</span>
                            {appointment.doctor.specialization && (
                                <span className="ml-1 text-muted-foreground">
                                    ({appointment.doctor.specialization})
                                </span>
                            )}
                        </p>
                        <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
                            <span className="font-medium">Scheduled:</span> {formattedDate}
                        </div>
                    </div>

                    {/* Right: Actions + Status */}
                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onEdit}
                                className="h-9 w-9 hover:bg-accent"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the appointment for{" "}
                                            <span className="font-medium">{appointment.patient.name}</span>. This action
                                            cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <Badge variant={statusColorMap[appointment.status]} className="whitespace-nowrap py-1 px-2 text-xs sm:text-sm">
                            {makeProper(appointment.status)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function makeProper(str: string) {
    return str
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}