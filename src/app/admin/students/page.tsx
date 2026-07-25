"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Trash2,
  Users,
  Search,
  Mail,
  Calendar,
  BookOpen,
  X,
  UserPlus,
  Filter,
  ChevronUp,
  ChevronDown,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  assignClassTypes,
  removeClassType,
} from "@/lib/actions/student";
import { getYears } from "@/lib/actions/year";

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  dateOfBirth: Date;
  isActive: boolean;
  createdAt: Date;
  classAssignments: {
    id: string;
    classType: {
      id: string;
      name: string;
      year: {
        id: string;
        year: string;
      };
    };
  }[];
}

interface Year {
  id: string;
  year: string;
  isActive: boolean;
  classTypes: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYearId, setFilterYearId] = useState<string>("");
  const [filterClassTypeId, setFilterClassTypeId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Registration/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [registrationStep, setRegistrationStep] = useState(1);

  // Form State
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [selectedClassTypes, setSelectedClassTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert Dialog State
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    studentId: string | null;
    studentName: string;
  }>({
    isOpen: false,
    studentId: null,
    studentName: "",
  });
  const [errorAlert, setErrorAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    const [studentsResult, yearsResult] = await Promise.all([
      getStudents(),
      getYears(),
    ]);

    if (studentsResult.success && studentsResult.data) {
      setStudents(studentsResult.data);
    }

    if (yearsResult.success && yearsResult.data) {
      // Fetch class types for each year
      const yearsWithTypes = await Promise.all(
        yearsResult.data.map(async (year: any) => {
          const { getYearById } = await import("@/lib/actions/year");
          const result = await getYearById(year.id);
          return result.success && result.data ? result.data : year;
        }),
      );
      setYears(yearsWithTypes);
    }

    setIsLoading(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setSchool(student.school);
    setDateOfBirth(new Date(student.dateOfBirth).toISOString().split("T")[0]);
    setEmail(student.email);
    setSelectedClassTypes(student.classAssignments.map((a) => a.classType.id));
    setRegistrationStep(1);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (registrationStep === 1) {
      if (!name || !school || !dateOfBirth) {
        setErrorAlert({
          isOpen: true,
          message: "Please fill in all personal information",
        });
        return;
      }
      setRegistrationStep(2);
    } else if (registrationStep === 2) {
      if (!email) {
        setErrorAlert({
          isOpen: true,
          message: "Please enter an email address",
        });
        return;
      }
      setRegistrationStep(3);
    } else if (registrationStep === 3) {
      if (selectedClassTypes.length === 0) {
        setErrorAlert({
          isOpen: true,
          message: "Please select at least one class type",
        });
        return;
      }

      setIsSubmitting(true);

      if (editingStudent) {
        // Update existing student
        const updateData: any = {
          name,
          school,
          dateOfBirth,
          email,
        };

        const result = await updateStudent(editingStudent.id, updateData);

        if (result.success) {
          // Update class assignments
          const currentClassTypeIds = editingStudent.classAssignments.map(
            (a) => a.classType.id,
          );
          const toAdd = selectedClassTypes.filter(
            (id) => !currentClassTypeIds.includes(id),
          );
          const toRemove = currentClassTypeIds.filter(
            (id) => !selectedClassTypes.includes(id),
          );

          // Add new assignments
          if (toAdd.length > 0) {
            await assignClassTypes(editingStudent.id, toAdd);
          }

          // Remove old assignments
          for (const classTypeId of toRemove) {
            await removeClassType(editingStudent.id, classTypeId);
          }

          await fetchData();
          closeModal();
        } else {
          setErrorAlert({
            isOpen: true,
            message: result.error || "Failed to update student",
          });
        }
      } else {
        // Create new student
        const result = await createStudent({
          name,
          school,
          dateOfBirth,
          email,
          classTypeIds: selectedClassTypes,
        });

        if (result.success) {
          await fetchData();
          closeModal();
        } else {
          setErrorAlert({
            isOpen: true,
            message: result.error || "Failed to create student",
          });
        }
      }
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteAlert({ isOpen: true, studentId: id, studentName: name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAlert.studentId) return;

    const result = await deleteStudent(deleteAlert.studentId);
    if (result.success) {
      await fetchData();
      setDeleteAlert({ isOpen: false, studentId: null, studentName: "" });
    } else {
      setErrorAlert({ isOpen: true, message: "Failed to delete student" });
    }
  };

  const toggleClassType = (classTypeId: string) => {
    setSelectedClassTypes((prev) =>
      prev.includes(classTypeId)
        ? prev.filter((id) => id !== classTypeId)
        : [...prev, classTypeId],
    );
  };

  const toggleRowExpansion = (studentId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setRegistrationStep(1);
    setName("");
    setSchool("");
    setDateOfBirth("");
    setEmail("");
    setSelectedClassTypes([]);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      !filterYearId ||
      student.classAssignments.some(
        (a) => a.classType.year.id === filterYearId,
      );

    const matchesClassType =
      !filterClassTypeId ||
      student.classAssignments.some(
        (a) => a.classType.id === filterClassTypeId,
      );

    return matchesSearch && matchesYear && matchesClassType;
  });

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 flex-shrink-0">
              <Users className="w-7 h-7 sm:w-10 sm:h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                Student Management
              </h1>
              <p className="text-gray-400 text-xs sm:text-lg">
                Manage student accounts and class assignments
                <span className="block sm:inline sm:ml-2 sm:ml-3 text-[#D4AF37] font-medium">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1 ? "Student" : "Students"}
                </span>
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-10 sm:h-12 px-4 sm:px-6 font-bold shadow-lg shadow-[#D4AF37]/30 w-full sm:w-auto justify-center"
          >
            <UserPlus className="w-5 h-5" />
            Register Student
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 h-12 rounded-xl"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterYearId || filterClassTypeId) && (
              <span className="ml-1 px-2 py-0.5 bg-[#D4AF37] text-white text-xs rounded-full">
                {[filterYearId, filterClassTypeId].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label className="text-gray-700">Filter by Year</Label>
              <select
                value={filterYearId}
                onChange={(e) => setFilterYearId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Filter by Class Type</Label>
              <select
                value={filterClassTypeId}
                onChange={(e) => setFilterClassTypeId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2"
              >
                <option value="">All Class Types</option>
                {years.flatMap(
                  (year) =>
                    year.classTypes?.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {year.year} - {ct.name}
                      </option>
                    )) || [],
                )}
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Classes
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No students found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery || filterYearId || filterClassTypeId
                        ? "Try adjusting your search or filters"
                        : "Register your first student to get started"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {student.school}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRowExpansion(student.id)}
                          className="flex items-center gap-1 text-sm text-[#D4AF37] hover:text-[#B5952F]"
                        >
                          <span>
                            {student.classAssignments.length} class
                            {student.classAssignments.length !== 1 ? "es" : ""}
                          </span>
                          {expandedRows.has(student.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                            title="Edit student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClick(student.id, student.name)
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(student.id) && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="flex flex-wrap gap-2">
                            {student.classAssignments.map((assignment) => (
                              <span
                                key={assignment.id}
                                className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium"
                              >
                                {assignment.classType.year.year} -{" "}
                                {assignment.classType.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration/Edit Modal */}
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
                      {editingStudent ? (
                        <Edit2 className="w-6 h-6 text-[#1a1a1a]" />
                      ) : (
                        <UserPlus className="w-6 h-6 text-[#1a1a1a]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {editingStudent ? "Edit Student" : "Register Student"}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Step {registrationStep} of 3
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

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        step <= registrationStep
                          ? "bg-[#D4AF37]"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Step 1: Personal Information */}
                {registrationStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">Full Name</Label>
                      <Input
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">School</Label>
                      <Input
                        placeholder="e.g. Royal College"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Date of Birth
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Account Credentials */}
                {registrationStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-300 ml-1">
                        Email / Username
                      </Label>
                      <Input
                        type="email"
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={!!editingStudent}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600 disabled:opacity-50"
                      />
                      {editingStudent && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400">
                            Email cannot be changed once registered.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Class Assignments */}
                {registrationStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-4">
                      <Label className="text-gray-300 ml-1">
                        Select Class Types
                      </Label>
                      {years
                        .filter((year) => year.isActive)
                        .map((year) => {
                          const activeClassTypes =
                            year.classTypes?.filter((ct) => ct.isActive) || [];
                          if (activeClassTypes.length === 0) return null;

                          return (
                            <div key={year.id} className="space-y-2">
                              <p className="text-sm font-medium text-[#D4AF37]">
                                {year.year}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {activeClassTypes.map((classType) => (
                                  <button
                                    key={classType.id}
                                    type="button"
                                    onClick={() =>
                                      toggleClassType(classType.id)
                                    }
                                    className={`p-3 rounded-xl border transition-all text-left ${
                                      selectedClassTypes.includes(classType.id)
                                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        {classType.name}
                                      </span>
                                      {selectedClassTypes.includes(
                                        classType.id,
                                      ) && <Check className="w-4 h-4" />}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {selectedClassTypes.length > 0 && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-2">
                          Selected: {selectedClassTypes.length} class type(s)
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
                  {registrationStep > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                      onClick={() => setRegistrationStep(registrationStep - 1)}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingStudent
                        ? "Updating..."
                        : "Creating..."
                      : registrationStep === 3
                        ? editingStudent
                          ? "Update Student"
                          : "Register Student"
                        : "Next"}
                    {registrationStep < 3 && (
                      <ChevronRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        onClose={() =>
          setDeleteAlert({ isOpen: false, studentId: null, studentName: "" })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        description={`Are you sure you want to delete "${deleteAlert.studentName}"? This will permanently delete their account and all associated data.`}
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
    </div>
  );
}
