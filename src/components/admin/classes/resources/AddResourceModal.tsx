"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Youtube,
  FileText,
  File,
  ClipboardList,
  ChevronRight,
  Calendar,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResource } from "@/lib/actions/resource";
import { ResourceType } from "@prisma/client";

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

const TABS = [
  { id: "VIDEO", label: "Videos", icon: Youtube },
  { id: "PDF", label: "PDFs", icon: FileText },
  { id: "PAST_PAPER", label: "Past Papers", icon: File },
  { id: "QUIZ", label: "Quizzes", icon: ClipboardList },
] as const;

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  onSuccess?: () => void;
}

export function AddResourceModal({
  isOpen,
  onClose,
  topicId,
  onSuccess,
}: AddResourceModalProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ResourceType>("VIDEO");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Generate year range: current year ± 3
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = currentYear - 3; i <= currentYear + 3; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  // Default selected year = current year
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Single month selection - clicking a month selects it, clicking again deselects
  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth((prev) => (prev === monthIndex ? null : monthIndex));
  };

  const handleNext = () => {
    if (!title.trim()) {
      setError("Please enter a resource title");
      return;
    }
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    if (selectedMonth === null) {
      setError("Please select a month");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await createResource({
        topicId,
        title: title.trim(),
        type: selectedType,
        url: url.trim(),
        description: description.trim() || undefined,
        year: selectedYear || null,
        month: selectedMonth,
      });

      if (result.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(result.error || "Failed to create resource");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType("VIDEO");
    setTitle("");
    setUrl("");
    setDescription("");
    setSelectedYear(currentYear);
    setSelectedMonth(null);
    setError("");
    onClose();
  };

  // Get selected month name for display
  const selectedMonthName =
    selectedMonth !== null ? MONTHS[selectedMonth] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Add Resource
                    </h2>
                    <p className="text-gray-400 text-sm">Step {step} of 2</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full transition-all ${s <= step ? "bg-[#D4AF37]" : "bg-white/10"}`}
                  />
                ))}
              </div>

              {/* Step 1: Resource Details */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Resource Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Resource Type
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {TABS.map((tab) => {
                          const Icon = tab.icon;
                          const isSelected = selectedType === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() =>
                                setSelectedType(tab.id as ResourceType)
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

                    {/* Title */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Title</Label>
                      <Input
                        placeholder="e.g. Introduction to Economics"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">URL</Label>
                      <Input
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        type="url"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Description{" "}
                        <span className="text-gray-600 text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        placeholder="Brief description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                      >
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Academic Year & Month Selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Academic Year Dropdown */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        Academic Year
                      </Label>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) =>
                            setSelectedYear(Number(e.target.value))
                          }
                          className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white px-4 pr-10 appearance-none focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 focus:outline-none transition-all cursor-pointer"
                        >
                          {yearOptions.map((year) => (
                            <option
                              key={year}
                              value={year}
                              className="bg-[#1a1a1a] text-white"
                            >
                              {year}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {selectedYear === currentYear && (
                        <p className="text-xs text-[#D4AF37] ml-1">
                          Current academic year
                        </p>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-white/10" />

                    {/* Selected Month Indicator */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        {selectedMonthName ? (
                          <p className="text-sm text-gray-300">
                            Selected:{" "}
                            <span className="text-[#D4AF37] font-bold">
                              {selectedMonthName}
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No month selected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Months Grid - Single Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Select Month</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {MONTHS.map((month, index) => {
                          const isSelected = selectedMonth === index;
                          return (
                            <button
                              key={month}
                              type="button"
                              onClick={() => handleMonthSelect(index)}
                              className={`p-3 rounded-xl border transition-all text-center ${
                                isSelected
                                  ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
                                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-sm font-medium">
                                  {month.slice(0, 3)}
                                </span>
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                      >
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Adding...
                          </span>
                        ) : (
                          <>
                            Add Resource
                            <Plus className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
