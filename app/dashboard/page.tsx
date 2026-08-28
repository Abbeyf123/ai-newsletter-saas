import { ThemeSwitcher } from "@/components/custom/theme-switcher";

export default function DashboardPage(){
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <h1>Dashboard</h1>
                <ThemeSwitcher />
            </div>
        </div>
    )
} 