"use client";
import { appConfig } from "@/config";
import { useEffect } from "react";

export function WakeUpServer() {
    useEffect(() => {
        fetch(`${appConfig.backendUrl}/wake-up`)
            .then((d) => {
                console.log("Server successfully woke up.");
            })
            .catch(er => {
                console.error(er);
            })
    });

    return (
        <></>
    )
}