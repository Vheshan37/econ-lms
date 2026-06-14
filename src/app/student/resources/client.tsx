"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Youtube,
  FileText,
  File,
  ClipboardList,
  Play,
  ExternalLink,
  BookOpen,
  Filter,
  Lock,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AlertDialog } from "@/components/ui/alert-dialog";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Resource {
  id: string;
  title: string;
  type: "VIDEO" | "PDF" | "PAST_PAPER" | "QUIZ";
  url: string;
  description: string | null;
  month: number | null;
  year: number | null;
  topicTitle: string;
  classTypeName: string;
  yearName: string;
  yearId: string;
  classTypeId: string;
  topicId: string;
  isPaid: boolean;
  isFree: boolean;
}

const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const TABS = [
  {
    id: "all",
    label: "All Resources",
    icon: BookOpen,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
  },
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

export default function ResourcesClient({
  resources,
}: {
  resources: Resource[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });
  const [paymentAlert, setPaymentAlert] = useState<{
    isOpen: boolean;
    monthName: string;
  }>({
    isOpen: false,
    monthName: "",
  });

  const uniqueYears = Array.from(new Set(resources.map((r) => r.yearId))).map(
    (id) => {
      const resource = resources.find((r) => r.yearId === id);
      return { id, name: resource?.yearName || "" };
    },
  );

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topicTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === "all" || resource.type === activeTab;
    const matchesYear =
      selectedYear === "all" || resource.yearId === selectedYear;
    return matchesSearch && matchesType && matchesYear;
  });

  /**
   * Handle resource click with payment check
   * - Free/Paid → open normally
   * - Locked → show payment alert
   */
  const handleResourceClick = (resource: Resource) => {
    if (!resource.isPaid && !resource.isFree) {
      const monthName =
        resource.month !== null && resource.month !== undefined
          ? MONTHS[Number(resource.month)]
          : "this month";
      setPaymentAlert({ isOpen: true, monthName });
      return;
    }

    if (resource.type === "VIDEO") {
      setVideoPlayer({
        isOpen: true,
        url: resource.url,
        title: resource.title,
      });
    } else {
      window.open(resource.url, "_blank");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <BookOpen className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                All Resources
              </h1>
              <p className="text-gray-400 text-lg">
                Browse all your learning materials in one place
                <span className="ml-3 text-[#D4AF37] font-medium">
                  {filteredResources.length} Found
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search and Year Filter */}
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-sm"
              >
                <option value="all">All Academic Years</option>
                {uniqueYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = resources.filter((r) =>
              tab.id === "all" ? true : r.type === tab.id,
            ).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] relative px-6 py-4 font-medium transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : ""}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? `${tab.bgColor} text-white`
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="resourceTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedYear + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredResources.length === 0 ? (
                <div className="text-center py-16">
                  <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">No resources found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((resource) => {
                    const isLocked = !resource.isPaid && !resource.isFree;
                    const monthName =
                      resource.month !== null && resource.month !== undefined
                        ? MONTHS[Number(resource.month)]
                        : null;

                    const videoId = resource.type === "VIDEO" ? getYouTubeVideoId(resource.url) : null;

                    return (
                      <div
                        key={resource.id}
                        onClick={() => handleResourceClick(resource)}
                        className={`group bg-gray-50 rounded-xl hover:shadow-md transition-all border cursor-pointer flex flex-col relative overflow-hidden ${
                          isLocked
                            ? "border-amber-200 hover:border-amber-400"
                            : "border-gray-100"
                        } ${
                          resource.type === "VIDEO" && videoId ? "h-[300px]" : "p-4"
                        }`}
                      >
                        {resource.type === "VIDEO" && videoId ? (
                          <>
                            {/* Image wrapper that shrinks on hover */}
                            <div className="absolute top-0 left-0 right-0 w-full h-full group-hover:h-[140px] transition-all duration-500 ease-in-out z-10 overflow-hidden bg-gray-900">
                              <img
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={resource.title}
                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                                  isLocked ? "opacity-60 saturate-50" : ""
                                }`}
                                loading="lazy"
                              />
                              {/* Icon Overlay (Play or Lock) */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                                {isLocked ? (
                                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
                                    <Lock className="w-5 h-5" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Badges Overlay */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  resource.isFree
                                    ? "bg-green-100 text-green-700"
                                    : resource.isPaid
                                      ? "bg-[#D4AF37]/10 text-[#D4AF37] backdrop-blur-xs"
                                      : "bg-amber-100 text-amber-700"
                                }`}>
                                  {resource.isFree
                                    ? "Free"
                                    : resource.isPaid
                                      ? "Premium"
                                      : "Locked"}
                                </span>
                                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                                  Video
                                </span>
                              </div>
                            </div>

                            {/* Sliding Text Content for Videos */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out border-t border-gray-100 flex flex-col justify-between h-[160px]">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1 text-sm">
                                  {resource.title}
                                </h3>
                                {resource.description && (
                                  <p className="text-gray-500 line-clamp-1 leading-relaxed text-xs mb-1.5">
                                    {resource.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1 mb-2">
                                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-600">
                                    {resource.yearName}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-600">
                                    {resource.classTypeName}
                                  </span>
                                  {monthName && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                      isLocked
                                        ? "bg-amber-50 border border-amber-200 text-amber-700"
                                        : "bg-gray-50 border border-gray-200 text-gray-600"
                                    }`}>
                                      <Calendar className="w-2.5 h-2.5" />
                                      {monthName}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-medium pt-1.5 border-t border-gray-100">
                                <span className="text-gray-400 truncate flex-1">
                                  {resource.topicTitle}
                                </span>
                                <span className={`flex items-center gap-1 shrink-0 ${
                                  isLocked ? "text-amber-600" : "text-[#D4AF37]"
                                }`}>
                                  {isLocked ? (
                                    <>
                                      <Lock className="w-3 h-3" /> Lock
                                    </>
                                  ) : (
                                    <>
                                      Watch
                                      <Play className="w-3 h-3" />
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Standard layout for non-video resources */
                          <>
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  resource.isFree
                                    ? "bg-green-100 text-green-700"
                                    : resource.isPaid
                                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                      : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {resource.isFree
                                  ? "Free"
                                  : resource.isPaid
                                    ? "Premium"
                                    : "Locked"}
                              </span>
                              {isLocked && (
                                <Lock className="w-3.5 h-3.5 text-amber-500" />
                              )}
                            </div>

                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#D4AF37] transition-colors">
                                    {resource.title}
                                  </h3>
                                </div>

                                {resource.description && (
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                    {resource.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-md text-gray-600">
                                    {resource.yearName}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-md text-gray-600">
                                    {resource.classTypeName}
                                  </span>
                                  {monthName && (
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                        isLocked
                                          ? "bg-amber-50 border border-amber-200 text-amber-700"
                                          : "bg-white border border-gray-200 text-gray-600"
                                      }`}
                                    >
                                      <Calendar className="w-3 h-3" />
                                      {monthName}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs font-medium pt-2 border-t border-gray-200">
                                  <span className="text-gray-400 truncate flex-1">
                                    {resource.topicTitle}
                                  </span>
                                  <span
                                    className={`flex items-center gap-1 shrink-0 ${
                                      isLocked ? "text-amber-600" : "text-[#D4AF37]"
                                    }`}
                                  >
                                    {isLocked ? (
                                      <>
                                        <Lock className="w-3 h-3" />
                                        Payment Required
                                      </>
                                    ) : (
                                      <>
                                        Open
                                        <ExternalLink className="w-3 h-3" />
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        videoUrl={videoPlayer.url}
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, url: "", title: "" })}
        title={videoPlayer.title}
      />

      <AlertDialog
        isOpen={paymentAlert.isOpen}
        onClose={() => setPaymentAlert({ isOpen: false, monthName: "" })}
        title="Payment Required"
        description={`Please complete your monthly payment for ${paymentAlert.monthName} to access this resource. Contact your institute administrator to make the payment.`}
        type="warning"
        confirmText="OK"
        cancelText="Cancel"
      />
    </div>
  );
}
