"use client";

import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { Play, FileText, ClipboardCheck, Search, Filter, ArrowRight, BookOpen, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { incrementFreeResourceView } from "@/lib/actions/freeResource";
import Link from "next/link";

// Helper to extract YouTube ID from various URL formats
const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to convert document URLs to embeddable formats
const getEmbeddableUrl = (url: string) => {
    if (!url) return '';

    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
        // Try to extract the file ID
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
        }
    }

    // Return original URL for direct links (e.g. domain.com/file.pdf)
    return url;
};

// Map DB types to UI Icons and Styles
const getResourceIcon = (type: string) => {
    switch (type) {
        case 'VIDEO': return Play;
        case 'PAST_PAPER': return FileText;
        case 'QUIZ': return ClipboardCheck;
        case 'PDF': return BookOpen;
        default: return FileText;
    }
};

const getResourceStyle = (type: string) => {
    switch (type) {
        case 'VIDEO': return "bg-red-500/10 text-red-500";
        case 'PAST_PAPER': return "bg-blue-500/10 text-blue-500";
        case 'QUIZ': return "bg-purple-500/10 text-purple-500";
        case 'PDF': return "bg-green-500/10 text-green-500";
        default: return "bg-gray-500/10 text-gray-500";
    }
};

const tabs = [
    { id: "all", label: "All Resources" },
    { id: "VIDEO", label: "Video Lessons" },
    { id: "PAST_PAPER", label: "Past Papers" },
    { id: "QUIZ", label: "Quizzes" },
    { id: "PDF", label: "Study Notes" },
];

export interface Resource {
    id: string;
    title: string;
    description: string | null;
    type: string;
    url: string;
    views: number;
}

interface FreeResourcesClientProps {
    isHallOfFameEnabled: boolean;
    initialResources: Resource[];
}

// Isolated Modal Component
function ResourceModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
    // Basic ESC key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Simple Render Logic
    const renderContent = () => {
        if (resource.type === 'VIDEO') {
            const videoId = getYouTubeVideoId(resource.url);
            if (!videoId) return <div className="p-8 text-center text-red-500">Invalid Video URL</div>;
            return (
                <div className="w-full h-full bg-black">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={resource.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        if (resource.type === 'PDF' || resource.type === 'PAST_PAPER') {
            const embedUrl = getEmbeddableUrl(resource.url);
            return (
                <div className="w-full h-full bg-white relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-0">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    </div>
                    <iframe
                        key={resource.id} // Force re-render on new resource
                        src={embedUrl}
                        className="w-full h-full relative z-10 border-none"
                        title={resource.title}
                    />
                </div>
            );
        }

        if (resource.type === 'QUIZ') {
            return (
                <div className="w-full h-full bg-white">
                    <iframe
                        src={resource.url}
                        className="w-full h-full border-none"
                        title={resource.title}
                    />
                </div>
            );
        }

        return <div className="p-8 text-center text-gray-400">Resource not supported</div>;
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            {/* Master Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="fixed top-6 right-6 z-[210] p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Close (ESC)"
            >
                <X className="w-6 h-6" />
            </button>

            <div
                className="relative w-full max-w-6xl h-[85vh] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#111]">
                    <h3 className="text-lg font-bold text-white truncate max-w-[80%]">
                        {resource.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-black overflow-hidden relative">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default function FreeResourcesClient({ isHallOfFameEnabled, initialResources }: FreeResourcesClientProps) {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [resources] = useState<Resource[]>(initialResources);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    const handleResourceClick = (resource: Resource) => {
        incrementFreeResourceView(resource.id);
        setSelectedResource(resource);
    };

    const filteredResources = resources.filter((resource) => {
        const matchesTab = activeTab === "all" || resource.type === activeTab;
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
            <Navbar isHallOfFameEnabled={isHallOfFameEnabled} />

            <main className="pb-24">
                {/* Hero Section */}
                <section className="bg-black pt-20 pb-12 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black pointer-events-none" />
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
                                {filteredResources.map((resource) => {
                                    const Icon = getResourceIcon(resource.type);
                                    const styleClass = getResourceStyle(resource.type);

                                    return (
                                        <motion.div
                                            key={resource.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => handleResourceClick(resource)}
                                            className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-yellow-900/10 cursor-pointer"
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styleClass}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-gray-400 uppercase tracking-wider border border-white/5">
                                                        {resource.type.replace('_', ' ')}
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
                                                        <span>👁 {resource.views || 0} views</span>
                                                    </div>

                                                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                                        {resource.type === 'PAST_PAPER' || resource.type === 'PDF' ? (
                                                            <Download className="w-4 h-4" />
                                                        ) : resource.type === 'VIDEO' ? (
                                                            <Play className="w-4 h-4 fill-current" />
                                                        ) : (
                                                            <ArrowRight className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </section>

                <section className="container mx-auto px-4 mt-12 mb-12">
                    <div className="bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Ready to dive deeper?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                            Join our full course to access hundreds of premium lessons, live classes, and personalized support.
                        </p>
                        <Link href="/#courses" className="inline-flex items-center justify-center px-8 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors relative z-10">
                            View Premium Courses
                        </Link>
                    </div>
                </section>
            </main>

            <FooterSection />

            {/* Clean Modal Implementation */}
            {selectedResource && (
                <ResourceModal
                    resource={selectedResource}
                    onClose={() => setSelectedResource(null)}
                />
            )}
        </div>
    );
}
