"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Youtube,
  FileText,
  File,
  ClipboardList,
  Play,
  Download,
  ExternalLink,
  BookOpen,
  Save,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { VideoPlayer } from "@/components/VideoPlayer";
import {
  getFreeResources,
  createFreeResource,
  updateFreeResource,
  deleteFreeResource,
} from "@/lib/actions/freeResource";
import {
  getLandingPageContent,
  updateLandingPageContent,
} from "@/lib/actions/content";
import { ResourceType } from "@prisma/client";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string | null;
  createdAt: Date;
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

export default function FreeResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<ResourceType>("VIDEO");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Page Content State
  const [pageDescription, setPageDescription] = useState("");
  const [categoryDescriptions, setCategoryDescriptions] = useState({
    VIDEO: "",
    PDF: "",
    PAST_PAPER: "",
    QUIZ: "",
  });
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  // Form state
  const [resourceType, setResourceType] = useState<ResourceType>("VIDEO");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Alert Dialog State
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    resourceId: string | null;
    resourceTitle: string;
  }>({
    isOpen: false,
    resourceId: null,
    resourceTitle: "",
  });
  const [errorAlert, setErrorAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });
  const [successAlert, setSuccessAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // Video Player State
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resourcesResult, contentResult] = await Promise.all([
        getFreeResources(),
        getLandingPageContent(),
      ]);

      if (resourcesResult.success && resourcesResult.data) {
        setResources(resourcesResult.data);
      } else {
        setErrorAlert({
          isOpen: true,
          message: resourcesResult.error || "Failed to fetch resources",
        });
      }

      if (contentResult.success && contentResult.data) {
        const data = contentResult.data as any;
        if (data.freeLessons?.description) {
          setPageDescription(data.freeLessons.description);
        }
        if (data.freeLessons?.categories) {
          setCategoryDescriptions((prev) => ({
            ...prev,
            ...data.freeLessons.categories,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorAlert({ isOpen: true, message: "Failed to fetch data" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveDescription = async () => {
    setIsSavingDescription(true);
    try {
      // We need to fetch current content first to not overwrite other fields in freeLessons
      // Or assume backend handles partial updates (which updateLandingPageContent usually does per section)
      // Based on usage in content page, updateLandingPageContent('freeLessons', data) replaces the section object?
      // Let's check updateAllLandingPageContent signature or updateLandingPageContent.
      // In content page: updateLandingPageContent('banners', updatedBanners)
      // It seems it takes section name and data.
      // We should ideally merge.

      // Re-fetch strict to be safe or just send the description fields we know
      // Actually, getLandingPageContent was just called.
      // Let's assume we maintain the structure.

      // To be safe, let's just update the description field if possible, or we need to send the whole object.
      // Since we don't have the full object here, we might need to fetch it again or store it.
      // Let's fetch the latest full content for that section first.
      const contentResult = await getLandingPageContent();
      let currentSectionData = {};
      if (contentResult.success && contentResult.data) {
        const data = contentResult.data as any;
        currentSectionData = data.freeLessons || {};
      }

      const updatedSectionData = {
        ...currentSectionData,
        description: pageDescription,
        categories: categoryDescriptions,
      };

      const result = await updateLandingPageContent(
        "freeLessons",
        updatedSectionData,
      );

      if (result.success) {
        setSuccessAlert({
          isOpen: true,
          message: "Page description updated successfully",
        });
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to update description",
        });
      }
    } catch (error) {
      console.error("Error saving description:", error);
      setErrorAlert({ isOpen: true, message: "Failed to save description" });
    } finally {
      setIsSavingDescription(false);
    }
  };

  const fetchResources = async () => {
    // Re-fetch only resources for updates
    const result = await getFreeResources();
    if (result.success && result.data) {
      setResources(result.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalUrl = url;

      // If it's a PDF or Past Paper and a file is selected, upload it first
      if (
        (resourceType === "PDF" || resourceType === "PAST_PAPER") &&
        selectedFile
      ) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        setUploadProgress(50);
        const uploadResponse = await fetch("/api/upload/free-resource", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload file");
        }

        finalUrl = uploadResult.url;
        setUploadProgress(75);
      }

      // Now create/update the resource with the URL (either uploaded file path or entered URL)
      const result = editingResource
        ? await updateFreeResource(editingResource.id, {
            title,
            type: resourceType,
            url: finalUrl,
            description,
          })
        : await createFreeResource({
            title,
            type: resourceType,
            url: finalUrl,
            description,
          });

      if (result.success) {
        setUploadProgress(100);
        await fetchResources();
        closeModal();
        setSuccessAlert({
          isOpen: true,
          message: `Resource ${editingResource ? "updated" : "added"} successfully`,
        });
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to save resource",
        });
      }
    } catch (error: any) {
      setErrorAlert({
        isOpen: true,
        message: error.message || "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setUrl(resource.url);
    setDescription(resource.description || "");
    setResourceType(resource.type);
    setIsAddingResource(true);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteAlert({ isOpen: true, resourceId: id, resourceTitle: title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAlert.resourceId) return;

    const result = await deleteFreeResource(deleteAlert.resourceId);
    if (result.success) {
      await fetchResources();
      setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: "" });
      setSuccessAlert({
        isOpen: true,
        message: "Resource deleted successfully",
      });
    } else {
      setErrorAlert({ isOpen: true, message: "Failed to delete resource" });
    }
  };

  const handleResourceClick = (resource: Resource) => {
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

  const closeModal = () => {
    setIsAddingResource(false);
    setEditingResource(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setSelectedFile(null);
    setUploadProgress(0);
    setResourceType("VIDEO");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const currentTabResources = resources.filter((r) => r.type === activeTab);
  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const TabIcon = currentTab.icon;

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
              <BookOpen className="w-7 h-7 sm:w-10 sm:h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                Free Resources
              </h1>
              <p className="text-gray-400 text-xs sm:text-lg">
                Manage public learning materials
                <span className="ml-2 sm:ml-3 text-[#D4AF37] font-medium">
                  {resources.length}{" "}
                  {resources.length === 1 ? "Resource" : "Resources"}
                </span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddingResource(true)}
            className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-10 sm:h-12 px-4 sm:px-6 font-bold shadow-lg shadow-[#D4AF37]/30 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </Button>
        </div>
      </div>

      {/* Page Description Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Page Settings</h2>
          <Button
            onClick={handleSaveDescription}
            disabled={isSavingDescription}
            className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSavingDescription ? "Saving..." : "Save Description"}
          </Button>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-800">Section Description (Sinhala)</Label>
          <Textarea
            className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            value={pageDescription}
            onChange={(e) => setPageDescription(e.target.value)}
            placeholder="Description for the Free Resources page..."
            rows={3}
          />
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <Label className="text-gray-900 font-bold text-md mb-4 block">
            Category Descriptions
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TABS.map((tab) => (
              <div key={tab.id} className="space-y-2">
                <Label className="text-gray-800 text-sm flex items-center gap-2">
                  <tab.icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label} Description
                </Label>
                <Textarea
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  value={
                    categoryDescriptions[
                      tab.id as keyof typeof categoryDescriptions
                    ]
                  }
                  onChange={(e) =>
                    setCategoryDescriptions((prev) => ({
                      ...prev,
                      [tab.id]: e.target.value,
                    }))
                  }
                  placeholder={`Description for ${tab.label}...`}
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = resources.filter((r) => r.type === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ResourceType)}
                className={`flex-grow md:flex-1 relative px-2 py-3 sm:px-6 sm:py-4 font-medium transition-colors ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? tab.color : ""}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
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
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTabResources.length === 0 ? (
                <div className="text-center py-16">
                  <TabIcon
                    className={`w-16 h-16 mx-auto mb-4 ${currentTab.color} opacity-20`}
                  />
                  <p className="text-gray-500 text-lg">
                    No {currentTab.label.toLowerCase()} added yet
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Click &quot;Add Resource&quot; to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentTabResources.map((resource) => {
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
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
                          <div className="absolute top-3 right-3 z-20">
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

                        {/* Action Buttons for Admin Overlay */}
                        <div className="absolute top-3 left-3 z-30 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(resource);
                            }}
                            className="p-2 bg-black/60 hover:bg-black text-white hover:text-[#D4AF37] rounded-lg transition-colors border border-white/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(resource.id, resource.title);
                            }}
                            className="p-2 bg-black/60 hover:bg-black text-white hover:text-red-500 rounded-lg transition-colors border border-white/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
                            <span className="text-[10px] text-gray-400">
                              {new Date(resource.createdAt).toLocaleDateString()}
                            </span>
                            <div className="inline-flex items-center gap-1 text-xs text-[#D4AF37] font-semibold">
                              {resource.type === "VIDEO" ? (
                                <>
                                  Watch Video <Play className="w-3 h-3 fill-current ml-0.5" />
                                </>
                              ) : resource.type === "PAST_PAPER" || resource.type === "PDF" ? (
                                <>
                                  Download <Download className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  Open Link <ExternalLink className="w-3 h-3" />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Resource Modal */}
      <AnimatePresence>
        {isAddingResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg`}
                  >
                    {editingResource ? (
                      <Edit2 className="w-6 h-6 text-[#1a1a1a]" />
                    ) : (
                      <Plus className="w-6 h-6 text-[#1a1a1a]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingResource ? "Edit Resource" : "Add Free Resource"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {editingResource
                        ? "Update resource details"
                        : "Select type and add details"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Resource Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = resourceType === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() =>
                              setResourceType(tab.id as ResourceType)
                            }
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              isSelected
                                ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {tab.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Title</Label>
                    <Input
                      placeholder="e.g. Introduction to Economics"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  {/* Conditional Input: File Upload for PDF/Past Paper, URL for Video/Quiz */}
                  {resourceType === "PDF" || resourceType === "PAST_PAPER" ? (
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Upload File</Label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedFile(file);
                              setUrl(""); // Clear URL when file is selected
                            }
                          }}
                          className="hidden"
                          id="file-upload"
                          required={!editingResource && !url}
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center gap-2 w-full h-12 px-4 bg-white/5 border border-white/10 text-gray-400 rounded-xl cursor-pointer hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">
                            {selectedFile
                              ? selectedFile.name
                              : "Choose PDF file..."}
                          </span>
                        </label>
                      </div>
                      {selectedFile && (
                        <p className="text-xs text-gray-500 ml-1">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      )}
                      {editingResource && url && (
                        <p className="text-xs text-[#D4AF37] ml-1">
                          Current: {url.split("/").pop()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        {resourceType === "VIDEO" ? "YouTube URL" : "URL"}
                      </Label>
                      <Input
                        placeholder={
                          resourceType === "VIDEO"
                            ? "https://youtube.com/watch?v=..."
                            : "https://..."
                        }
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        type="url"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">
                      Description{" "}
                      <span className="text-gray-600 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      placeholder="Brief description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? editingResource
                          ? "Updating..."
                          : "Adding..."
                        : editingResource
                          ? "Update"
                          : "Add Resource"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        onClose={() =>
          setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: "" })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Resource"
        description={`Are you sure you want to delete "${deleteAlert.resourceTitle}"? This action cannot be undone.`}
        type="error"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Error Alert */}
      <AlertDialog
        isOpen={errorAlert.isOpen}
        onClose={() => setErrorAlert({ isOpen: false, message: "" })}
        title="Error"
        description={errorAlert.message}
        type="error"
        cancelText="Close"
      />

      {/* Success Alert */}
      <AlertDialog
        isOpen={successAlert.isOpen}
        onClose={() => setSuccessAlert({ isOpen: false, message: "" })}
        title="Success"
        description={successAlert.message}
        type="success"
        cancelText="Close"
      />

      {/* Video Player */}
      <VideoPlayer
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, url: "", title: "" })}
        videoUrl={videoPlayer.url}
        title={videoPlayer.title}
      />
    </div>
  );
}
