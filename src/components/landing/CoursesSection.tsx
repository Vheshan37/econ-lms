"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EnrollmentModal } from "./EnrollmentModal";

// Define types to match Prisma output (or partial)
export interface AcademicYearWithClasses {
    id: string;
    year: string;
    description: string | null;
    classTypes: {
        name: string;
    }[];
}

interface CoursesSectionProps {
    years: AcademicYearWithClasses[];
    whatsappNumber: string;
}

export function CoursesSection({ years, whatsappNumber }: CoursesSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<string>("");

    const handleEnroll = (batch: string) => {
        setSelectedBatch(batch);
        setIsModalOpen(true);
    };

    // Helper to get color based on index or year (to match original design)
    const getColors = (index: number) => {
        const colors = [
            "from-yellow-600 to-yellow-800", // 2025
            "from-blue-600 to-blue-800",     // 2026
            "from-purple-600 to-purple-800"  // 2027
        ];
        return colors[index % colors.length];
    };

    return (
        <section id="courses" className="py-24 bg-[#050505] text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-yellow-500 font-medium tracking-widest uppercase text-sm mb-4">Our Programs</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Select Your Batch</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        ඔබගේ උ.පෙ. ගමනේ සෑම අදියරක් සඳහාම සකස්  කරන ලද විෂය මාලාව. ඔබගේ විභාග වර්ෂයට ගැලපෙන පන්තියට එක්වන්න.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {years.map((year, index) => {
                        // Construct status string from classTypes
                        const classNames = year.classTypes.map(c => c.name);
                        let status = "Classes Available";

                        if (classNames.length > 0) {
                            if (classNames.length === 1) {
                                status = classNames[0];
                            } else {
                                const last = classNames.pop();
                                status = `${classNames.join(", ")} & ${last}`;
                            }
                        }

                        const color = getColors(index);

                        return (
                            <div key={year.id} className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-colors duration-300">
                                {/* Gradient Header */}
                                <div className={`h-2 bg-linear-to-r ${color}`} />

                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* Assuming year string is like "2025", but if user stored "2025 A/L" or similar we might need to display it as is or parse it. 
                                                The seed used "2025", "2026" etc. so it should be fine. */}
                                            <h4 className="text-4xl font-bold font-serif text-white">{year.year}</h4>
                                            <p className="text-yellow-500 text-sm font-medium uppercase tracking-wider mt-1">Advanced Level</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Users className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-300 border border-white/10">
                                            {status || "Classes Available"}
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {year.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                                        {/* Spacer */}
                                        <div />

                                        <Button
                                            size="sm"
                                            className="bg-white text-black hover:bg-gray-200 rounded-full cursor-pointer"
                                            onClick={() => handleEnroll(year.year)}
                                        >
                                            Enroll
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <EnrollmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                batch={selectedBatch}
                whatsappNumber={whatsappNumber}
            />
        </section>
    );
}
