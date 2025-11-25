"use client";

import { useStore } from "@/lib/store";
import { Users, BookOpen, Clock } from "lucide-react";

export default function AdminDashboard() {
    const { users, resources } = useStore();

    const students = users.filter(u => u.role === 'student');
    const pendingStudents = students.filter(s => !s.assignedYears || s.assignedYears.length === 0);
    const totalResources = resources.length;

    const stats = [
        { name: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500' },
        { name: 'Total Resources', value: totalResources, icon: BookOpen, color: 'bg-green-500' },
        { name: 'Pending Approvals', value: pendingStudents.length, icon: Clock, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-lg ${stat.color} bg-opacity-10`}>
                            <stat.icon className={`h-8 w-8 ${stat.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}
