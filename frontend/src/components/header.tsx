import { ThemeToggle } from "./theme-toggle";

export function Header() {
    return (
        <header className="bg-background-secondary border-b border-border px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">
                    Clinic Dashboard
                </h1>
                <ThemeToggle />
            </div>
        </header>
    )
}