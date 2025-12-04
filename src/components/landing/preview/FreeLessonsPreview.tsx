"use client";

import { BookOpen, FileText, Play, ClipboardCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FreeLessonsPreviewProps {
    data: {
        subtitle: string;
        title: string;
        description: string;
        ctaText: string;
        ctaNote: string;
        categories: Array<{ title: string; count: string; description: string }>;
        featuredVideo: { title: string; duration: string; views: string };
        featuredDoc: { title: string; subtitle: string };
        featuredQuiz: { title: string; duration: string; questionCount: string };
    };
    freeResources: any[];
}

export function FreeLessonsPreview({ data, freeResources }: FreeLessonsPreviewProps) {
    const categoryIcons = [Play, FileText, BookOpen, ClipboardCheck];

    return (
        <section className="py-24 bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
                        {data.subtitle || "Free Resources"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        {data.title || "Explore Before You Join"}
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6" />
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {data.description || "නොමිලේ සම්පත් සමඟ අපගේ ඉගැන්වීමේ ක්‍රමවේදය අත්විඳින්න"}
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {data.categories.map((category, index) => {
                        const Icon = categoryIcons[index] || BookOpen;
                        return (
                            <div
                                key={index}
                                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 group"
                            >
                                <Icon className="w-10 h-10 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                <p className="text-yellow-500 font-semibold mb-2">{category.count}</p>
                                <p className="text-gray-400 text-sm">{category.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Featured Resources */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Featured Video */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                        <div className="aspect-video bg-gray-800 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-750 transition-colors">
                            <Play className="w-16 h-16 text-yellow-500" />
                        </div>
                        <h4 className="font-bold text-white mb-2">{data.featuredVideo.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{data.featuredVideo.duration}</span>
                            <span>•</span>
                            <span>{data.featuredVideo.views}</span>
                        </div>
                    </div>

                    {/* Featured Document */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer">
                        <div className="aspect-video bg-gray-800 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-750 transition-colors">
                            <FileText className="w-16 h-16 text-yellow-500" />
                        </div>
                        <h4 className="font-bold text-white mb-2">{data.featuredDoc.title}</h4>
                        <p className="text-sm text-gray-400">{data.featuredDoc.subtitle}</p>
                    </div>

                    {/* Featured Quiz */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer">
                        <div className="aspect-video bg-gray-800 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-750 transition-colors">
                            <ClipboardCheck className="w-16 h-16 text-yellow-500" />
                        </div>
                        <h4 className="font-bold text-white mb-2">{data.featuredQuiz.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{data.featuredQuiz.duration}</span>
                            <span>•</span>
                            <span>{data.featuredQuiz.questionCount}</span>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/login">
                        <Button size="lg" className="group relative px-10 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:scale-105">
                            <span className="relative z-10 flex items-center gap-2">
                                {data.ctaText || "Start Learning Now"}
                                <ArrowRight className="w-5 h-5" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </Link>
                    <p className="text-gray-500 text-sm mt-4">{data.ctaNote || "No credit card required"}</p>
                </div>
            </div>
        </section>
    );
}
