"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Calendar,
  X,
  ChevronDown,
  CreditCard,
  Banknote,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { getStudents } from "@/lib/actions/student";
import {
  getStudentPayments,
  recordStudentPayment,
} from "@/lib/actions/payment";

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

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  isActive: boolean;
  classAssignments?: {
    classType: {
      name: string;
      year: { id: string; year: string };
    };
  }[];
}

interface PaymentRecord {
  id: number;
  studentId: string;
  year: number;
  month: number;
  fee: number;
}

export default function ClassFeesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = currentYear - 3; i <= currentYear + 3; i++) years.push(i);
    return years;
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [feeAmount, setFeeAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paidMonths, setPaidMonths] = useState<number[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    const result = await getStudents();
    if (result.success && result.data) setStudents(result.data);
    setIsLoading(false);
  };

  const fetchPayments = async (studentId: string, year: number) => {
    setIsLoadingPayments(true);
    const result = await getStudentPayments(studentId, year);
    if (result.success && result.data) {
      setPaymentRecords(result.data);
      setPaidMonths(result.data.map((p: PaymentRecord) => p.month));
    } else {
      setPaymentRecords([]);
      setPaidMonths([]);
    }
    setIsLoadingPayments(false);
  };

  const handleSelectStudent = (student: Student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setPaidMonths([]);
      setPaymentRecords([]);
      setSelectedMonth(null);
      setFeeAmount("");
    } else {
      setSelectedStudent(student);
      setSelectedMonth(null);
      setFeeAmount("");
      fetchPayments(student.id, selectedYear);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setFeeAmount("");
    if (selectedStudent) fetchPayments(selectedStudent.id, year);
  };

  const getMonthStatus = (
    monthIndex: number,
  ): "paid" | "past-unpaid" | "neutral" => {
    if (paidMonths.includes(monthIndex)) return "paid";

    if (selectedYear < currentYear) return "past-unpaid";
    if (selectedYear === currentYear && monthIndex < currentMonth)
      return "past-unpaid";

    return "neutral";
  };

  const getMonthCardClasses = (
    monthIndex: number,
    isSelected: boolean,
  ): string => {
    if (isSelected) {
      return "bg-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] shadow-md";
    }

    const status = getMonthStatus(monthIndex);

    switch (status) {
      case "paid":
        return "bg-green-50 border-2 border-green-500 text-green-700";
      case "past-unpaid":
        return "bg-red-50 border-2 border-red-400 text-red-700";
      case "neutral":
      default:
        return "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (paidMonths.includes(monthIndex)) {
      const existingPayment = paymentRecords.find(
        (p) => p.month === monthIndex,
      );
      if (existingPayment) {
        setSelectedMonth(monthIndex);
        setFeeAmount(existingPayment.fee.toString());
      }
      return;
    }

    if (selectedMonth === monthIndex) {
      setSelectedMonth(null);
      setFeeAmount("");
    } else {
      setSelectedMonth(monthIndex);
      setFeeAmount("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent) return;
    if (selectedMonth === null) {
      setErrorAlert({ isOpen: true, message: "Please select a month" });
      return;
    }
    if (!feeAmount || Number(feeAmount) <= 0) {
      setErrorAlert({
        isOpen: true,
        message: "Please enter a valid fee amount",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await recordStudentPayment({
        studentId: selectedStudent.id,
        year: selectedYear,
        month: selectedMonth,
        fee: Number(feeAmount),
      });

      if (result.success) {
        setSuccessAlert({
          isOpen: true,
          message: result.message || "Payment recorded successfully",
        });
        fetchPayments(selectedStudent.id, selectedYear);
        setSelectedMonth(null);
        setFeeAmount("");
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to record payment",
        });
      }
    } catch {
      setErrorAlert({ isOpen: true, message: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExistingFeeForMonth = (monthIndex: number): number | null => {
    const payment = paymentRecords.find((p) => p.month === monthIndex);
    return payment ? payment.fee : null;
  };

  const filteredStudents = students.filter(
    (student) =>
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <CreditCard className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Class Fees Management
              </h1>
              <p className="text-gray-400 text-lg">
                Manage student payments and class fees
                <span className="ml-3 text-[#D4AF37] font-medium">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1 ? "Student" : "Students"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Students List */}
        <div className="lg:w-[65%] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, email, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-380px)] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No students found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedStudent?.id === student.id
                            ? "bg-[#D4AF37]/5 border-l-4 border-[#D4AF37]"
                            : ""
                        }`}
                      >
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Form */}
        <div className="lg:w-[35%]">
          <AnimatePresence mode="wait">
            {!selectedStudent ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed p-8 text-center min-h-[400px] flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Banknote className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select a Student
                </h3>
                <p className="text-gray-500 max-w-xs">
                  Click on a student from the list to view and manage their
                  class fee payments.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                {/* Student Info */}
                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {selectedStudent.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {selectedStudent.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStudent(null);
                        setPaidMonths([]);
                        setPaymentRecords([]);
                        setSelectedMonth(null);
                        setFeeAmount("");
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Year Dropdown */}
                <div className="space-y-2 mb-4">
                  <Label className="text-gray-700 ml-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    Academic Year
                  </Label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      className="w-full h-11 rounded-xl bg-white border border-gray-300 text-gray-900 px-3 pr-8 appearance-none focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 focus:outline-none transition-all cursor-pointer text-sm"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Month Grid */}
                {/* <div className="space-y-2 mb-4">
                  <Label className="text-gray-700 ml-1">Select Month</Label>
                  {isLoadingPayments ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map((month, index) => {
                        const isSelected = selectedMonth === index;

                        return (
                          <button
                            key={month}
                            type="button"
                            onClick={() => handleMonthSelect(index)}
                            className={`p-3 rounded-xl border-2 transition-all text-center font-semibold text-sm ${getMonthCardClasses(index, isSelected)}`}
                          >
                            {month.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div> */}

                {/* Month Grid */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-700 ml-1">Select Month</Label>
                    {/* Legend / Map */}
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                        Paid
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                        Unpaid
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
                        Upcoming
                      </span>
                    </div>
                  </div>
                  {isLoadingPayments ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map((month, index) => {
                        const isPaid = paidMonths.includes(index);
                        const isSelected = selectedMonth === index;

                        return (
                          <button
                            key={month}
                            type="button"
                            onClick={() => handleMonthSelect(index)}
                            className={`p-3 rounded-xl border-2 transition-all text-center font-semibold text-sm relative ${getMonthCardClasses(index, isSelected)}`}
                          >
                            <span>{month.slice(0, 3)}</span>
                            {/* Checkmark for selected card */}
                            {isSelected && !isPaid && (
                              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center shadow">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </span>
                            )}
                            {/* Checkmark for paid card */}
                            {isPaid && (
                              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                {paymentRecords.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {paidMonths.length} month
                        {paidMonths.length !== 1 ? "s" : ""} paid
                      </span>
                      <span className="text-sm font-bold text-[#D4AF37]">
                        LKR{" "}
                        {paymentRecords
                          .reduce((sum, p) => sum + p.fee, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Fee Input */}
                {selectedMonth !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 mb-4"
                  >
                    <div className="border-t border-gray-200 pt-4">
                      <Label className="text-gray-700 ml-1">
                        Class Fee Amount (LKR)
                      </Label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                          LKR
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Enter amount"
                          value={feeAmount}
                          onChange={(e) => setFeeAmount(e.target.value)}
                          className="pl-14 h-12 rounded-xl bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 placeholder:text-gray-400"
                        />
                      </div>
                      {getExistingFeeForMonth(selectedMonth) !== null && (
                        <p className="text-xs text-amber-600 mt-1 ml-1">
                          Current: LKR{" "}
                          {getExistingFeeForMonth(
                            selectedMonth,
                          )?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedMonth === null}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recording...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {selectedMonth !== null &&
                      paidMonths.includes(selectedMonth)
                        ? "Update Payment"
                        : "Record Payment"}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Alerts */}
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
