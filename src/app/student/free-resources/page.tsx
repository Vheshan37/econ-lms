'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, FileText, File, ClipboardList, BookOpen, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFreeResources } from '@/lib/actions/freeResource';
import { incrementFreeResourceView } from '@/lib/actions/freeResource';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ResourceType } from '@prisma/client';

interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    description: string | null;
    level: string;
    views: number;
}

const TABS = [
    { id: 'VIDEO', label: 'Videos', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'PDF', label: 'PDFs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'PAST_PAPER', label: 'Past Papers', icon: File, color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { id: 'QUIZ', label: 'Quizzes', icon: ClipboardList, color: 'text-green-500', bgColor: 'bg-green-500' },
];

export default function StudentFreeResourcesPage() {
    const [alResources, setAlResources] = useState<Resource[]>([]);
    const [olResources, setOlResources] = useState<Resource[]>([]);
    const [activeTab, setActiveTab] = useState<ResourceType>('VIDEO');
    const [isLoading, setIsLoading] = useState(true);
    const [videoPlayer, setVideoPlayer] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: '',
        title: ''
    });

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                const [alResult, olResult] = await Promise.all([
                    getFreeResources("Advanced Level"),
                    getFreeResources("Ordinary Level")
                ]);

                if (alResult.success && alResult.data) {
                    setAlResources(alResult.data);
                }
                if (olResult.success && olResult.data) {
                    setOlResources(olResult.data);
                }
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    const allResources = [...alResources, ...olResources];
    const filteredResources = allResources.filter(r => r.type === activeTab);

    const handleResourceClick = async (resource: Resource) => {
        // Increment view count
        await incrementFreeResourceView(resource.id);

        if (resource.type === 'VIDEO') {
            // Open in embedded video player
            setVideoPlayer({
                isOpen: true,
                url: resource.url,
                title: resource.title
            });
        } else {
            // Open PDFs and other resources in same tab
            window.location.href = resource.url;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Free Resources</h1>
                            <p className="text-gray-400">Access free study materials for A/L and O/L</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const count = allResources.filter(r => r.type === tab.id).length;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ResourceType)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-[#1a1a1a]'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                            {tab.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-200' : 'bg-gray-100'
                                }`}>
                                {count}
                            </span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading resources...</div>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} available yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredResources.map((resource, index) => {
                            const tabInfo = TABS.find(t => t.id === resource.type);
                            const Icon = tabInfo?.icon || FileText;
                            return (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    onClick={() => handleResourceClick(resource)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${tabInfo?.bgColor} bg-opacity-10`}>
                                            <Icon className={`w-6 h-6 ${tabInfo?.color}`} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                {resource.level === "Advanced Level" ? "A/L" : "O/L"}
                                            </span>
                                            {resource.type === 'VIDEO' && (
                                                <div className="p-2 bg-red-500/10 rounded-full">
                                                    <Play className="w-4 h-4 text-red-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                                    {resource.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{resource.views} views</span>
                                        <div className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B5952F] font-medium">
                                            {resource.type === 'VIDEO' ? 'Watch Now' : 'View Resource'}
                                            {resource.type === 'VIDEO' ? (
                                                <Play className="w-4 h-4" />
                                            ) : (
                                                <ExternalLink className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Video Player Modal */}
            <VideoPlayer
                videoUrl={videoPlayer.url}
                isOpen={videoPlayer.isOpen}
                onClose={() => setVideoPlayer({ isOpen: false, url: '', title: '' })}
                title={videoPlayer.title}
            />
        </div>
    );
}
