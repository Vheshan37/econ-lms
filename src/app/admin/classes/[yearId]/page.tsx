"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Power,
  Layers,
  RotateCcw,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { FloatingAddButton } from "@/components/admin/FloatingAddButton";
import { getYearById } from "@/lib/actions/year";
import {
  ensureClassTypes,
  toggleClassTypeStatus,
  createClassType,
  deleteClassType,
} from "@/lib/actions/classType";

interface ClassType {
  id: string;
  name: string;
  isActive: boolean;
  _count?: {
    topics: number;
  };
}

interface YearData {
  id: string;
  year: string;
  description: string | null;
  classTypes: ClassType[];
}

const DEFAULT_TYPES = {
  Theory: {
    icon: BookOpen,
    gradient: "from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]",
    accentColor: "text-[#D4AF37]",
    borderColor: "border-[#D4AF37]/30",
    glowColor: "shadow-[#D4AF37]/10",
    description: "Core concepts and fundamental lessons",
    emoji: "📚",
  },
  Revision: {
    icon: RotateCcw,
    gradient: "from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]",
    accentColor: "text-[#D4AF37]",
    borderColor: "border-[#D4AF37]/30",
    glowColor: "shadow-[#D4AF37]/10",
    description: "Review materials and practice sessions",
    emoji: "🔄",
  },
  "Paper Class": {
    icon: FileEdit,
    gradient: "from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]",
    accentColor: "text-[#D4AF37]",
    borderColor: "border-[#D4AF37]/30",
    glowColor: "shadow-[#D4AF37]/10",
    description: "Past papers and exam preparation",
    emoji: "📝",
  },
};

const CUSTOM_TYPE_CONFIG = {
  icon: Layers,
  gradient: "from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]",
  accentColor: "text-[#B5952F]",
  borderColor: "border-[#B5952F]/30",
  glowColor: "shadow-[#B5952F]/10",
  description: "Specialized course module",
  emoji: "✨",
};

export default async function ClassTypesPage({
  params,
}: {
  params: Promise<{ yearId: string }>;
}) {
  const { yearId } = await params;
  return <ClassTypesPageClient yearId={yearId} />;
}

function ClassTypesPageClient({ yearId }: { yearId: string }) {
  const router = useRouter();
  const [yearData, setYearData] = useState<YearData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorAlert, setErrorAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: "",
  });

  const fetchYearData = async () => {
    setIsLoading(true);

    // Ensure default class types exist
    await ensureClassTypes(yearId);

    const result = await getYearById(yearId);
    if (result.success && result.data) {
      setYearData(result.data as YearData);
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to fetch year data",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchYear = async () => {
      setIsLoading(true);

      // Ensure default class types exist
      await ensureClassTypes(yearId);

      const result = await getYearById(yearId);
      if (result.success && result.data) {
        setYearData(result.data as YearData);
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to fetch year data",
        });
      }
      setIsLoading(false);
    };

    fetchYear();
  }, [yearId]);

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    setIsSubmitting(true);
    const result = await createClassType(yearId, newTypeName);

    if (result.success) {
      await fetchYearData();
      setIsAdding(false);
      setNewTypeName("");
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to create class type",
      });
    }
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const result = await toggleClassTypeStatus(id, newStatus);

    if (result.success) {
      await fetchYearData();
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to toggle class type status",
      });
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ isOpen: true, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;

    const result = await deleteClassType(deleteConfirm.id);
    if (result.success) {
      await fetchYearData();
      setDeleteConfirm({ isOpen: false, id: null, name: "" });
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to delete class type",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading class types...</p>
        </div>
      </div>
    );
  }

  if (!yearData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Year not found</p>
          <Button
            onClick={() => router.push("/admin/classes")}
            className="bg-[#1a1a1a] hover:bg-black text-white"
          >
            Back to Years
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <div className="mx-auto space-y-8 w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Button
                onClick={() => router.push("/admin/classes")}
                variant="ghost"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1 sm:mb-2">
                  <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    <span>Academic Year</span>
                  </div>
                </div>
                <h1 className="text-xl sm:text-4xl font-bold text-white">
                  {yearData.year}
                </h1>
                <p className="text-gray-400 mt-1 text-xs sm:text-sm max-w-xl">
                  Manage class types and curriculum for this academic year.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsAdding(true)}
              className="bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-10 sm:h-12 px-4 sm:px-6 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all hidden md:flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Add Class Type
            </Button>
          </div>
        </motion.div>

        {/* Description */}
        {yearData.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B5952F]/10 border border-[#D4AF37]/20 p-6 rounded-2xl"
          >
            <p className="text-gray-700 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              {yearData.description}
            </p>
          </motion.div>
        )}

        {/* Class Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearData.classTypes.map((classType, index) => {
            const isDefault = Object.keys(DEFAULT_TYPES).includes(
              classType.name,
            );
            const config = isDefault
              ? DEFAULT_TYPES[classType.name as keyof typeof DEFAULT_TYPES]
              : CUSTOM_TYPE_CONFIG;
            const Icon = config.icon;

            return (
              <motion.div
                key={classType.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group overflow-hidden rounded-3xl transition-all ${
                  classType.isActive
                    ? "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] cursor-pointer hover:shadow-2xl hover:shadow-[#D4AF37]/20"
                    : "bg-gray-100 opacity-60 hover:opacity-80 grayscale"
                }`}
                onClick={() =>
                  classType.isActive &&
                  router.push(`/admin/classes/${yearId}/${classType.id}`)
                }
              >
                {/* Decorative glow effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 z-50 pointer-events-auto flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(classType.id, classType.name);
                    }}
                    className="p-2 rounded-full transition-colors text-red-400 hover:bg-red-400/10"
                    title="Delete class type"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(classType.id, classType.isActive);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      classType.isActive
                        ? "text-green-400 hover:bg-green-400/10"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                    title={
                      classType.isActive
                        ? "Disable class type"
                        : "Enable class type"
                    }
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="relative z-10 p-5 sm:p-8">
                  {/* Icon Badge */}
                  <div
                    className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${
                      classType.isActive
                        ? "bg-gradient-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/30"
                        : "bg-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${classType.isActive ? "text-[#1a1a1a]" : "text-gray-600"}`}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl sm:text-4xl font-bold mb-1 sm:mb-2 ${classType.isActive ? "text-white" : "text-gray-700"}`}
                  >
                    {classType.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm mb-6 ${classType.isActive ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {config.description}
                  </p>

                  {/* Stats */}
                  <div
                    className={`flex items-center gap-4 pt-4 border-t ${
                      classType.isActive ? "border-white/10" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers
                        className={`w-4 h-4 ${classType.isActive ? "text-[#D4AF37]" : "text-gray-500"}`}
                      />
                      <span
                        className={`text-sm ${classType.isActive ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {classType._count?.topics || 0} topics
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add Class Type Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-[#D4AF37]/20 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <Plus className="w-7 h-7 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      New Class Type
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Create a custom class type
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateType} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">
                      Class Type Name
                    </Label>
                    <Input
                      placeholder="e.g. Speed Revision"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      required
                      className="bg-[#0a0a0a] border-[#D4AF37]/20 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl border border-gray-800"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/30 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Type"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Alert */}
      <AlertDialog
        isOpen={errorAlert.isOpen}
        onClose={() => setErrorAlert({ isOpen: false, message: "" })}
        title="Error"
        description={errorAlert.message}
        type="error"
        cancelText="Close"
      />

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Class Type"
        description={`Are you sure you want to delete "${deleteConfirm.name}"? This will permanently delete all topics and resources associated with it.`}
        type="warning"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <FloatingAddButton onClick={() => setIsAdding(true)} label="Add Class Type" />
    </div>
  );
}
