"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { GraduationCap, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useStore();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<'admin' | 'student'>('student');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, role);
        if (role === 'admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/student/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                </div>

                <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'student' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setRole('student')}
                    >
                        <GraduationCap className="h-4 w-4" />
                        Student
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setRole('admin')}
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Teacher
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={role === 'admin' ? "teacher@econ.lk" : "student@example.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full h-11 text-lg">
                        Sign In
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    <p>Demo Credentials:</p>
                    <p className="mt-1">Teacher: teacher@econ.lk</p>
                    <p>Student: kamal@student.lk</p>
                </div>
            </div>
        </div>
    );
}
