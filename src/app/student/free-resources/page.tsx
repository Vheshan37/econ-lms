"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  FileText,
  File,
  ClipboardList,
  BookOpen,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFreeResources } from "@/lib/actions/freeResource";
import { incrementFreeResourceView } from "@/lib/actions/freeResource";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ResourceType } from "@prisma/client";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string | null;
  level: string;
  views: number;
}

const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const TABS = [
  {
    id: "VIDEO",
    label: "Videos",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    id: "PDF",
    label: "PDFs",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    id: "PAST_PAPER",
    label: "Past Papers",
    icon: File,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    id: "QUIZ",
    label: "Quizzes",
    icon: ClipboardList,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
];

export default function StudentFreeResourcesPage() {
  const [alResources, setAlResources] = useState<Resource[]>([]);
  const [olResources, setOlResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<ResourceType>("VIDEO");
  const [isLoading, setIsLoading] = useState(true);
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const [alResult, olResult] = await Promise.all([
          getFreeResources("Advanced Level"),
          getFreeResources("Ordinary Level"),
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
  const filteredResources = allResources.filter((r) => r.type === activeTab);

  const handleResourceClick = async (resource: Resource) => {
    // Increment view count
    await incrementFreeResourceView(resource.id);

    if (resource.type === "VIDEO") {
      // Open in embedded video player
      setVideoPlayer({
        isOpen: true,
        url: resource.url,
        title: resource.title,
      });
    } else {
      // Open PDFs and other resources in same tab
      window.location.href = resource.url;
    }
  };

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg flex-shrink-0">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                Free Resources
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Access free study materials for A/L and O/L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = allResources.filter((r) => r.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ResourceType)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-6 sm:py-3 font-medium transition-all relative whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? "text-[#1a1a1a]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${activeTab === tab.id ? tab.color : ""}`}
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
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
          <p className="text-gray-500">
            No {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}{" "}
            available yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map((resource, index) => {
              const getCardThumbnail = (type: string, url: string) => {
                if (type === "VIDEO") {
                  const id = getYouTubeVideoId(url);
                  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/resource/learning-material.png";
                }
                if (type === "PAST_PAPER") return "/resource/past-papers.png";
                if (type === "QUIZ") return "/resource/quizzes.png";
                if (type === "PDF") return "/resource/learning-material.png";
                return "/resource/learning-material.png";
              };
              const thumbnailUrl = getCardThumbnail(resource.type, resource.url);

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-[280px] overflow-hidden"
                  onClick={() => handleResourceClick(resource)}
                >
                  {/* Image wrapper that shrinks on hover */}
                  <div className="absolute top-0 left-0 right-0 w-full h-full group-hover:h-[150px] transition-all duration-500 ease-in-out z-10 overflow-hidden bg-gray-900">
                    <img
                      src={thumbnailUrl}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                        {resource.type === "VIDEO" ? (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        ) : resource.type === "PAST_PAPER" || resource.type === "PDF" ? (
                          <Download className="w-5 h-5" />
                        ) : (
                          <ExternalLink className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/95 text-gray-800 font-medium shadow-xs">
                        {resource.level === "Advanced Level" ? "A/L" : "O/L"}
                      </span>
                      <span className={`px-2 py-0.5 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-xs border ${
                        resource.type === "VIDEO"
                          ? "bg-red-600 border-red-500/20"
                          : resource.type === "PAST_PAPER"
                            ? "bg-blue-600 border-blue-500/20"
                            : resource.type === "QUIZ"
                              ? "bg-purple-600 border-purple-500/20"
                              : "bg-green-600 border-green-500/20"
                      }`}>
                        {resource.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Sliding Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-4 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out border-t border-gray-100 flex flex-col justify-between h-[130px]">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1 text-base">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <p className="text-gray-600 line-clamp-2 leading-relaxed text-xs">
                          {resource.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {resource.views} views
                      </span>
                      <div className="inline-flex items-center gap-1 text-sm text-[#D4AF37] font-medium">
                        {resource.type === "VIDEO" ? "Watch Now" : "View Resource"}{" "}
                        {resource.type === "VIDEO" ? (
                          <Play className="w-3.5 h-3.5" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                      </div>
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
        onClose={() => setVideoPlayer({ isOpen: false, url: "", title: "" })}
        title={videoPlayer.title}
      />
    </div>
  );
}
