"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagementCard } from "./ManagementCard";

export function Admin() {
    const [tab, setTab] = useState<"doctor" | "staff">("staff");

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <Card className="w-full max-w-6xl mx-auto overflow-hidden">
                <CardHeader className="pb-4 text-center sm:text-left">
                    <CardTitle className="text-xl sm:text-2xl font-bold">Management Dashboard</CardTitle>
                </CardHeader>

                <CardContent>
                    <Tabs
                        value={tab}
                        onValueChange={(value) => setTab(value as "doctor" | "staff")}
                        className="w-full"
                    >
                        <TabsList className="flex h-12 sm:h-14 w-full overflow-x-auto">
                            <TabsTrigger
                                value="staff"
                                className="flex-1 sm:flex-none min-w-0 px-3 sm:px-6 text-sm sm:text-lg whitespace-nowrap"
                            >
                                Staff Management
                            </TabsTrigger>
                            <TabsTrigger
                                value="doctor"
                                className="flex-1 sm:flex-none min-w-0 px-3 sm:px-6 text-sm sm:text-lg whitespace-nowrap"
                            >
                                Doctor Management
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <ManagementCard role={tab} />
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}