"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout, currentUser } = useStore();

    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Resources', href: '/student/resources', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:fixed h-auto md:h-full z-10 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center md:block">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">Econ LMS</h1>
                        <p className="text-xs text-gray-500 mt-1">Student Portal</p>
                    </div>
                    <div className="md:hidden">
                        {/* Mobile menu toggle could go here */}
                    </div>
                </div>

                <div className="p-4 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-medium text-gray-900">Hi, {currentUser?.name}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
