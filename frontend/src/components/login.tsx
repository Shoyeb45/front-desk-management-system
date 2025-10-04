"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { appConfig } from "@/config";
import { ApiErrorResponse, ApiSuccessReponse, LoginData } from "@/types/apiTypes";
import { decodeToken } from "@/lib/utils";

export const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        
        if (isLoading) return;

        setErrorMessage("");

        // Validation
        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        try {
            setIsLoading(true);
    
            const response = await fetch(
                `${appConfig.backendUrl}/api/v1/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password, role }),
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                }
            );

            // Check if response is OK
            if (!response.ok) {
                let errorData: ApiErrorResponse | null = null;
                try {
                    errorData = await response.json();
                } catch {
                    // If JSON parsing fails, use status text
                }

                setErrorMessage(
                    errorData?.message || 
                    `Login failed: ${response.status} ${response.statusText}`
                );
                return;
            }

            const apiResponse: ApiSuccessReponse<LoginData> = await response.json();
            
            if (!apiResponse.success) {
                setErrorMessage(apiResponse.message || "Login failed. Please try again.");
                return;
            }

            const user = decodeToken(apiResponse.data.token);
            if (user?.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/staff");
            }
            
            router.refresh();
            
        } catch (error) {
            console.error("Login error:", error);
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setErrorMessage(
                    "Unable to reach the server. Please check your connection."
                );
            } else if (error instanceof DOMException && error.name === 'TimeoutError') {
                setErrorMessage(
                    "Request timed out. Please try again."
                );
            } else if (error instanceof DOMException && error.name === 'AbortError') {
                setErrorMessage("Request was cancelled. Please try again.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
                <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as "ADMIN" | "STAFF")}
                    className="flex gap-4"
                    disabled={isLoading}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ADMIN" id="admin" disabled={isLoading} />
                        <Label 
                            htmlFor="admin" 
                            className={`font-normal ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            Admin
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="STAFF" id="staff" disabled={isLoading} />
                        <Label 
                            htmlFor="staff" 
                            className={`font-normal ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            Staff
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <span className="mr-2">Logging in...</span>
                        <span className="animate-spin">⏳</span>
                    </>
                ) : (
                    "Login"
                )}
            </Button>
        </form>
    );
}