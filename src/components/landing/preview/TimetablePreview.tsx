"use client";

import { Calendar, Clock, MapPin } from "lucide-react";

interface TimetableClass {
    id?: string;
    day: string;
    startTime: string;
    endTime: string;
    academicYear: string;
}

interface TimetableInstitute {
    id?: string;
    name: string;
    location: string;
    timetables: TimetableClass[];
}

interface TimetablePreviewProps {
    data: TimetableInstitute[];
}

export function TimetablePreview({ data }: TimetablePreviewProps) {
    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-[#fdf021]/10 rounded-full mb-6">
                        <Calendar className="h-8 w-8 text-[#fdf021]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Class Timetable
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        ඔබට පහසු ආයතනය තෝරා ගන්න. පන්ති ශ්‍රී ලංකාව පුරා විවිධ ස්ථානවල පවත්වනු ලැබේ.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((institute, idx) => (
                        <div
                            key={institute.id || idx}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)]"
                        >
                            {/* Institute Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-[#fdf021]" />
                                    <span className="text-sm text-gray-400">{institute.location}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{institute.name}</h3>
                                <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" />
                            </div>

                            {/* Classes List */}
                            <div className="space-y-4">
                                {institute.timetables.map((classItem, classIdx) => (
                                    <div
                                        key={classItem.id || classIdx}
                                        className="bg-black/40 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-[#fdf021] rounded-full" />
                                                <span className="font-semibold text-white">{classItem.day}</span>
                                            </div>
                                            <span className="text-xs bg-[#fdf021]/10 text-[#fdf021] px-2 py-1 rounded-full">
                                                {classItem.academicYear}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{classItem.startTime} - {classItem.endTime}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            📍 {institute.name}
                                        </div>
                                    </div>
                                ))}
                                {institute.timetables.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                        No classes scheduled yet.
                                    </div>
                                )}
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No institutes added yet. Add institutes from the Timetable tab.</p>
                    </div>
                )}

                {/* Info Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        💡 <span className="text-gray-400">New institutes are opening soon. Stay tuned for updates!</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
