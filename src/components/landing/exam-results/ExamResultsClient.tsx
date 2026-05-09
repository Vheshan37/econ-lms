"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Hash,
  FormInput,
  Award,
  Calendar,
  ChevronDown,
  Shield,
  Loader2,
  AlertTriangle,
  FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupStudentResults } from "@/lib/actions/exam-results";
import { Navbar } from "@/components/Navbar";

interface ExamMark {
  id: number;
  marks: string;
  index: {
    id: number;
    index_no: string;
  };
  exam: {
    id: number;
    title: string;
    exam_date: string;
    desc: string;
  };
}

interface StudentResult {
  indexNumber: string;
  marks: ExamMark[];
}

export function ExamResultsClient() {
  const [indexNumber, setIndexNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [studentResult, setStudentResult] = useState<StudentResult | null>(
    null,
  );
  const [error, setError] = useState("");
  const [expandedExam, setExpandedExam] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!indexNumber.trim()) {
      setError("Please enter your index number");
      return;
    }

    setIsSearching(true);
    setError("");
    setStudentResult(null);

    try {
      const result = await lookupStudentResults(indexNumber.trim());

      if (result.success && result.data) {
        setStudentResult(result.data);
      } else {
        setError(result.error || "No results found for this index number");
      }
    } catch (error) {
      setError("An error occurred while fetching results. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReset = () => {
    setStudentResult(null);
    setIndexNumber("");
    setError("");
    setExpandedExam(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-6">
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Exam <span className="text-yellow-500">Results</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-base">
              Enter your index number to view your exam results securely.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          {!studentResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <FormInput className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white">
                    Check Your Results
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Enter your index number to view your marks
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      placeholder="Enter index number (e.g., 111200)"
                      value={indexNumber}
                      onChange={(e) => {
                        setIndexNumber(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleKeyDown}
                      className="pl-12 h-14 rounded-xl bg-black border-white/10 text-white text-lg placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                    />
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20 transition-all"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        View Results
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-amber-900/20 border border-amber-700/50 rounded-xl flex items-start gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-300 text-sm font-medium">
                        Notice
                      </p>
                      <p className="text-amber-200/80 text-sm mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:w-[380px] flex-shrink-0"
              >
                <div className="sticky top-24 space-y-5">
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Search Result</h3>
                        <p className="text-xs text-gray-500">
                          Enter your index number
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          placeholder="Index number"
                          value={indexNumber}
                          onChange={(e) => {
                            setIndexNumber(e.target.value);
                            setError("");
                          }}
                          onKeyDown={handleKeyDown}
                          className="pl-10 h-11 rounded-xl bg-black border-white/10 text-white text-sm placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="flex-1 h-11 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl text-sm"
                        >
                          {isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Search"
                          )}
                        </Button>
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="h-11 px-4 rounded-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <ChevronDown className="w-4 h-4 rotate-90" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Student Info</h3>
                        <p className="text-xs text-gray-500">
                          Your results summary
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                        <Hash className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-xs text-gray-500">Index Number</p>
                          <p className="text-white font-bold">
                            {studentResult.indexNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                        <FileSearch className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-xs text-gray-500">Exams Found</p>
                          <p className="text-white font-bold">
                            {studentResult.marks.length}
                          </p>
                        </div>
                      </div>

                      {studentResult.marks.length > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Best Grade (
                              {studentResult.marks
                                .sort(
                                  (a, b) =>
                                    parseFloat(b.marks) - parseFloat(a.marks),
                                )[0]
                                ?.exam.title.slice(0, 20)}
                              {studentResult.marks.sort(
                                (a, b) =>
                                  parseFloat(b.marks) - parseFloat(a.marks),
                              )[0]?.exam.title.length > 20
                                ? "..."
                                : ""}
                              )
                            </p>
                            <p className="text-yellow-500 font-bold">
                              {(() => {
                                const best = parseFloat(
                                  studentResult.marks.sort(
                                    (a, b) =>
                                      parseFloat(b.marks) - parseFloat(a.marks),
                                  )[0]?.marks || "0",
                                );
                                return best >= 75
                                  ? "A"
                                  : best >= 65
                                    ? "B"
                                    : best >= 55
                                      ? "C"
                                      : best >= 35
                                        ? "S"
                                        : "F";
                              })()}{" "}
                              (
                              {
                                studentResult.marks.sort(
                                  (a, b) =>
                                    parseFloat(b.marks) - parseFloat(a.marks),
                                )[0]?.marks
                              }
                              %)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 min-w-0"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-white">
                    Exam Results{" "}
                    <span className="text-yellow-500 text-base font-normal">
                      ({studentResult.marks.length})
                    </span>
                  </h2>
                </div>

                <div
                  className={`${studentResult.marks.length > 8 ? "max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar" : ""}`}
                >
                  <div className="space-y-4">
                    {studentResult.marks
                      .sort(
                        (a, b) =>
                          new Date(b.exam.exam_date).getTime() -
                          new Date(a.exam.exam_date).getTime(),
                      )
                      .map((mark) => {
                        const marksValue = parseFloat(mark.marks);
                        const grade =
                          marksValue >= 75
                            ? "A"
                            : marksValue >= 65
                              ? "B"
                              : marksValue >= 55
                                ? "C"
                                : marksValue >= 35
                                  ? "S"
                                  : "F";
                        const isExpanded = expandedExam === mark.exam.id;

                        return (
                          <motion.div
                            key={mark.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-white/10 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:border-yellow-500/30 transition-all"
                          >
                            <button
                              onClick={() =>
                                setExpandedExam(
                                  isExpanded ? null : mark.exam.id,
                                )
                              }
                              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                                    grade === "A"
                                      ? "bg-green-500/10"
                                      : grade === "F"
                                        ? "bg-amber-500/10"
                                        : "bg-yellow-500/10"
                                  }`}
                                >
                                  <Award
                                    className={`w-5 h-5 ${
                                      grade === "A"
                                        ? "text-green-400"
                                        : grade === "F"
                                          ? "text-amber-400"
                                          : "text-yellow-400"
                                    }`}
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-white">
                                    {mark.exam.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-0.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                      {new Date(
                                        mark.exam.exam_date,
                                      ).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-yellow-500">
                                  {marksValue}%
                                </span>
                                <span
                                  className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                                    grade === "A"
                                      ? "bg-green-900/50 text-green-300"
                                      : grade === "F"
                                        ? "bg-amber-900/50 text-amber-300"
                                        : "bg-yellow-900/50 text-yellow-300"
                                  }`}
                                >
                                  {grade}
                                </span>
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-500 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                                    {/* Mark Details */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                          Marks Scored
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                          {marksValue}%
                                        </p>
                                      </div>
                                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                          Grade Achieved
                                        </p>
                                        <p className="text-xl font-bold text-yellow-500">
                                          {grade}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 mb-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                                          Performance
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {marksValue}%
                                        </p>
                                      </div>
                                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${marksValue}%` }}
                                          transition={{
                                            duration: 1,
                                            delay: 0.2,
                                          }}
                                          className={`h-full rounded-full ${
                                            marksValue >= 75
                                              ? "bg-gradient-to-r from-green-500 to-green-400"
                                              : marksValue >= 50
                                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                                : "bg-gradient-to-r from-amber-500 to-amber-400"
                                          }`}
                                        />
                                      </div>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                        Grade Scale
                                      </p>
                                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                                        <div
                                          className={`p-1.5 rounded-md ${grade === "A" ? "bg-green-500 text-white font-bold" : "bg-gray-800 text-gray-400"}`}
                                        >
                                          A<br />
                                          75-100
                                        </div>
                                        <div
                                          className={`p-1.5 rounded-md ${grade === "B" ? "bg-green-600 text-white font-bold" : "bg-gray-800 text-gray-400"}`}
                                        >
                                          B<br />
                                          65-74
                                        </div>
                                        <div
                                          className={`p-1.5 rounded-md ${grade === "C" ? "bg-yellow-500 text-black font-bold" : "bg-gray-800 text-gray-400"}`}
                                        >
                                          C<br />
                                          55-64
                                        </div>
                                        <div
                                          className={`p-1.5 rounded-md ${grade === "S" ? "bg-amber-500 text-white font-bold" : "bg-gray-800 text-gray-400"}`}
                                        >
                                          S<br />
                                          35-54
                                        </div>
                                        <div
                                          className={`p-1.5 rounded-md ${grade === "F" ? "bg-red-500 text-white font-bold" : "bg-gray-800 text-gray-400"}`}
                                        >
                                          F<br />
                                          0-34
                                        </div>
                                      </div>
                                    </div>

                                    {mark.exam.desc && (
                                      <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                          Description
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                          {mark.exam.desc}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
