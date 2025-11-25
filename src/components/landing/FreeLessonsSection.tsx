"use client";

import { Play, FileText, BookOpen, ClipboardCheck, Download } from "lucide-react";

export function FreeLessonsSection() {
    const resources = [
        {
            icon: Play,
            title: "Video Lessons",
            count: "15+ Free Videos",
            description: "Watch comprehensive introductory lessons covering key Economics topics",
            bgColor: "from-red-500/10 to-red-600/10",
            iconColor: "text-red-500",
            borderColor: "border-red-500/20"
        },
        {
            icon: FileText,
            title: "Past Papers",
            count: "50+ Papers",
            description: "Access previous A/L Economics papers with detailed marking schemes",
            bgColor: "from-blue-500/10 to-blue-600/10",
            iconColor: "text-blue-500",
            borderColor: "border-blue-500/20"
        },
        {
            icon: BookOpen,
            title: "Study Materials",
            count: "30+ PDFs",
            description: "Download structured notes, summaries, and reference materials",
            bgColor: "from-green-500/10 to-green-600/10",
            iconColor: "text-green-500",
            borderColor: "border-green-500/20"
        },
        {
            icon: ClipboardCheck,
            title: "Practice Quizzes",
            count: "20+ Quizzes",
            description: "Test your knowledge with interactive quizzes and instant feedback",
            bgColor: "from-purple-500/10 to-purple-600/10",
            iconColor: "text-purple-500",
            borderColor: "border-purple-500/20"
        },
    ];

    return (
        <section className="py-24 bg-black text-white relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-semibold mb-6">
                        🎁 Free Resources
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Explore a Few Lessons Before You Join
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                        අපි ඔබට සුදුසුද යන්න විශ්වාස නැද්ද? එක්වීමට පෙර අපගේ නොමිලේ සම්පත් උත්සාහ කර අපගේ ගුරු කිරීමේ ගුණාත්මකභාවය අත්විඳින්න.
                    </p>
                </div>

                {/* Resource Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {resources.map((resource, idx) => (
                        <div
                            key={idx}
                            className={`group relative bg-gradient-to-br ${resource.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${resource.borderColor} hover:border-opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-black/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <resource.icon className={`w-7 h-7 ${resource.iconColor}`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                {resource.title}
                            </h3>
                            <div className={`inline-block px-3 py-1 ${resource.iconColor} bg-white/10 rounded-full text-xs font-semibold mb-3`}>
                                {resource.count}
                            </div>
                            <p className="text-gray-400 text-sm">
                                {resource.description}
                            </p>

                            {/* Hover Arrow */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className={`w-8 h-8 rounded-full ${resource.iconColor} bg-white/10 flex items-center justify-center`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Content Preview */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Video Preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                        <div className="aspect-video bg-gradient-to-br from-red-900/20 to-black rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
                            <div className="relative w-16 h-16 rounded-full bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                        </div>
                        <h4 className="font-bold text-white mb-2">Introduction to Microeconomics</h4>
                        <p className="text-sm text-gray-400 mb-3">45 min • Beginner Level</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <span>👁️</span>
                                <span>2.5k views</span>
                            </div>
                            <span>•</span>
                            <span>⭐ 4.9/5</span>
                        </div>
                    </div>

                    {/* Document Preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-black rounded-xl mb-4 flex items-center justify-center relative overflow-hidden p-4">
                            <div className="text-center">
                                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                <div className="space-y-1">
                                    <div className="h-1 bg-gray-700 rounded w-full" />
                                    <div className="h-1 bg-gray-700 rounded w-4/5 mx-auto" />
                                    <div className="h-1 bg-gray-700 rounded w-full" />
                                </div>
                            </div>
                        </div>
                        <h4 className="font-bold text-white mb-2">2023 A/L Past Paper</h4>
                        <p className="text-sm text-gray-400 mb-3">With marking scheme</p>
                        <button className="flex items-center gap-2 text-blue-500 text-sm font-semibold group-hover:gap-3 transition-all">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>

                    {/* Quiz Preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-black rounded-xl mb-4 flex items-center justify-center">
                            <div className="text-center">
                                <ClipboardCheck className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">15</div>
                                <div className="text-xs text-gray-400">Questions</div>
                            </div>
                        </div>
                        <h4 className="font-bold text-white mb-2">Supply & Demand Quiz</h4>
                        <p className="text-sm text-gray-400 mb-3">20 min • Multiple Choice</p>
                        <button className="w-full py-2 bg-purple-500/20 text-purple-500 rounded-lg font-semibold text-sm group-hover:bg-purple-500/30 transition-colors">
                            Start Quiz
                        </button>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <button className="group relative px-10 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:scale-105">
                        <span className="relative z-10 flex items-center gap-2">
                            Browse All Free Resources
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    <p className="text-gray-500 text-sm mt-4">No registration required • Instant access</p>
                </div>
            </div>
        </section>
    );
}
