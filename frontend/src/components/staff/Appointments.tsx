"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { AppointmentManagement } from "./AppointmentManagement";
import { DoctorManagement } from "./DoctorManagement";

export function Appointments() {
    const [tab, setTab] = useState<"appointments" | "doctor">("appointments");

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="pb-4 text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl font-bold">Appointment Dashboard</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        {tab === "doctor"
                            ? "Manage and edit doctors"
                            : "Manage appointments of the patients."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs
                        value={tab}
                        onValueChange={(value) => setTab(value as "appointments" | "doctor")}
                        className="w-full"
                    >
                        <TabsList className="h-12 sm:h-14 w-full flex flex-wrap justify-center sm:justify-start gap-1 p-1">
                            <TabsTrigger
                                value="appointments"
                                className="flex-1 sm:flex-none px-2 sm:px-6 text-sm sm:text-xl"
                            >
                                Appointments
                            </TabsTrigger>
                            <TabsTrigger
                                value="doctor"
                                className="flex-1 sm:flex-none px-2 sm:px-6 text-sm sm:text-xl"
                            >
                                Doctors
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            {tab === "appointments" ? <AppointmentManagement /> : <DoctorManagement />}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}