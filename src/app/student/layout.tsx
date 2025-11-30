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
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1a1a1a] border-r border-gray-800 md:fixed h-auto md:h-full z-10 flex flex-col">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center md:block">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-8 w-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                                <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                            </div>
                            <h1 className="text-xl font-bold text-white">Econ LMS</h1>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 ml-1">Student Portal</p>
                    </div>
                    <div className="md:hidden">
                        {/* Mobile menu toggle could go here */}
                    </div>
                </div>

                <div className="p-4 border-b border-gray-800 md:hidden">
                    <p className="text-sm font-medium text-gray-300">Hi, {currentUser?.name}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 transition-all duration-200 ${isActive
                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                                    {item.name}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
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
