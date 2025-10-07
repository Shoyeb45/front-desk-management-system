"use client";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Header() {
    const router = useRouter();
    function logout() {
        localStorage.removeItem("token");
        toast.success("Successfully logged out, redirecting to the front page...");
        setTimeout(() => {
            router.push("/");
        }, 1000)
    }
    return (
        <header className="bg-background-secondary border-b border-border px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">
                    Clinic Dashboard
                </h1>
                <div className="flex gap-2 justify-center items-center">
                    <div className="">
                        <ThemeToggle/>
                    </div>
                    <Button variant={"destructive"} onClick={() => 
                        logout()
                    }>Log Out</Button>
                </div>
            </div>
        </header>
    )
}