"use client";

import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { Play, FileText, ClipboardCheck, Search, Filter, Download, ArrowRight, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dummy Data
const resources = [
    {
        id: 1,
        type: "video",
        title: "Introduction to Microeconomics",
        description: "Understanding the fundamental concepts of supply, demand, and market equilibrium.",
        duration: "45 min",
        level: "Beginner",
        views: "2.5k",
        rating: "4.9",
        thumbnail: "bg-red-100 text-red-600",
        icon: Play,
    },
    {
        id: 2,
        type: "paper",
        title: "2023 A/L Economics Past Paper",
        description: "Complete past paper with detailed marking scheme and examiner comments.",
        pages: "12 Pages",
        year: "2023",
        downloads: "1.2k",
        thumbnail: "bg-blue-100 text-blue-600",
        icon: FileText,
    },
    {
        id: 3,
        type: "quiz",
        title: "Market Structures Quiz",
        description: "Test your knowledge on Perfect Competition, Monopoly, and Oligopoly.",
        questions: "20 Qs",
        time: "30 min",
        attempts: "850+",
        thumbnail: "bg-purple-100 text-purple-600",
        icon: ClipboardCheck,
    },
    {
        id: 4,
        type: "video",
        title: "National Accounting Basics",
        description: "A comprehensive guide to GDP, GNP, and other national income measures.",
        duration: "60 min",
        level: "Intermediate",
        views: "1.8k",
        rating: "4.8",
        thumbnail: "bg-red-100 text-red-600",
        icon: Play,
    },
    {
        id: 5,
        type: "note",
        title: "Elasticity of Demand Notes",
        description: "Concise summary notes covering Price, Income, and Cross Elasticity.",
        format: "PDF",
        pages: "5 Pages",
        downloads: "900+",
        thumbnail: "bg-green-100 text-green-600",
        icon: BookOpen,
    },
    {
        id: 6,
        type: "paper",
        title: "2022 A/L Economics Past Paper",
        description: "Previous year paper to practice time management and question patterns.",
        pages: "14 Pages",
        year: "2022",
        downloads: "2.1k",
        thumbnail: "bg-blue-100 text-blue-600",
        icon: FileText,
    },
];

const tabs = [
    { id: "all", label: "All Resources" },
    { id: "video", label: "Video Lessons" },
    { id: "paper", label: "Past Papers" },
    { id: "quiz", label: "Quizzes" },
    { id: "note", label: "Study Notes" },
];

export default function FreeResourcesPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = resources.filter((resource) => {
        const matchesTab = activeTab === "all" || resource.type === activeTab;
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
            {/* Navigation */}
            <Navbar />

            <main className="pb-24">
                {/* Hero Section */}
                <section className="bg-black pt-20 pb-12 border-b border-white/5 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black pointer-events-none" />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-bold tracking-wide mb-6 uppercase border border-yellow-500/20">
                                Knowledge Hub
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                                Free <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-yellow-600">Learning Resources</span>
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                Unlock your potential with our curated collection of video lessons, past papers,
                                and interactive quizzes. Completely free, no strings attached.
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for topics, papers, or lessons..."
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all shadow-lg shadow-black/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Filter Tabs */}
                <section className="sticky top-[80px] z-40 bg-black/80 backdrop-blur-md py-6 border-b border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${activeTab === tab.id
                                        ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-105"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resources Grid */}
                <section className="container mx-auto px-4 py-12">
                    {filteredResources.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10">
                                <Filter className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No resources found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                                className="mt-6 text-yellow-500 font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {filteredResources.map((resource) => (
                                    <motion.div
                                        key={resource.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-900/10"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.thumbnail.replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-opacity-90 text-')}`}>
                                                    <resource.icon className="w-6 h-6" />
                                                </div>
                                                <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-gray-400 uppercase tracking-wider border border-white/5">
                                                    {resource.type}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors line-clamp-2">
                                                {resource.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                {resource.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                    {resource.duration && <span>⏱ {resource.duration}</span>}
                                                    {resource.pages && <span>📄 {resource.pages}</span>}
                                                    {resource.questions && <span>❓ {resource.questions}</span>}
                                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                    <span>{resource.level || resource.year || resource.attempts || "Free"}</span>
                                                </div>

                                                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                                    {resource.type === 'paper' || resource.type === 'note' ? (
                                                        <Download className="w-4 h-4" />
                                                    ) : (
                                                        <ArrowRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </section>

                {/* Bottom CTA */}
                <section className="container mx-auto px-4 mt-12 mb-12">
                    <div className="bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Ready to dive deeper?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                            Join our full course to access hundreds of premium lessons, live classes, and personalized support.
                        </p>
                        <a href="/#courses" className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors relative z-10">
                            View Premium Courses
                        </a>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
}
