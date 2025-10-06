"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { appConfig } from "@/config";
import {  ApiSuccessReponse, LoginData } from "@/types/apiTypes";
import { decodeToken } from "@/lib/utils";

export const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Auto-redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = decodeToken(token);
            if (user) {
                router.push(user.role === "ADMIN" ? "/admin" : "/staff");
            } else {
                localStorage.removeItem("token");
            }
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${appConfig.backendUrl}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, role }),
                signal: AbortSignal.timeout(10000),
            });

            const apiResponse: ApiSuccessReponse<LoginData> = await response.json();

            if (!response.ok) {
                const msg = apiResponse?.message || `Login failed: ${response.status}`;
                toast.error(msg);
                return;
            }

            if (!apiResponse.success) {
                toast.error(apiResponse.message || "Login failed. Please try again.");
                return;
            }

            localStorage.setItem("token", apiResponse.data.token);
            const user = decodeToken(apiResponse.data.token);

            toast.success(`Welcome back, ${user?.name || "Admin"}!`);

            setTimeout(() => {
                router.push(user?.role === "ADMIN" ? "/admin" : "/staff");
            }, 800);
        } catch (error) {
            console.error("Login error:", error);
            let message = "An unexpected error occurred. Please try again.";

            if (error instanceof Error) {
                if (error.name === "TimeoutError") {
                    message = "Request timed out. Please try again.";
                } else if (error.message?.includes("fetch")) {
                    message = "Unable to reach the server. Please check your connection.";
                }
            }

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 md:p-8">
            
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md text-center md:text-left">
                    <blockquote className="text-2xl font-medium text-primary mb-6">
                        “The best way to care for patients is to care for those who care for them.”
                    </blockquote>
                    <p className="text-muted-foreground">
                        — Clinic Management System
                    </p>
                    <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                        Empowering healthcare teams with seamless tools to focus on what matters most:
                        <span className="font-semibold text-primary"> patient care</span>.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg bg-transparent"     >
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Sign in to your account
                        </CardTitle>
                        <p className="text-muted-foreground text-center text-sm">
                            Access the {role === "ADMIN" ? "admin" : "staff"} dashboard
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@clinic.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <RadioGroup
                                    value={role}
                                    onValueChange={(value) => setRole(value as "ADMIN" | "STAFF")}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ADMIN" id="admin" disabled={isLoading} />
                                        <Label htmlFor="admin" className="font-medium">
                                            Admin
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="STAFF" id="staff" disabled={isLoading} />
                                        <Label htmlFor="staff" className="font-medium">
                                            Staff
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span>Signing in...</span>
                                        <span className="ml-2 animate-spin">⏳</span>
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};