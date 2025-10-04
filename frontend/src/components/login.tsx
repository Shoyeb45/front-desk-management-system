"use client";
import { useState } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");

    function handleLogin(e: React.FormEvent) {
        e.preventDefault(); // Prevent form submission
        console.log({ email, password, role });
        // Your login logic here
    }

    return (
        <>
            <form onSubmit={handleLogin} className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />
                </div>

                <div className="space-y-2">
                    <Label>Role</Label>
                    <RadioGroup 
                        value={role}
                        onValueChange={(value) => setRole(value as "ADMIN" | "STAFF")}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ADMIN" id="admin" />
                            <Label htmlFor="admin" className="font-normal cursor-pointer">
                                Admin
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="STAFF" id="staff" />
                            <Label htmlFor="staff" className="font-normal cursor-pointer">
                                Staff
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Login</Button>
                </div>
            </form>
        </>
    )
}