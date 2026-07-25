"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Trophy,
  Award,
  MapPin,
  Calendar,
  X,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { FloatingAddButton } from "@/components/admin/FloatingAddButton";
import {
  getHallOfFame,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "@/lib/actions/hallOfFame";
import {
  getLandingPageContent,
  updateLandingPageContent,
} from "@/lib/actions/content";
import { PreviewModal } from "@/components/landing/preview/PreviewModal";
import { ResultsPreview } from "@/components/landing/preview/ResultsPreview";

interface Alumni {
  id: string;
  name: string;
  district: string;
  academicYear: string;
  islandRank: number | null;
  districtRank: number | null;
  imageUrl: string | null;
  createdAt: Date;
}

export default function HallOfFamePage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [islandRank, setIslandRank] = useState("");
  const [districtRank, setDistrictRank] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats State
  const [hallOfFameStats, setHallOfFameStats] = useState({
    totalAPasses: "150+",
    passRate: "92%",
    districtRanks: "12",
    islandRanks: "3",
    isEnabled: true,
  });
  const [isSavingStats, setIsSavingStats] = useState(false);

  // Alert Dialog State
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    alumniId: string | null;
    alumniName: string;
  }>({
    isOpen: false,
    alumniId: null,
    alumniName: "",
  });
  const [errorAlert, setErrorAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const fetchAlumni = async () => {
    setIsLoading(true);
    const result = await getHallOfFame();
    if (result.success && result.data) {
      setAlumni(result.data);
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to fetch alumni",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchAlumniData = async () => {
      setIsLoading(true);
      const result = await getHallOfFame();
      if (result.success && result.data) {
        setAlumni(result.data);
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to fetch alumni",
        });
      }
      setIsLoading(false);
    };

    const fetchStats = async () => {
      const content = await getLandingPageContent("hall-of-fame");
      if (content.success && content.data) {
        setHallOfFameStats((prev) => ({
          ...prev,
          ...content.data,
          isEnabled:
            content.data.isEnabled !== undefined
              ? content.data.isEnabled
              : true,
        }));
      }
    };

    fetchAlumniData();
    fetchStats();
  }, []);

  const handleSaveStats = async () => {
    setIsSavingStats(true);
    const result = await updateLandingPageContent(
      "hall-of-fame",
      hallOfFameStats,
    );
    if (result.success) {
      // Optional: Show success toast
    } else {
      setErrorAlert({ isOpen: true, message: "Failed to save statistics" });
    }
    setIsSavingStats(false);
  };

  const handleEdit = (alumnus: Alumni) => {
    setEditingAlumni(alumnus);
    setName(alumnus.name);
    setDistrict(alumnus.district);
    setAcademicYear(alumnus.academicYear);
    setIslandRank(alumnus.islandRank?.toString() || "");
    setDistrictRank(alumnus.districtRank?.toString() || "");
    setImageUrl(alumnus.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      name,
      district,
      academicYear,
      islandRank: islandRank ? parseInt(islandRank) : undefined,
      districtRank: districtRank ? parseInt(districtRank) : undefined,
      imageUrl: imageUrl || undefined,
    };

    const result = editingAlumni
      ? await updateAlumni(editingAlumni.id, data)
      : await createAlumni(data);

    if (result.success) {
      await fetchAlumni();
      closeModal();
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to save alumni",
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteAlert({ isOpen: true, alumniId: id, alumniName: name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAlert.alumniId) return;

    const result = await deleteAlumni(deleteAlert.alumniId);
    if (result.success) {
      await fetchAlumni();
      setDeleteAlert({ isOpen: false, alumniId: null, alumniName: "" });
    } else {
      setErrorAlert({ isOpen: true, message: "Failed to delete alumni" });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAlumni(null);
    setName("");
    setDistrict("");
    setAcademicYear("");
    setIslandRank("");
    setDistrictRank("");
    setImageUrl("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
              <Trophy className="w-7 h-7 sm:w-10 sm:h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                Hall of Fame
              </h1>
              <p className="text-gray-400 text-xs sm:text-lg">
                Celebrating our top achievers
                <span className="ml-2 sm:ml-3 text-[#D4AF37] font-medium">
                  {alumni.length} {alumni.length === 1 ? "Alumni" : "Alumni"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-10 sm:h-12 px-4 sm:px-6 font-bold shadow-lg shadow-[#D4AF37]/30 hidden md:flex sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Alumni
            </Button>
            <Button
              onClick={() => setIsPreviewOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-white gap-2 h-10 sm:h-12 px-4 sm:px-6 font-bold shadow-lg w-full sm:w-auto justify-center"
            >
              <Eye className="w-5 h-5" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Page Settings Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Page Settings</h2>
            <p className="text-sm text-gray-500">
              Manage visibility and analytics for the Hall of Fame page
            </p>
          </div>
          <Button
            onClick={handleSaveStats}
            disabled={isSavingStats}
            className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
          >
            {isSavingStats ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Visibility Toggle */}
          <div className="md:col-span-1 space-y-4 border-r border-gray-100 pr-8">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Visibility
            </h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <Label
                className="text-gray-700 font-medium cursor-pointer"
                htmlFor="hof-toggle"
              >
                Enable Section
              </Label>
              <Switch
                id="hof-toggle"
                checked={hallOfFameStats.isEnabled}
                onCheckedChange={(checked) =>
                  setHallOfFameStats((prev) => ({
                    ...prev,
                    isEnabled: checked,
                  }))
                }
                className="data-[state=checked]:bg-[#D4AF37]"
              />
            </div>
            <p className="text-xs text-gray-500">
              When disabled, the Hall of Fame link will be hidden from the
              navigation bar.
            </p>
          </div>

          {/* Stats Inputs */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Statistics Display
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-800">A Passes</Label>
                <Input
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  value={hallOfFameStats.totalAPasses}
                  onChange={(e) =>
                    setHallOfFameStats({
                      ...hallOfFameStats,
                      totalAPasses: e.target.value,
                    })
                  }
                  placeholder="150+"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800">Pass Rate</Label>
                <Input
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  value={hallOfFameStats.passRate}
                  onChange={(e) =>
                    setHallOfFameStats({
                      ...hallOfFameStats,
                      passRate: e.target.value,
                    })
                  }
                  placeholder="92%"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800">District Ranks</Label>
                <Input
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  value={hallOfFameStats.districtRanks}
                  onChange={(e) =>
                    setHallOfFameStats({
                      ...hallOfFameStats,
                      districtRanks: e.target.value,
                    })
                  }
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-800">Island Ranks</Label>
                <Input
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  value={hallOfFameStats.islandRanks}
                  onChange={(e) =>
                    setHallOfFameStats({
                      ...hallOfFameStats,
                      islandRanks: e.target.value,
                    })
                  }
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {alumni.map((alumnus, index) => (
            <motion.div
              key={alumnus.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative h-64 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
                {alumnus.imageUrl ? (
                  <img
                    src={alumnus.imageUrl}
                    alt={alumnus.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-300" />
                  </div>
                )}

                {/* Rank Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {alumnus.islandRank && (
                    <div className="bg-[#D4AF37] text-[#1a1a1a] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Island #{alumnus.islandRank}
                    </div>
                  )}
                  {alumnus.districtRank && (
                    <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      District #{alumnus.districtRank}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(alumnus)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg transition-colors shadow-lg"
                  >
                    <Edit2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(alumnus.id, alumnus.name)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 rounded-lg transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {alumnus.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>{alumnus.district}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>{alumnus.academicYear}</span>
                  </div>
                </div>
              </div>

              {/* Decorative Bottom Border */}
              <div className="h-1 bg-linear-to-r from-[#D4AF37] via-[#B5952F] to-[#D4AF37]" />
            </motion.div>
          ))}
        </AnimatePresence>

        {alumni.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium">
              No alumni added yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first top achiever to the Hall of Fame
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
              className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg">
                      {editingAlumni ? (
                        <Edit2 className="w-6 h-6 text-[#1a1a1a]" />
                      ) : (
                        <Trophy className="w-6 h-6 text-[#1a1a1a]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {editingAlumni ? "Edit Alumni" : "Add to Hall of Fame"}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {editingAlumni
                          ? "Update alumni information"
                          : "Add a top achiever"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-300 ml-1">Student Name</Label>
                      <Input
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">District</Label>
                      <Input
                        placeholder="e.g. Colombo"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Academic Year
                      </Label>
                      <Input
                        placeholder="e.g. 2022 A/L"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Island Rank{" "}
                        <span className="text-gray-600 text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1"
                        value={islandRank}
                        onChange={(e) => setIslandRank(e.target.value)}
                        min="1"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        District Rank{" "}
                        <span className="text-gray-600 text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 1"
                        value={districtRank}
                        onChange={(e) => setDistrictRank(e.target.value)}
                        min="1"
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-gray-300 ml-1">
                        Image URL{" "}
                        <span className="text-gray-600 text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                      <p className="text-xs text-gray-500 ml-1">
                        Paste a direct link to the student&apos;s image
                      </p>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
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
                        ? editingAlumni
                          ? "Updating..."
                          : "Adding..."
                        : editingAlumni
                          ? "Update Alumni"
                          : "Add to Hall of Fame"}
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
          setDeleteAlert({ isOpen: false, alumniId: null, alumniName: "" })
        }
        onConfirm={handleDeleteConfirm}
        title="Remove from Hall of Fame"
        description={`Are you sure you want to remove "${deleteAlert.alumniName}" from the Hall of Fame? This action cannot be undone.`}
        type="error"
        confirmText="Remove"
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
      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Hall of Fame Preview"
      >
        <ResultsPreview data={alumni} />
      </PreviewModal>
      <FloatingAddButton onClick={() => setIsModalOpen(true)} label="Add Alumni" />
    </div>
  );
}
