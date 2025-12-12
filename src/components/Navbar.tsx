"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavbarProps {
    isTransparent?: boolean;
}

export function Navbar({ isTransparent = false }: NavbarProps) {
    const { currentUser, logout } = useStore();

    return (
        <nav className={cn(
            "transition-all duration-300",
            isTransparent
                ? "bg-transparent border-b border-white/10"
                : "border-b border-white/10 backdrop-blur-md sticky top-0 z-50"
        )}>
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="relative h-full min-w-[120px]">
                    <Image
                        src="/logo_t.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Hall of Fame", path: "/hall-of-fame" },
                        { name: "Contact Us", path: "/contact" },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-yellow-500 relative group",
                                isTransparent ? "text-gray-300" : "text-gray-300"
                            )}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex items-center gap-2 text-sm font-medium",
                                isTransparent ? "text-gray-300" : "text-gray-700"
                            )}>
                                <UserIcon className="h-4 w-4" />
                                {currentUser.name}
                            </div>
                            <Link href={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
                                <Button
                                    variant={isTransparent ? "outline" : "outline"}
                                    size="sm"
                                    className={isTransparent ? "border-white/20 text-white hover:bg-white hover:text-black" : ""}
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className={isTransparent ? "text-white hover:bg-white/10" : ""}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button
                                className="bg-yellow-500 text-black hover:bg-yellow-400"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
