"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import {
    CurrentStatusType,
    QueueListType,
    QueueType
} from "@/types/staffTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import {
    Clock,
    User,
    Calendar,
    AlertCircle,
    CheckCircle,
    Stethoscope,
    AlertTriangle,
    Trash2,
    MoreVertical,
    Zap,
    Activity
} from "lucide-react";
import { getPatientQueue, updatePatientQueue, deletePatientQueue } from "./api";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getFormattedDoctorName } from "@/lib/utils";

export function PatientList({
    filter,
    searchTerm,
    filterStatus,
    updateList,
    setUpdateList
}: {
    filter: "TODAY" | "PAST",
    searchTerm: string,
    filterStatus: CurrentStatusType | "" | undefined,
    updateList: number,
    setUpdateList: React.Dispatch<React.SetStateAction<number>>
}) {
    const [patientQueue, setPatientQueue] = useState<QueueListType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchPatientList = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPatientQueue(filter);
            setPatientQueue(data);
        } catch (err) {
            console.error("Failed to fetch patient queue:", err);
            setError(err instanceof Error ? err.message : "Failed to load patients.");
            setPatientQueue([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchPatientList();
    }, [fetchPatientList, updateList]);

    const filteredPatientList = useMemo(() => {
        return patientQueue.filter(patient => {
            if (filterStatus && patient.currentStatus !== filterStatus) {
                return false;
            }

            const searchLower = searchTerm.toLowerCase();
            return (
                patient.patient.name.toLowerCase().includes(searchLower) ||
                (patient.patient.email?.toLowerCase().includes(searchLower)) ||
                (patient.patient.phone?.includes(searchLower))
            );
        });
    }, [patientQueue, filterStatus, searchTerm]);

    const getStatusConfig = (status: CurrentStatusType) => {
        switch (status) {
            case CurrentStatusType.WAITING:
                return { label: "Waiting", variant: "secondary" as const, icon: <Clock className="h-3 w-3" /> };
            case CurrentStatusType.WITH_DOCTOR:
                return { label: "With Doctor", variant: "default" as const, icon: <Stethoscope className="h-3 w-3" /> };
            case CurrentStatusType.DONE:
                return { label: "Done", variant: "success" as const, icon: <CheckCircle className="h-3 w-3" /> };
            default:
                return { label: status, variant: "outline" as const, icon: null };
        }
    };


    const formatTime = (dateString: string | Date) => {
        const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
        return formatInTimeZone(date, "Asia/Kolkata", "h:mm a");
    };

    const formatDate = (dateString: string | Date) => {
        const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
        return format(date, "MMM d, yyyy");
    };

    // --- Action Handlers ---
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name} from the queue? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            await deletePatientQueue(id);
            setPatientQueue(prev => prev.filter(p => p.id !== id));
            setUpdateList(prev => prev + 1); // update the list
            toast.success(`${name} removed from queue`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to delete patient";
            toast.error(msg);
            setError(msg);
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdate = async (
        id: string,
        updateData: { currentStatus?: CurrentStatusType; queueType?: QueueType }
    ) => {
        setUpdatingId(id);
        try {
            const currentPatient = patientQueue.find(p => p.id === id);
            if (!currentPatient) return;

            const payload = {
                currentStatus: updateData.currentStatus ?? currentPatient.currentStatus,
                queueType: updateData.queueType ?? currentPatient.queueType
            };

            await updatePatientQueue(id, payload);
            setUpdateList(prev => prev + 1);
            setPatientQueue(prev =>
                prev.map(p =>
                    p.id === id
                        ? { ...p, ...updateData }
                        : p
                )
            );

            toast.success("Patient updated");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to update patient";
            toast.error(msg);
        } finally {
            setUpdatingId(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-48" />
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="py-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <p className="text-destructive font-medium">{error}</p>
                    <button
                        onClick={fetchPatientList}
                        className="mt-4 text-primary hover:underline"
                    >
                        Try again
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (filteredPatientList.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        {searchTerm || filterStatus
                            ? "No patients match your filters"
                            : filter === "TODAY"
                                ? "No patients in today's queue"
                                : "No past patients found"}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {filteredPatientList.map((item) => {
                const statusConfig = getStatusConfig(item.currentStatus);
                const isEmergency = item.queueType === QueueType.EMERGENCY;
                const showExpectedTime =
                    filter === "TODAY" &&
                    item.currentStatus === CurrentStatusType.WAITING &&
                    item.expectedTime;

                return (
                    <Card
                        key={item.id}
                        className={`
              ${isEmergency ? "border-l-4 border-l-destructive" : ""}
              group relative
            `}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg truncate">
                                            {item.patient.name}
                                        </CardTitle>
                                        {isEmergency && (
                                            <Badge variant="destructive" className="flex items-center gap-1 font-bold">
                                                <AlertTriangle className="h-3 w-3" />
                                                EMERGENCY
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            {item.patient.age} • {item.patient.gender}
                                        </span>
                                        {item.patient.email && (
                                            <span className="truncate max-w-[180px]">{item.patient.email}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 items-end">
                                    <Badge variant={statusConfig.variant} className="flex items-center gap-1 h-9">
                                        {statusConfig.icon}
                                        {statusConfig.label}
                                    </Badge>

                                    {showExpectedTime && (
                                        <Badge variant="outline" className="flex items-center gap-1 bg-accent/31 h-9">
                                            <Clock className="h-3 w-3" />
                                            Est: {formatTime(item.expectedTime!)}
                                        </Badge>
                                    )}

                                    {/* Actions - available for BOTH TODAY and PAST */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            {/* Queue Type Toggle */}
                                            {item.queueType === QueueType.NORMAL ? (
                                                <DropdownMenuItem
                                                    onSelect={() => handleUpdate(item.id, { queueType: QueueType.EMERGENCY })}
                                                    disabled={updatingId === item.id}
                                                >
                                                    <Zap className="mr-2 h-4 w-4 text-destructive" />
                                                    <span>Mark as Emergency</span>
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    onSelect={() => handleUpdate(item.id, { queueType: QueueType.NORMAL })}
                                                    disabled={updatingId === item.id}
                                                >
                                                    <Activity className="mr-2 h-4 w-4" />
                                                    <span>Mark as Normal</span>
                                                </DropdownMenuItem>
                                            )}

                                            {/* Status Options (only for TODAY) */}
                                            {filter === "TODAY" && (
                                                <>
                                                    {item.currentStatus !== CurrentStatusType.WITH_DOCTOR && (
                                                        <DropdownMenuItem
                                                            onSelect={() => handleUpdate(item.id, { currentStatus: CurrentStatusType.WITH_DOCTOR })}
                                                            disabled={updatingId === item.id}
                                                        >
                                                            <Stethoscope className="mr-2 h-4 w-4" />
                                                            With Doctor
                                                        </DropdownMenuItem>
                                                    )}
                                                    {item.currentStatus !== CurrentStatusType.DONE && (
                                                        <DropdownMenuItem
                                                            onSelect={() => handleUpdate(item.id, { currentStatus: CurrentStatusType.DONE })}
                                                            disabled={updatingId === item.id}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Done
                                                        </DropdownMenuItem>
                                                    )}
                                                    {item.currentStatus !== CurrentStatusType.WAITING && (
                                                        <DropdownMenuItem
                                                            onSelect={() => handleUpdate(item.id, { currentStatus: CurrentStatusType.WAITING })}
                                                            disabled={updatingId === item.id}
                                                        >
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            Back to Waiting
                                                        </DropdownMenuItem>
                                                    )}
                                                </>
                                            )}

                                            <DropdownMenuItem
                                                onSelect={() => handleDelete(item.id, item.patient.name)}
                                                className="text-destructive focus:text-destructive"
                                                disabled={deletingId === item.id}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove from Queue
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground border-t pt-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(item.createdAt)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        Arrived: {formatTime(item.arrivalTime)}
                                    </span>
                                </div>

                                {item.doctor && (
                                    <div className="flex items-center gap-1">
                                        <Stethoscope className="h-3.5 w-3.5 text-primary" />
                                        {getFormattedDoctorName(item.doctor.name)}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}