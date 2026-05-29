"use client";

import { Calendar, Clock, MapPin } from "lucide-react";

interface Timetable {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    academicYear: string;
}

interface InstituteWithTimetables {
    id: string;
    name: string;
    location: string;
    timetables: Timetable[];
}

interface TimetableSectionProps {
    institutes: InstituteWithTimetables[];
}

export function TimetableSection({ institutes }: TimetableSectionProps) {
    return (
        <section className="py-16 md:py-24 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-[#fdf021]/10 rounded-full mb-6">
                        <Calendar className="h-8 w-8 text-[#fdf021]" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Class Timetable
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        ඔබට පහසු ආයතනය තෝරා ගන්න. පන්ති ශ්‍රී ලංකාව පුරා විවිධ ස්ථානවල පවත්වනු ලැබේ.
                    </p>
                </div>

                <div className="block md:hidden">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-[#111]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#fdf021]/10 border border-[#fdf021]/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[#fdf021]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Class Schedule</h3>
                                    <p className="text-xs text-gray-500">All institutes & times</p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-800">
                            {institutes.map((institute) => (
                                <div key={institute.id} className="p-5">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-4 h-4 text-[#fdf021]" />
                                            <span className="text-xs text-gray-400">{institute.location}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{institute.name}</h3>
                                        <div className="h-0.5 w-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mt-2" />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {institute.timetables.map((classItem) => (
                                            <div
                                                key={classItem.id}
                                                className="bg-black/40 rounded-xl px-4 py-3 border border-gray-800 hover:border-[#fdf021]/30 transition-colors flex-shrink-0"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-1.5 h-1.5 bg-[#fdf021] rounded-full" />
                                                    <span className="font-semibold text-white text-sm">
                                                        {classItem.day}
                                                    </span>
                                                    <span className="text-[10px] bg-[#fdf021]/10 text-[#fdf021] px-1.5 py-0.5 rounded-full">
                                                        {classItem.academicYear}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{classItem.startTime} - {classItem.endTime}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {institute.timetables.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No classes scheduled yet</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[#fdf021]/5 border-t border-[#fdf021]/10">
                            <p className="text-xs text-gray-500 text-center">
                                💡 New institutes are opening soon. Stay tuned!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {institutes.map((institute) => (
                        <div
                            key={institute.id}
                            className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)]"
                        >
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-[#fdf021]" />
                                    <span className="text-sm text-gray-400">{institute.location}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-1">{institute.name}</h3>
                                <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" />
                            </div>

                            <div className="space-y-4">
                                {institute.timetables.map((classItem) => (
                                    <div
                                        key={classItem.id}
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
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {institutes.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No institutes available yet</p>
                        <p className="text-gray-600 text-sm mt-2">New institutes will be announced soon.</p>
                    </div>
                )}

                <div className="hidden md:block mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        💡 <span className="text-gray-400">New institutes are opening soon. Stay tuned for updates!</span>
                    </p>
                </div>
            </div>
        </section>
    );
}