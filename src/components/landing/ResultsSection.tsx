"use client";

import { Trophy, ChevronRight } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

export function ResultsSection() {
    const rankers = [
        { name: "Kasun Perera", rank: "Island 1st", district: "Colombo", year: "2023", image: "https://placehold.co/100x100/333/FFF?text=K" },
        { name: "Amaya Silva", rank: "Island 3rd", district: "Gampaha", year: "2023", image: "https://placehold.co/100x100/333/FFF?text=A" },
        { name: "Nimali De Silva", rank: "Island 5th", district: "Kandy", year: "2022", image: "https://placehold.co/100x100/333/FFF?text=N" },
        { name: "Ruwan Fernando", rank: "Island 9th", district: "Galle", year: "2022", image: "https://placehold.co/100x100/333/FFF?text=R" },
        { name: "Sanduni Wickramasinghe", rank: "Island 7th", district: "Kurunegala", year: "2023", image: "https://placehold.co/100x100/333/FFF?text=S" },
        { name: "Tharindu Jayawardena", rank: "Island 12th", district: "Colombo", year: "2022", image: "https://placehold.co/100x100/333/FFF?text=T" },
        { name: "Chathurika Bandara", rank: "Island 15th", district: "Ratnapura", year: "2023", image: "https://placehold.co/100x100/333/FFF?text=C" },
        { name: "Dinesh Rajapaksha", rank: "Island 18th", district: "Matara", year: "2022", image: "https://placehold.co/100x100/333/FFF?text=D" },
    ];

    return (
        <section className="py-24 bg-[#0a0a0a] text-white relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-6">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Hall of Fame</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Celebrating excellence. Our students consistently secure top island ranks, proving the effectiveness of our teaching methodology.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {rankers.map((student, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-yellow-500 transition-colors duration-300 relative z-10">
                                    <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-yellow-500 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20">
                                    {student.rank}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
                            <p className="text-sm text-gray-400">{student.district} District</p>
                            <p className="text-xs text-gray-500 mt-1">{student.year} A/L</p>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="flex justify-center mt-12">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105">
                        <span className="relative z-10 flex items-center gap-2">
                            View More Success Stories
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-gray-800 pt-12">
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            <CountUp end={150} suffix="+" />
                        </p>
                        <p className="text-xs text-gray-500 uppercase">A Passes (2023)</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            <CountUp end={92} suffix="%" />
                        </p>
                        <p className="text-xs text-gray-500 uppercase">Pass Rate</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            <CountUp end={12} />
                        </p>
                        <p className="text-xs text-gray-500 uppercase">District Ranks</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            <CountUp end={3} />
                        </p>
                        <p className="text-xs text-gray-500 uppercase">Island Ranks</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
