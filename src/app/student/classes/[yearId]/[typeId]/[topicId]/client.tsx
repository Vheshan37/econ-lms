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

                  return (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleResourceClick(resource, e)}
                      className={`group bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all border cursor-pointer block relative ${
                        isLocked
                          ? "border-amber-200 hover:border-amber-400"
                          : "border-gray-100"
                      }`}
                    >
                      {/* Status Badge */}
                      <span
                        className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
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

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#D4AF37] transition-colors">
                              {resource.title}
                            </h3>
                            {resource.type === "VIDEO" && (
                              <div className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Play className="w-3 h-3 text-red-500" />
                              </div>
                            )}
                            {isLocked && (
                              <div className="shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                <Lock className="w-3 h-3 text-amber-600" />
                              </div>
                            )}
                          </div>
                          {resource.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                              {resource.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            {monthName && (
                              <span
                                className={`text-xs flex items-center gap-1 ${
                                  isLocked ? "text-amber-600" : "text-gray-400"
                                }`}
                              >
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
                                  <Play className="w-3 h-3" />
                                  Watch Now
                                </span>
                              ) : (
                                <span className="text-[#D4AF37] flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  Download
                                </span>
                              )}
                            </div>
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
