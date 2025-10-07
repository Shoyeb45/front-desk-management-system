"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { AddNewPatientModal } from "./AddNewPatientModal";
import { Plus } from "lucide-react";

export function AddNewPatient() {
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState<boolean>(false);

    return (<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold capitalize">Queue Management</h2>
            <p className="text-sm text-muted-foreground">
                Manage all patients and assign them to queue
            </p>
        </div>
        <Button onClick={() => {
            setIsAddNewModalOpen(true);
        }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Patient
        </Button>

        <AddNewPatientModal open={isAddNewModalOpen} onOpenChange={setIsAddNewModalOpen} />
    </div>
    )
}

