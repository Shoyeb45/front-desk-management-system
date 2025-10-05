"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManagementCard } from "./ManagementCard";

export function Admin() {
    const [tab, setTab] = useState<"doctor" | "staff">("staff");
    
    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Management Dashboard</CardTitle>
                </CardHeader>
                
                <CardContent>
                    <Tabs value={tab} onValueChange={(value) => setTab(value as "doctor" | "staff")} className="w-full">
                        <TabsList className="flex h-14 w-full">
                            <TabsTrigger value="staff" className="text-lg" >Staff Management</TabsTrigger>
                            <TabsTrigger value="doctor" className="text-lg">Doctor Management</TabsTrigger>
                        </TabsList>
                        <ManagementCard role={tab} />
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}