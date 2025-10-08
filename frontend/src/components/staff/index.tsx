"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getAppointmentStats, getQueueStats, getUserData } from "./api";
import { decodeToken, getToken } from "@/lib/utils";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { AppointmentStats, QueueStats } from "@/types/staffTypes";

// ===== HELPER: Time-based greeting =====
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

// ===== LOADING PLACEHOLDER =====
function LoadingPlaceholder() {
    return (
        <div className="h-40 bg-muted rounded animate-pulse">
            <div className="p-5 space-y-3">
                <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
                <div className="h-8 w-20 bg-muted-foreground/30 rounded" />
                <div className="h-3 w-40 bg-muted-foreground/20 rounded" />
                <div className="h-8 w-full bg-muted-foreground/10 rounded mt-4" />
            </div>
        </div>
    );
}

// ===== ERROR PLACEHOLDER =====
function ErrorPlaceholder({ onRetry }: { onRetry: () => void }) {
    return (
        <Card className="p-5 flex flex-col items-center justify-center h-40">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-center text-muted-foreground mb-3">
                Failed to load data
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex items-center gap-1"
            >
                <RefreshCw className="h-3 w-3" />
                Retry
            </Button>
        </Card>
    );
}

// ===== MAIN COMPONENT =====
export default function StaffDashboard() {
    const router = useRouter();

    // User data state
    const [userData, setUserData] = useState<{ name: string } | null>(null);
    const [userError, setUserError] = useState(false);

    // Queue stats state
    const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
    const [queueError, setQueueError] = useState(false);

    // Appointment stats state
    const [appointmentStats, setAppointmentStats] = useState<AppointmentStats | null>(null);
    const [appointmentError, setAppointmentError] = useState(false);

    // Fetch user data
    const fetchUserData = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                setUserError(true);
                return;
            }

            const decodedToken = decodeToken(token);
            if (!decodedToken) {
                setUserError(true);
                return;
            }

            const user = await getUserData(decodedToken.id);
            setUserData({ name: user?.name ?? "Staff" });
            setUserError(false);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setUserError(true);
        }
    }, []);

    // Fetch queue stats
    const fetchQueueStats = useCallback(async () => {
        try {
            const stats = await getQueueStats();
            setQueueStats(stats);
            setQueueError(false);
        } catch (error) {
            console.error("Failed to fetch queue stats:", error);
            setQueueError(true);
        }
    }, []);

    // Fetch appointment stats
    const fetchAppointmentStats = useCallback(async () => {
        try {
            const stats = await getAppointmentStats();
            setAppointmentStats(stats);
            setAppointmentError(false);
        } catch (error) {
            console.error("Failed to fetch appointment stats:", error);
            setAppointmentError(true);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchUserData();
        fetchQueueStats();
        fetchAppointmentStats();
    }, [fetchUserData, fetchQueueStats, fetchAppointmentStats]);

    // Render greeting section
    const renderGreeting = () => {
        if (userError) {
            return (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Failed to load user data</span>
                </div>
            );
        }

        if (!userData) {
            return (
                <div className="h-16 bg-muted rounded animate-pulse w-80" />
            );
        }

        return (
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {getGreeting()}, {userData.name} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                    You&apos;re making a real difference today. Let&apos;s get started!
                </p>
            </div>
        );
    };

    // Render queue card
    const renderQueueCard = () => {
        if (queueError) {
            return <ErrorPlaceholder onRetry={fetchQueueStats} />;
        }

        if (!queueStats) {
            return <LoadingPlaceholder />;
        }

        return (
            <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">Today’s Queue</p>
                        <p className="text-2xl font-bold mt-1">
                            {queueStats.totalQueueToday}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {queueStats.emergencyCount > 0 ? (
                                <span className="text-destructive">
                                    ❗ {queueStats.emergencyCount} emergency case
                                    {queueStats.emergencyCount > 1 ? "s" : ""}
                                </span>
                            ) : (
                                "All stable"
                            )}
                        </p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {queueStats.completedCount} done
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full justify-start text-primary"
                    onClick={() => router.push("/staff/queue")}
                >
                    Manage Queue →
                </Button>
            </Card>
        );
    };

    // Render appointment card
    const renderAppointmentCard = () => {
        if (appointmentError) {
            return <ErrorPlaceholder onRetry={fetchAppointmentStats} />;
        }

        if (!appointmentStats) {
            return <LoadingPlaceholder />;
        }

        return (
            <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
                        <p className="text-2xl font-bold mt-1">
                            {appointmentStats.totalAppointmentsToday}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {appointmentStats.doneCount} completed •{" "}
                            {appointmentStats.upcomingCount} upcoming
                        </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {appointmentStats.confirmedCount} confirmed
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full justify-start text-primary"
                    onClick={() => router.push("/staff/appointments")}
                >
                    View Appointments →
                </Button>
            </Card>
        );
    };

    return (
        <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">
            {renderGreeting()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderQueueCard()}
                {renderAppointmentCard()}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6 italic">
                “Every patient you help is a life made better.”
            </p>
        </div>
    );
}