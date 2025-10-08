"use client";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut, Stethoscope } from "lucide-react";

export function Header() {
    const router = useRouter();

    function logout() {
        localStorage.removeItem("token");
        toast.success("Successfully logged out, redirecting to the front page...");
        setTimeout(() => {
            router.push("/");
        }, 1000);
    }

    return (
        <header className="bg-background-secondary border-b border-border px-4 sm:px-6 py-3">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground tracking-tight">
                        Clinic<span className="text-primary">Dashboard</span>
                    </h1>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="gap-1.5 border-border hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Log Out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}