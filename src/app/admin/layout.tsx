"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard,HandCoins, Users, BookOpen,Sheet, LogOut, Trophy, Clock, ChevronLeft, ChevronRight, Layers, Sparkles, TestTube, MessageSquare } from "lucide-react";
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
import { NotificationBubble } from "@/components/admin/NotificationBubble";
import { name } from "next/dist/server/ci-info";

export default function AdminLayout({
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

    const mainNavigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Classes', href: '/admin/classes', icon: BookOpen },
        { name: 'Students', href: '/admin/students', icon: Users },
        { name: 'Free Resources', href: '/admin/resources', icon: BookOpen },
        { name: 'O/L Resources', href: '/admin/ol-resources', icon: BookOpen },
        {name:'Exam Results', href:'/admin/exam-results',icon:Sheet},
        { name: 'Class Payments', href: '/admin/class-fees', icon:HandCoins },
        // { name: 'Timetable', href: '/admin/timetable', icon: Clock },
        // { name: 'Site Content', href: '/admin/content', icon: Layers },
    ];

    const bottomNavigation = [
        { name: 'Contact Developer', href: '/admin/contact-developer', icon: MessageSquare },
        { name: 'Next Improvements', href: '/admin/next-improvements', icon: Sparkles },
        // { name: 'Test Drive', href: '/admin/test-drive', icon: TestTube }, // Hidden per user request
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
                    <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} `}>
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                    <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h1 className="text-xl font-bold text-white">Econ LMS</h1>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Teacher Panel</p>
                                </motion.div>
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                            </div>
                        )}
                    </div>

                    <nav
                        className={`flex-1 p-4 flex flex-col overflow-y-auto custom-scrollbar
    ${isCollapsed ? '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}
                    >
                        {/* Top navigation */}
                        <div className="space-y-2">
                            {mainNavigation.map((item) => {
                                const isActive = pathname === item.href;

                                const LinkButton = (
                                    <Link href={item.href} className="block w-full">
                                        <Button
                                            variant="ghost"
                                            className={`w-full transition-all duration-200 relative group
                        ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'}
                        ${isActive
                                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon className={`h-5 w-5 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-white'}`} />
                                            {!isCollapsed && <span>{item.name}</span>}

                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] rounded-r-full"
                                                />
                                            )}
                                        </Button>
                                    </Link>
                                );

                                return isCollapsed ? (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{LinkButton}</TooltipTrigger>
                                        <TooltipContent side="right">{item.name}</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div key={item.name}>{LinkButton}</div>
                                );
                            })}
                        </div>

                        {/* Bottom navigation — pushed down */}
                        <div className="mt-auto pt-4 space-y-2">
                            {bottomNavigation.map((item) => {
                                const isActive = pathname === item.href;

                                const LinkButton = (
                                    <Link href={item.href} className="block w-full">
                                        <Button
                                            variant="ghost"
                                            className={`w-full transition-all duration-200 relative group
                        ${isCollapsed ? 'justify-center px-2' : 'justify-start gap-3'}
                        ${isActive
                                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {!isCollapsed && <span>{item.name}</span>}
                                        </Button>
                                    </Link>
                                );

                                return isCollapsed ? (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{LinkButton}</TooltipTrigger>
                                        <TooltipContent side="right">{item.name}</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div key={item.name}>{LinkButton}</div>
                                );
                            })}
                        </div>
                    </nav>


                    <div className="p-4 border-t border-gray-800 space-y-2">
                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsCollapsed(!isCollapsed)}
                                        className="w-full text-gray-500 hover:text-white hover:bg-white/5 justify-center"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Expand Sidebar</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="w-full text-gray-500 hover:text-white hover:bg-white/5 justify-start gap-3"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                <span>Collapse Sidebar</span>
                            </Button>
                        )}

                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-center"
                                        onClick={() => setIsLogoutDialogOpen(true)}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Logout</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="ghost"
                                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start gap-3"
                                onClick={() => setIsLogoutDialogOpen(true)}
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


                {/* Main Content */}
                <motion.main
                    id="admin-dashboard"
                    animate={{ marginLeft: isCollapsed ? 80 : 256 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-1 p-8 hidden md:block"
                >
                    {children}
                </motion.main>

                {/* Mobile Layout */}
                <main className="flex-1 p-4 md:hidden">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                                <span className="text-[#1a1a1a] font-bold text-lg">E</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Econ LMS</h1>
                        </div>
                    </div>
                    {children}
                </main>
                <NotificationBubble />
            </div >
        </TooltipProvider >
    );
}
