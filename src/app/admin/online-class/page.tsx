"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  getOnlineClasses,
  createOnlineClass,
  updateOnlineClass,
  deleteOnlineClass,
} from "@/lib/actions/onlineClass";
import { getYears } from "@/lib/actions/year";
import { getClassTypes } from "@/lib/actions/classType";

// ─── Types ───────────────────────────────────────────────────
interface OnlineClass {
  id: number;
  youtubeLink: string | null;
  youtubeTime: string | null;
  zoomLink: string | null;
  zoomTime: string | null;
  zoomId: string | null;
  zoomPasscode: string | null;
  classTypes: string[];
  createdAt: string;
}

interface Year {
  id: string;
  year: string;
  isActive: boolean;
  classTypes?: ClassType[];
}

interface ClassType {
  id: string;
  name: string;
  yearId: string;
  isActive: boolean;
}

// ─── Component ────────────────────────────────────────────────
export default function OnlineClassPage() {
  // Table state
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [editingClass, setEditingClass] = useState<OnlineClass | null>(null);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"youtube" | "zoom">("youtube");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeTime, setYoutubeTime] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomTime, setZoomTime] = useState("");
  const [zoomId, setZoomId] = useState("");
  const [zoomPasscode, setZoomPasscode] = useState("");
  const [years, setYears] = useState<Year[]>([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [selectedClassTypeIds, setSelectedClassTypeIds] = useState<string[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert state
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    classId: number | null;
  }>({ isOpen: false, classId: null });
  const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    message: "",
  });

  // ─── Data Fetching ──────────────────────────────────────
  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    const result = await getOnlineClasses(currentPage);
    if (result.success && result.data) {
      setClasses(result.data);
      setTotalPages(result.totalPages ?? 1);
    }
    setIsLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchClasses();
    loadYears();
  }, [fetchClasses]);

  const loadYears = async () => {
    const result = await getYears();
    if (result.success && result.data) {
      setYears((result.data as Year[]).filter((y) => y.isActive));
    }
  };

  const loadClassTypes = async (yearId: string) => {
    const result = await getClassTypes(yearId);
    if (result.success && result.data) {
      setClassTypes((result.data as ClassType[]).filter((ct) => ct.isActive));
    }
  };

  // Helper to format date for datetime-local input
  const formatForInput = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // ─── Form Handlers ──────────────────────────────────────
  const handleEdit = async (cls: OnlineClass) => {
    setEditingClass(cls);
    setStep(1);

    // Load YouTube data
    if (cls.youtubeLink) {
      setYoutubeLink(cls.youtubeLink);
      setYoutubeTime(formatForInput(cls.youtubeTime));
      setActiveTab("youtube");
    } else {
      setYoutubeLink("");
      setYoutubeTime("");
    }

    // Load Zoom data
    if (cls.zoomLink) {
      setZoomLink(cls.zoomLink);
      setZoomTime(formatForInput(cls.zoomTime));
      setZoomId(cls.zoomId ?? "");
      setZoomPasscode(cls.zoomPasscode ?? "");
      if (!cls.youtubeLink) {
        setActiveTab("zoom");
      }
    } else {
      setZoomLink("");
      setZoomTime("");
      setZoomId("");
      setZoomPasscode("");
    }

    // Load selected class type IDs
    const classTypeIds = Array.isArray(cls.classTypes) ? cls.classTypes : [];
    setSelectedClassTypeIds(classTypeIds);

    // Find which year these class types belong to
    // We need to fetch all years with their class types to determine the correct year
    if (classTypeIds.length > 0) {
      const yearsResult = await getYears();
      if (yearsResult.success && yearsResult.data) {
        const allYears = yearsResult.data as Year[];

        // For each year, fetch its class types to find which one contains our classTypeIds
        for (const year of allYears) {
          if (!year.isActive) continue;

          const ctResult = await getClassTypes(year.id);
          if (ctResult.success && ctResult.data) {
            const yearClassTypes = ctResult.data as ClassType[];
            // Check if any of our selected class types belong to this year
            const hasMatchingClassType = classTypeIds.some((id) =>
              yearClassTypes.some((ct) => ct.id === id),
            );

            if (hasMatchingClassType) {
              setSelectedYearId(year.id);
              setClassTypes(yearClassTypes.filter((ct) => ct.isActive));
              break; // Found the matching year
            }
          }
        }
      }
    }
  };

  const resetForm = () => {
    setEditingClass(null);
    setStep(1);
    setActiveTab("youtube");
    setYoutubeLink("");
    setYoutubeTime("");
    setZoomLink("");
    setZoomTime("");
    setZoomId("");
    setZoomPasscode("");
    setSelectedYearId("");
    setSelectedClassTypeIds([]);
    setClassTypes([]);
  };

  const handleNext = () => {
    const hasYoutube = youtubeLink.trim() && youtubeTime;
    const hasZoom = zoomLink.trim() && zoomTime;

    if (!hasYoutube && !hasZoom) {
      setErrorAlert({
        isOpen: true,
        message: "Please fill in at least YouTube or Zoom details",
      });
      return;
    }

    // If editing and year is already set, load class types for Step 2
    if (editingClass && selectedYearId) {
      loadClassTypes(selectedYearId);
    }

    setStep(2);
  };

  const handleYearChange = (yearId: string) => {
    setSelectedYearId(yearId);
    setSelectedClassTypeIds([]); // Reset selections when year changes
    if (yearId) {
      loadClassTypes(yearId);
    } else {
      setClassTypes([]);
    }
  };

  const toggleClassType = (id: string) => {
    setSelectedClassTypeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selectedClassTypeIds.length === 0) {
      setErrorAlert({
        isOpen: true,
        message: "Please select at least one class type",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        classTypeIds: selectedClassTypeIds,
        youtubeLink,
        youtubeTime,
        zoomLink,
        zoomTime,
        zoomId,
        zoomPasscode,
      };

      const result = editingClass
        ? await updateOnlineClass(editingClass.id, data)
        : await createOnlineClass(data);

      if (result.success) {
        setSuccessAlert({
          isOpen: true,
          message: result.message ?? "Saved successfully",
        });
        resetForm();
        fetchClasses();
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error ?? "Failed to save",
        });
      }
    } catch {
      setErrorAlert({ isOpen: true, message: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAlert.classId) return;
    const result = await deleteOnlineClass(deleteAlert.classId);
    if (result.success) {
      setSuccessAlert({ isOpen: true, message: "Deleted successfully" });
      fetchClasses();
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error ?? "Failed to delete",
      });
    }
    setDeleteAlert({ isOpen: false, classId: null });
  };

  // ─── Helpers ────────────────────────────────────────────
  const getTypeBadges = (cls: OnlineClass) => {
    const badges: { label: string; color: string }[] = [];
    if (cls.youtubeLink) {
      badges.push({ label: "YouTube", color: "bg-red-500/10 text-red-600" });
    }
    if (cls.zoomLink) {
      badges.push({ label: "Zoom", color: "bg-blue-500/10 text-blue-600" });
    }
    if (badges.length === 0) {
      badges.push({ label: "N/A", color: "bg-gray-100 text-gray-600" });
    }
    return badges;
  };

  const getDateTime = (cls: OnlineClass) => {
    const time = cls.youtubeTime ?? cls.zoomTime;
    if (!time) return "N/A";
    return new Date(time).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ─── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header - Same as before */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <Video className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Online Classes
              </h1>
              <p className="text-gray-400 text-lg">
                Schedule and manage live online sessions
                <span className="ml-3 text-[#D4AF37] font-medium">
                  {classes.length} Upcoming
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Form (35%) */}
        <div className="lg:w-[35%]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            {/* Form Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                {editingClass ? (
                  <Edit2 className="w-5 h-5 text-[#D4AF37]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#D4AF37]" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {editingClass ? "Edit Class" : "Schedule Class"}
                </h3>
                <p className="text-xs text-gray-500">Step {step} of 2</p>
              </div>
              {editingClass && (
                <button
                  onClick={resetForm}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? "bg-[#D4AF37]" : "bg-gray-200"}`}
              />
              <div
                className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? "bg-[#D4AF37]" : "bg-gray-200"}`}
              />
            </div>

            {/* Step 1: Platform Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("youtube")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "youtube" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setActiveTab("zoom")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "zoom" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                  >
                    Zoom
                  </button>
                </div>

                {/* YouTube Fields */}
                <div
                  className={`space-y-3 ${activeTab === "youtube" ? "" : "hidden"}`}
                >
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">
                      YouTube Link
                    </Label>
                    <Input
                      placeholder="https://youtube.com/..."
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={youtubeTime}
                      onChange={(e) => setYoutubeTime(e.target.value)}
                      className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                {/* Zoom Fields */}
                <div
                  className={`space-y-3 ${activeTab === "zoom" ? "" : "hidden"}`}
                >
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">Zoom Link</Label>
                    <Input
                      placeholder="https://zoom.us/..."
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm">Zoom ID</Label>
                      <Input
                        placeholder="Meeting ID"
                        value={zoomId}
                        onChange={(e) => setZoomId(e.target.value)}
                        className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm">Passcode</Label>
                      <Input
                        placeholder="Passcode"
                        value={zoomPasscode}
                        onChange={(e) => setZoomPasscode(e.target.value)}
                        className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={zoomTime}
                      onChange={(e) => setZoomTime(e.target.value)}
                      className="h-11 rounded-xl border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-11 rounded-xl shadow-md"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Class Assignment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Academic Year</Label>
                  <select
                    value={selectedYearId}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white text-gray-900 px-3 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 focus:outline-none text-sm"
                  >
                    <option value="">Select a year</option>
                    {years.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.year}
                      </option>
                    ))}
                  </select>
                </div>

                {classTypes.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">
                      Select Class Types
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                      {classTypes.map((ct) => (
                        <button
                          key={ct.id}
                          onClick={() => toggleClassType(ct.id)}
                          className={`p-2.5 rounded-xl border text-left text-sm transition-all ${
                            selectedClassTypeIds.includes(ct.id)
                              ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] font-medium"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{ct.name}</span>
                            {selectedClassTypeIds.includes(ct.id) && (
                              <Check className="w-4 h-4 flex-shrink-0 ml-1" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedClassTypeIds.length > 0 && (
                  <p className="text-xs text-[#D4AF37] font-medium">
                    {selectedClassTypeIds.length} class type(s) selected
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl border-gray-300 text-gray-600"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-11 rounded-xl shadow-md"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingClass ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT: Table (65%) - Same as before */}
        <div className="lg:w-[65%]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Platform
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Classes
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No upcoming classes</p>
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls) => {
                      const badges = getTypeBadges(cls);
                      return (
                        <tr
                          key={cls.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {getDateTime(cls)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {badges.map((badge, i) => (
                                <span
                                  key={i}
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {Array.isArray(cls.classTypes) &&
                            cls.classTypes.length > 0
                              ? `${cls.classTypes.length} class${cls.classTypes.length !== 1 ? "es" : ""}`
                              : "All"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(cls)}
                                className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteAlert({
                                    isOpen: true,
                                    classId: cls.id,
                                  })
                                }
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Dialogs */}
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, classId: null })}
        onConfirm={handleDelete}
        title="Delete Class"
        description="Are you sure you want to delete this online class?"
        type="error"
        confirmText="Delete"
        cancelText="Cancel"
      />
      <AlertDialog
        isOpen={errorAlert.isOpen}
        onClose={() => setErrorAlert({ isOpen: false, message: "" })}
        title="Error"
        description={errorAlert.message}
        type="error"
        cancelText="Close"
      />
      <AlertDialog
        isOpen={successAlert.isOpen}
        onClose={() => setSuccessAlert({ isOpen: false, message: "" })}
        title="Success"
        description={successAlert.message}
        type="success"
        cancelText="Close"
      />
    </div>
  );
}
