"use client"
import { decodeToken, getToken } from "@/lib/utils";
import { Employee } from "@/types/adminTypes"
import { useCallback, useEffect, useState } from "react"
import { getUserData } from "./api";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function Staff() {
    return (<>
        <GreetingForStaff />
        <Statistics />
    </>)
}


export function GreetingForStaff() {
    const [userData, setUserData] = useState<Employee>();

    const fetchUserData = useCallback(async () => {
        try {
       
            const user = decodeToken(getToken());
            const data = await getUserData(user?.id);
            if (!data) {
                return;
            }
            setUserData(data);
        } catch (err) {
            // setError(err instanceof Error ? err.message : "Failed to fetch employees");
            console.error("Error fetching employees:", err);
        } finally {
            // setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, []);

    return (<>
        <div>
            Hello {userData?.name}
        </div>
    </>)
}

export function Statistics() {
    return (<>
        <div className="flex ">
            <div>
                <QueueStats />
            </div>
            <div>
                <AppointmentStats />
            </div>
        </div>
    </>)
}

export function QueueStats() {
    const router = useRouter();

    return (<>
        <div>Some stats...</div>
        <Button variant={"outline"} onClick={() => {
            router.push("/staff/queue")
        }}>Go to queue management</Button>
    </>)
}

export function AppointmentStats() {
    const router = useRouter();

    return (<>
        <div>Some stats...</div>
        <Button variant={"outline"} onClick={() => {
            router.push("/staff/appointments")
        }}>Go to appointment management</Button>
    </>)
}