"use client";

import { useEffect, useState } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { getHallOfFame } from "@/lib/actions/hallOfFame";
import { getLandingPageContent } from "@/lib/actions/content";

interface Ranker {
    id: string;
    name: string;
    district: string;
    academicYear: string;
    islandRank: number | null;
    districtRank: number | null;
    imageUrl: string | null;
}

export function ResultsSection() {
    const [rankers, setRankers] = useState<Ranker[]>([]);
    const [stats, setStats] = useState({
        totalAPasses: '150+',
        passRate: '92%',
        districtRanks: '12',
        islandRanks: '3'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Hall of Fame data
                const alumniResult = await getHallOfFame();
                if (alumniResult.success && alumniResult.data) {
                    setRankers(alumniResult.data);
                }

                // Fetch stats
                const statsResult = await getLandingPageContent('hall-of-fame');
                if (statsResult.success && statsResult.data) {
                    setStats(prev => ({ ...prev, ...statsResult.data }));
                }
            } catch (error) {
                console.error("Failed to load hall of fame data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <section className="py-24 bg-[#0a0a0a] text-white relative flex items-center justify-center min-h-[600px]">
                <div className="text-[#fdf021]">Loading Hall of Fame...</div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[#0a0a0a] text-white relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-[#fdf021]/10 rounded-full mb-6">
                        <Trophy className="h-8 w-8 text-[#fdf021]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Hall of Fame</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        විශිෂ්ටත්වය සමරමු. අපගේ ගුරු ක්‍රමවේදයේ ඵලදායීතාව ඔප්පු කරමින්, අපගේ සිසුන් අඛණ්ඩව දිවයිනේ ඉහළම ශ්‍රේණි ලබා ගනී.
                    </p>
                </div>

                {rankers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {rankers.map((student, index) => (
                            <div key={student.id || index} className="flex flex-col items-center text-center group">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-[#fdf021] transition-colors duration-300 relative z-10">
                                        {student.imageUrl ? (
                                            <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl text-gray-400">
                                                {student.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-full bg-[#fdf021] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                    {(student.islandRank || student.districtRank) && (
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fdf021] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-20 whitespace-nowrap">
                                            {student.islandRank ? `Island ${student.islandRank}` : `District ${student.districtRank}`}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
                                <p className="text-sm text-gray-400">{student.district} District</p>
                                <p className="text-xs text-gray-500 mt-1">{student.academicYear}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No Hall of Fame records found.
                    </div>
                )}

                {/* View More Button */}
                <div className="flex justify-center mt-12">
                    <button className="group relative px-8 py-4 bg-linear-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105">
                        <span className="relative z-10 flex items-center gap-2">
                            View More Success Stories
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-gray-800 pt-12">
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            {stats.totalAPasses}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">A Passes (2023)</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            {stats.passRate}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">Pass Rate</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            {stats.districtRanks}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">District Ranks</p>
                    </div>
                    <div className="p-4">
                        <p className="text-4xl font-bold text-white mb-2">
                            {stats.islandRanks}
                        </p>
                        <p className="text-xs text-gray-500 uppercase">Island Ranks</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
