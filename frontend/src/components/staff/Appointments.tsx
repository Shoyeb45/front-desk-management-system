"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { AppointmentManagement } from "./AppointmentManagement";
import { DoctorManagement } from "./DoctorManagement";

export function Appointments() {
    const [tab, setTab] = useState<"appointments" | "doctor">("appointments");

    return (
        <div className="container mx-auto py-8 px-2">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Appointment Dashboard</CardTitle>
                    <CardDescription>{tab === "doctor" ? "Manage and edit doctors" : "Manage appointments of the patients."}</CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs
                        value={tab}
                        onValueChange={(value) => setTab(value as "appointments" | "doctor")}
                        className="w-full"
                    >
                        <TabsList className="h-14 w-full">
                            <TabsTrigger value="appointments" className="text-xl">Appointments Management</TabsTrigger>
                            <TabsTrigger value="doctor" className="text-xl">Doctor Management</TabsTrigger>
                        </TabsList>
                        {tab === "appointments" ? <AppointmentManagement /> : <DoctorManagement />}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

