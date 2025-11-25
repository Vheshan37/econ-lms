"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users } from "lucide-react";
import Link from "next/link";

export function CoursesSection() {
    const courses = [
        {
            year: "2025",
            title: "Advanced Level",
            status: "Revision & Paper Class",
            description: "Intensive preparation for the upcoming exam. Focus on past papers and rapid revision.",
            schedule: "Saturday 8:00 AM",
            color: "from-yellow-600 to-yellow-800"
        },
        {
            year: "2026",
            title: "Advanced Level",
            status: "Theory & Revision",
            description: "Comprehensive theory coverage with parallel revision. Building a solid foundation.",
            schedule: "Sunday 8:00 AM",
            color: "from-blue-600 to-blue-800"
        },
        {
            year: "2027",
            title: "Advanced Level",
            status: "Theory Class",
            description: "Start your journey early. In-depth theory explanation and fundamental concepts.",
            schedule: "Friday 3:00 PM",
            color: "from-purple-600 to-purple-800"
        }
    ];

    return (
        <section className="py-24 bg-[#050505] text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-yellow-500 font-medium tracking-widest uppercase text-sm mb-4">Our Programs</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Select Your Batch</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Tailored curriculums for every stage of your A/L journey. Join the class that fits your exam year.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div key={course.year} className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-colors duration-300">
                            {/* Gradient Header */}
                            <div className={`h-2 bg-gradient-to-r ${course.color}`} />

                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-4xl font-bold font-serif text-white">{course.year}</h4>
                                        <p className="text-yellow-500 text-sm font-medium uppercase tracking-wider mt-1">{course.title}</p>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Users className="h-6 w-6 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-300 border border-white/10">
                                        {course.status}
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        {course.schedule}
                                    </div>
                                    <Link href="/login">
                                        <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full">
                                            Enroll
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
