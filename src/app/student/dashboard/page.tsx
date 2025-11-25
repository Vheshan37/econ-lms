"use client";

import { useStore } from "@/lib/store";
import { GraduationCap, BookOpen } from "lucide-react";

export default function StudentDashboard() {
    const { currentUser, years, getStudentResources } = useStore();

    if (!currentUser) return null;

    const myResources = getStudentResources(currentUser.id);
    const myYears = years.filter(y => currentUser.assignedYears?.includes(y.id));

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
                <p className="mt-2 text-blue-100">You are enrolled in {myYears.length} classes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">My Classes</h2>
                    </div>
                    {myYears.length > 0 ? (
                        <div className="space-y-3">
                            {myYears.map(year => (
                                <div key={year.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                                    <span className="font-medium text-gray-900">{year.name}</span>
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No classes assigned yet. Please contact your teacher.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Quick Stats</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-gray-900">{myResources.length}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Resources</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-gray-900">{myResources.filter(r => r.type === 'quiz').length}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Quizzes Available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
