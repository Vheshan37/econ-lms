"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Monitor,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  Search,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Updated type to handle sessions properly
type OnlineClass = {
  id: number;
  youtubeLink: string | null;
  youtubeTime: string | null;
  zoomLink: string | null;
  zoomTime: string | null;
  zoomId: string | null;
  zoomPasscode: string | null;
  classTypes: string[];
  classTypesDetails: Array<{
    id: string;
    name: string;
    year: {
      id: string;
      year: string;
    };
  }>;
};

// Session type for flattened view
type Session = {
  id: string;
  classId: number;
  platform: "youtube" | "zoom";
  time: Date;
  link: string;
  zoomId?: string | null;
  zoomPasscode?: string | null;
  classTypesDetails: OnlineClass["classTypesDetails"];
};

type TabType = "all" | "youtube" | "zoom";

const TABS = [
  {
    id: "all",
    label: "All Classes",
    icon: BookOpen,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    id: "zoom",
    label: "Zoom",
    icon: Monitor,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
];

// Helper function to get day label
const getDayLabel = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const dayAfter = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2,
  );

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  if (date.toDateString() === dayAfter.toDateString())
    return date.toLocaleDateString("en-US", { weekday: "long" });

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

// Format time display
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OnlineClassesClient({
  initialClasses,
}: {
  initialClasses: OnlineClass[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Flatten classes into individual sessions (one per platform per time)
  const allSessions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const sessions: Session[] = [];

    for (const cls of initialClasses) {
      // Add YouTube session if available
      if (cls.youtubeLink && cls.youtubeTime) {
        const youtubeTime = new Date(cls.youtubeTime);
        if (youtubeTime >= startOfToday) {
          sessions.push({
            id: `${cls.id}-youtube`,
            classId: cls.id,
            platform: "youtube",
            time: youtubeTime,
            link: cls.youtubeLink,
            classTypesDetails: cls.classTypesDetails,
          });
        }
      }

      // Add Zoom session if available (completely independent)
      if (cls.zoomLink && cls.zoomTime) {
        const zoomTime = new Date(cls.zoomTime);
        if (zoomTime >= startOfToday) {
          sessions.push({
            id: `${cls.id}-zoom`,
            classId: cls.id,
            platform: "zoom",
            time: zoomTime,
            link: cls.zoomLink,
            zoomId: cls.zoomId,
            zoomPasscode: cls.zoomPasscode,
            classTypesDetails: cls.classTypesDetails,
          });
        }
      }
    }

    // Sort by time (earliest first)
    sessions.sort((a, b) => a.time.getTime() - b.time.getTime());
    return sessions;
  }, [initialClasses]);

  // Filter sessions based on search and tab
  const filteredSessions = useMemo(() => {
    let filtered = allSessions;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((session) => {
        const classTypeNames = session.classTypesDetails
          .map((ct) => ct.name)
          .join(" ");
        const yearNames = session.classTypesDetails
          .map((ct) => ct.year.year)
          .join(" ");
        return (
          classTypeNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
          yearNames.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by platform tab
    if (activeTab === "youtube") {
      filtered = filtered.filter((session) => session.platform === "youtube");
    } else if (activeTab === "zoom") {
      filtered = filtered.filter((session) => session.platform === "zoom");
    }

    return filtered;
  }, [allSessions, searchQuery, activeTab]);

  // Reset scroll position when filters change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery, activeTab]);

  // Render session card
  const renderSessionCard = (session: Session) => {
    const dayLabel = getDayLabel(session.time);
    const formattedTime = formatTime(session.time);
    const formattedDate = session.time.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <div
        key={session.id}
        className="group bg-gray-50 rounded-xl hover:shadow-lg transition-all border border-gray-100 hover:border-[#D4AF37]/30 overflow-hidden"
      >
        {/* Header with Day Label */}
        <div
          className={`px-4 py-2 border-b ${
            dayLabel === "Today"
              ? "bg-red-50 border-red-100"
              : dayLabel === "Tomorrow"
                ? "bg-amber-50 border-amber-100"
                : "bg-blue-50 border-blue-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar
                className={`w-4 h-4 ${
                  dayLabel === "Today"
                    ? "text-red-500"
                    : dayLabel === "Tomorrow"
                      ? "text-amber-500"
                      : "text-blue-500"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  dayLabel === "Today"
                    ? "text-red-700"
                    : dayLabel === "Tomorrow"
                      ? "text-amber-700"
                      : "text-blue-700"
                }`}
              >
                {dayLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-600">{formattedTime}</span>
              {dayLabel !== "Today" && dayLabel !== "Tomorrow" && (
                <span className="text-xs text-gray-400 ml-1">
                  ({formattedDate})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Platform Badge */}
          <div className="flex items-center gap-2 mb-4">
            {session.platform === "youtube" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-200">
                <Video className="w-3.5 h-3.5" />
                YouTube Session • {formattedTime}
              </span>
            )}
            {session.platform === "zoom" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-200">
                <Monitor className="w-3.5 h-3.5" />
                Zoom Session • {formattedTime}
              </span>
            )}
          </div>

          {/* Class Types */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-semibold text-gray-900">Classes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.classTypesDetails.map((ct) => (
                <div key={ct.id} className="group/ct relative">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-700">
                    <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                    {ct.name}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/ct:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {ct.year.year}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link Section */}
          <div className="space-y-3 mb-4">
            {session.platform === "youtube" && (
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                  <Video className="w-3 h-3 text-red-500" />
                  YouTube Link
                </p>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 break-all font-medium"
                >
                  {session.link.length > 60
                    ? session.link.substring(0, 60) + "..."
                    : session.link}
                </a>
              </div>
            )}

            {session.platform === "zoom" && (
              <div className="p-3 rounded-lg bg-white border border-gray-200 space-y-2">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-blue-500" />
                  Zoom Link
                </p>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 break-all font-medium"
                >
                  {session.link.length > 60
                    ? session.link.substring(0, 60) + "..."
                    : session.link}
                </a>
                {session.zoomId && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">ID:</span> {session.zoomId}
                  </p>
                )}
                {session.zoomPasscode && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Passcode:</span>{" "}
                    {session.zoomPasscode}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Join Button */}
          <div className="pt-2">
            {session.platform === "youtube" && (
              <a
                href={session.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Video className="w-4 h-4" />
                Join YouTube Class
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {session.platform === "zoom" && (
              <a
                href={session.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Monitor className="w-4 h-4" />
                Join Zoom Class
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const totalSessions = filteredSessions.length;

  return (
    <div className="flex flex-col h-full space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
              <Video className="w-7 h-7 sm:w-10 sm:h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                Online Classes
              </h1>
              <p className="text-gray-400 text-xs sm:text-lg">
                Join your upcoming live sessions
                <span className="ml-2 sm:ml-3 text-[#D4AF37] font-medium">
                  {totalSessions} Session{totalSessions !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs Container - Flex column to fill remaining space */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0 w-full max-w-full">
        {/* Search Bar - Shrinkable */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50/50 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by class name or academic year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
            />
          </div>
        </div>

        {/* Tabs - Shrinkable */}
        <div className="w-full flex border-b border-gray-200 overflow-x-auto shrink-0 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            let count = 0;
            if (tab.id === "all") {
              count = totalSessions;
            } else if (tab.id === "youtube") {
              count = allSessions.filter(
                (s) => s.platform === "youtube",
              ).length;
            } else if (tab.id === "zoom") {
              count = allSessions.filter((s) => s.platform === "zoom").length;
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-grow md:flex-1 min-w-[60px] sm:min-w-[120px] relative px-2 py-3 sm:px-6 sm:py-4 font-medium transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? tab.color : ""}`} />
                  <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
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
                    layoutId="onlineClassTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content - Scrollable grid area (takes remaining space) */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}
        >
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {totalSessions === 0 ? (
                  <div className="text-center py-16">
                    <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">
                      No upcoming classes found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Check back later for scheduled classes"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) =>
                      renderSessionCard(session),
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global styles for scrollbar */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
