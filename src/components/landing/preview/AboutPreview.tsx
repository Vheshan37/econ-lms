"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AboutPreviewProps {
    data: {
        sectionSubtitle: string;
        sectionTitle: string;
        secondarySubtitle: string;
        description: string;
        features: string[];
        quote: string;
        quoteAuthor: string;
        videoUrl: string;
    };
}

export function AboutPreview({ data }: AboutPreviewProps) {
    return (
        <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-[#fdf021] font-medium tracking-widest uppercase text-sm mb-4">
                        {data.sectionSubtitle || "About The Mentor"}
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        {data.sectionTitle || "Why Choose Quality Econ?"}
                    </h3>
                    <div className="w-24 h-1 bg-[#fdf021] mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl relative group cursor-pointer">
                            {data.videoUrl ? (
                                <video src={data.videoUrl} className="w-full h-full object-cover" controls />
                            ) : (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                                        <div className="w-20 h-20 bg-[#fdf021] rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                        <p className="font-bold text-lg">Classroom Experience</p>
                                        <p className="text-sm text-gray-400">Watch how we make Economics simple</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Decorative dots */}
                        <div className="absolute -bottom-8 -left-8 grid grid-cols-6 gap-2 opacity-20">
                            {[...Array(24)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-[#fdf021] rounded-full" />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h4 className="text-3xl font-bold text-white">
                            {data.secondarySubtitle || "සංකීර්ණතාවය සරල බවට පරිවර්තනය කිරීම"}
                        </h4>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {data.description || "දශකයකට වැඩි ගුරු අත්දැකීම් සහිතව, අපි සංකීර්ණ ආර්ථික න්‍යායන් පහසුවෙන් තේරුම් ගත හැකි, සැබෑ ලෝක සංකල්ප බවට බිඳ දමන අද්විතීය ක්‍රමවේදයක් වර්ධනය කර ඇත."}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(data.features.length > 0 ? data.features : ["Comprehensive Theory Coverage", "Past Paper Analysis", "Real-world Economic Examples", "Personalized Attention"]).map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-[#fdf021] h-5 w-5 flex-shrink-0" />
                                    <span className="text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {(data.quote || data.quoteAuthor) && (
                            <div className="pt-6">
                                <div className="p-6 bg-gray-900 rounded-xl border-l-4 border-[#fdf021]">
                                    <p className="italic text-gray-300">
                                        {data.quote || "\"ආර්ථික විද්‍යාව සෑම තැනකම පවතී, එය තේරුම් ගැනීම ලෝකය තේරුම් ගැනීමයි.\""}
                                    </p>
                                    <p className="mt-4 font-bold text-[#fdf021]">
                                        - {data.quoteAuthor || "Krishan Kasthuriarachchi"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
