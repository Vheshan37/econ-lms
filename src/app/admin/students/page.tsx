"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Check, X, UserCheck } from "lucide-react";

export default function StudentsPage() {
    const { users, years, approveStudent } = useStore();
    const students = users.filter(u => u.role === 'student');

    // Local state for editing assignments
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);

    const startEditing = (studentId: string, currentYears: string[] = []) => {
        setEditingId(studentId);
        setSelectedYears(currentYears);
    };

    const toggleYear = (yearId: string) => {
        setSelectedYears(prev =>
            prev.includes(yearId)
                ? prev.filter(y => y !== yearId)
                : [...prev, yearId]
        );
    };

    const saveChanges = (studentId: string) => {
        approveStudent(studentId, selectedYears);
        setEditingId(null);
        setSelectedYears([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                    <p className="text-gray-500 mt-2">Approve students and assign them to classes.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Assigned Years</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {editingId === student.id ? (
                                            <div className="flex flex-wrap gap-2">
                                                {years.map(year => (
                                                    <button
                                                        key={year.id}
                                                        onClick={() => toggleYear(year.id)}
                                                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${selectedYears.includes(year.id)
                                                                ? 'bg-blue-100 border-blue-200 text-blue-700'
                                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {year.name}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                {student.assignedYears && student.assignedYears.length > 0 ? (
                                                    student.assignedYears.map(yId => {
                                                        const year = years.find(y => y.id === yId);
                                                        return (
                                                            <span key={yId} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                                                {year?.name || yId}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-gray-400 italic">No classes assigned</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.assignedYears && student.assignedYears.length > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === student.id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" onClick={() => saveChanges(student.id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => startEditing(student.id, student.assignedYears)}
                                            >
                                                <UserCheck className="h-4 w-4 mr-2" />
                                                Manage
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
