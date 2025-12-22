"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, LogOut, GraduationCap, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { logout } from "@/lib/actions/auth";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Classes', href: '/student/classes', icon: GraduationCap },
        { name: 'All Resources', href: '/student/resources', icon: BookOpen },
        { name: 'Free Resources', href: '/student/free-resources', icon: BookOpen },
        { name: 'Profile', href: '/student/profile', icon: User },
    ];

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-[#FAFAFA] flex">
                {/* Sidebar */}
                <motion.aside
                    initial={{ width: 256 }}
                    animate={{ width: isCollapsed ? 80 : 256 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-[#1a1a1a] border-r border-gray-800 fixed h-full z-20 hidden md:flex flex-col shadow-2xl"
                >
                    <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                    <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h1 className="text-xl font-bold text-white">Econ LMS</h1>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Student Portal</p>
                                </motion.div>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                            </div>
                        )}
                    </div>

                    <nav className={`flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar ${isCollapsed ? '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const LinkButton = (
                                <Link href={item.href} className="block w-full">
                                    <Button
                                        variant="ghost"
                                        className={`w-full transition-all duration-200 relative group ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'}
                                            ${isActive
                                                ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-white'}`} />
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="truncate"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AF37] rounded-r-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Button>
                                </Link>
                            );

                            if (isCollapsed) {
                                return (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>
                                            {LinkButton}
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-[#D4AF37] text-[#1a1a1a] border-none">
                                            {item.name}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return <div key={item.name}>{LinkButton}</div>;
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-800 space-y-2">
                        {/* Collapse Button - Now on top */}
                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsCollapsed(!isCollapsed)}
                                        className="w-full justify-center text-gray-400 hover:text-white hover:bg-white/5"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-[#D4AF37] text-[#1a1a1a] border-none">
                                    Expand Sidebar
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <span>Collapse Sidebar</span>
                            </Button>
                        )}

                        {/* Logout Button - Now at bottom */}
                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsLogoutDialogOpen(true)}
                                        className="w-full justify-center px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-[#D4AF37] text-[#1a1a1a] border-none">
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => setIsLogoutDialogOpen(true)}
                                className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </Button>
                        )}
                    </div>
                </motion.aside>

                <AlertDialog
                    isOpen={isLogoutDialogOpen}
                    onClose={() => setIsLogoutDialogOpen(false)}
                    onConfirm={handleLogout}
                    title="Sign out?"
                    description="Are you sure you want to sign out of your account?"
                    confirmText="Sign out"
                    cancelText="Cancel"
                    type="error"
                />


                {/* Mobile Sidebar */}
                <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1a1a1a] border-b border-gray-800 z-10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">Econ LMS</h1>
                    </div>
                </div>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-20 md:pt-8 p-4 md:p-8`}>
                    {children}
                </main>
            </div >
        </TooltipProvider >
    );
}
