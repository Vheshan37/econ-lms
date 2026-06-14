"use client";

import { useState } from "react";
import {
  Video,
  FileText,
  File,
  ClipboardList,
  Play,
  Download,
  Calendar,
  Lock,
  ExternalLink,
} from "lucide-react";
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

const RESOURCE_CONFIG = {
  VIDEO: {
    icon: Video,
    color: "text-red-500",
    bgColor: "bg-red-500",
    label: "Videos",
  },
  PDF: {
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    label: "PDFs",
  },
  PAST_PAPER: {
    icon: File,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    label: "Past Papers",
  },
  QUIZ: {
    icon: ClipboardList,
    color: "text-green-500",
    bgColor: "bg-green-500",
    label: "Quizzes",
  },
};

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string | null;
  month?: number | null;
  year?: string | null;
  isPaid: boolean;
  isFree: boolean;
}

const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface TopicResourcesClientProps {
  resources: Resource[];
}

export function TopicResourcesClient({ resources }: TopicResourcesClientProps) {
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

  const handleResourceClick = (resource: Resource, e: React.MouseEvent) => {
    // Check payment status first
    if (!resource.isPaid && !resource.isFree) {
      e.preventDefault();
      const monthName =
        resource.month !== null && resource.month !== undefined
          ? `${MONTHS[resource.month]}`
          : "this month";
      setPaymentAlert({ isOpen: true, monthName });
      return;
    }

    // Paid or free - handle normally
    if (resource.type === "VIDEO") {
      e.preventDefault();
      setVideoPlayer({
        isOpen: true,
        url: resource.url,
        title: resource.title,
      });
    }
    // Non-video resources open via href naturally
  };

  const resourcesByType = Object.keys(RESOURCE_CONFIG)
    .map((type) => ({
      type,
      config: RESOURCE_CONFIG[type as keyof typeof RESOURCE_CONFIG],
      items: resources.filter((r: Resource) => r.type === type),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="space-y-8">
      {resourcesByType.length > 0 ? (
        resourcesByType.map((group) => {
          const Icon = group.config.icon;
          return (
            <div key={group.type} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${group.config.bgColor}/10`}>
                  <Icon className={`w-5 h-5 ${group.config.color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {group.config.label}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {group.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((resource: Resource) => {
                  const monthName =
                    resource.month !== null && resource.month !== undefined
                      ? MONTHS[resource.month]
                      : null;
                  const isLocked = !resource.isPaid && !resource.isFree;
                  const getCardThumbnail = (type: string, url: string) => {
                    if (type === "VIDEO") {
                      const id = getYouTubeVideoId(url);
                      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/learning_materials.png";
                    }
                    if (type === "PAST_PAPER") return "/past_papers.png";
                    if (type === "QUIZ") return "/quizzes.png";
                    if (type === "PDF") return "/learning_materials.png";
                    return "/learning_materials.png";
                  };
                  const thumbnailUrl = getCardThumbnail(resource.type, resource.url);

                  return (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleResourceClick(resource, e)}
                      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col h-[280px] overflow-hidden ${
                        isLocked
                          ? "border-amber-200 hover:border-amber-400"
                          : "border-gray-200 hover:shadow-xl"
                      }`}
                    >
                      {/* Image wrapper that shrinks on hover */}
                      <div className="absolute top-0 left-0 right-0 w-full h-full group-hover:h-[150px] transition-all duration-500 ease-in-out z-10 overflow-hidden bg-gray-900">
                        <img
                          src={thumbnailUrl}
                          alt={resource.title}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                            isLocked ? "opacity-60 saturate-50" : ""
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                          {isLocked ? (
                            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
                              <Lock className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                              {resource.type === "VIDEO" ? (
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              ) : resource.type === "PAST_PAPER" || resource.type === "PDF" ? (
                                <Download className="w-5 h-5" />
                              ) : (
                                <ExternalLink className="w-5 h-5" />
                              )}
                            </div>
                          )}
                        </div>
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
                          <span className={`px-2 py-0.5 text-white rounded text-[10px] font-bold uppercase tracking-wider border ${
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
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1 text-sm">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="text-gray-500 line-clamp-2 leading-relaxed text-xs">
                              {resource.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          {monthName && (
                            <span className={`text-xs flex items-center gap-1 ${
                              isLocked ? "text-amber-600" : "text-gray-400"
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {monthName}
                            </span>
                          )}
                          <div className="flex items-center gap-2 text-xs font-medium">
                            {isLocked ? (
                              <span className="text-amber-600 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Payment Required
                              </span>
                            ) : resource.type === "VIDEO" ? (
                              <span className="text-red-500 flex items-center gap-1">
                                <Play className="w-3 h-3" /> Watch Now
                              </span>
                            ) : resource.type === "PAST_PAPER" || resource.type === "PDF" ? (
                              <span className="text-blue-500 flex items-center gap-1">
                                <Download className="w-3 h-3" /> Download
                              </span>
                            ) : (
                              <span className="text-green-500 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Open Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No resources found</p>
          <p className="text-gray-400 text-sm mt-2">
            This topic doesn&apos;t have any resources yet
          </p>
        </div>
      )}

      {/* Video Player */}
      <VideoPlayer
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, url: "", title: "" })}
        videoUrl={videoPlayer.url}
        title={videoPlayer.title}
        showWarning={true}
      />

      {/* Payment Required Alert */}
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
