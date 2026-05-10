"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ChevronDown, } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnrollmentModal } from "./EnrollmentModal";

export interface AcademicYearWithClasses {
  id: string;
  year: string;
  description: string | null;
  classTypes: {
    name: string;
  }[];
}

interface CoursesSectionProps {
  years: AcademicYearWithClasses[];
  whatsappNumber: string;
}

export function CoursesSection({ years, whatsappNumber }: CoursesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  const handleEnroll = (batch: string) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const toggleYear = (yearId: string) => {
    setExpandedYear(expandedYear === yearId ? null : yearId);
  };

  const getColors = (index: number) => {
    const colors = [
      { gradient: "from-yellow-600 to-yellow-800", bar: "bg-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", dot: "bg-yellow-400", btnHover: "hover:bg-yellow-500" },
      { gradient: "from-blue-600 to-blue-800", bar: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-400", btnHover: "hover:bg-blue-500" },
      { gradient: "from-purple-600 to-purple-800", bar: "bg-purple-500", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", dot: "bg-purple-400", btnHover: "hover:bg-purple-500" },
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="courses" className="md:pt-16 bg-[#050505] text-white">
      <div className="container mx-auto px-4">
        <div className="block md:hidden">
          <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-[#111]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Available Batches</h3>
                  <p className="text-xs text-gray-500">Tap a year to see details</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-800">
              {years.map((year, index) => {
                const colors = getColors(index);
                const isExpanded = expandedYear === year.id;
                const classNames = year.classTypes.map((c) => c.name);

                return (
                  <div key={year.id}>
                    <button
                      onClick={() => toggleYear(year.id)}
                      className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-12 rounded-full ${colors.bar}`} />
                        <div>
                          <h4 className="text-2xl font-bold text-white">{year.year}</h4>
                          <p className={`${colors.text} text-xs font-medium uppercase tracking-wider`}>
                            Advanced Level
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {classNames.length} class{classNames.length !== 1 ? 'es' : ''}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-3">
                            {/* Class Types */}
                            {classNames.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                                  Available Classes
                                </p>
                                {classNames.map((className, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl ${colors.bg} ${colors.border} border`}
                                  >
                                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                    <span className="text-gray-200 text-sm font-medium flex-1">
                                      {className}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            )}

                            {year.description && (
                              <p className="text-gray-400 text-sm leading-relaxed pt-2">
                                {year.description}
                              </p>
                            )}

                            <Button
                              size="lg"
                              className="w-full bg-white hover:bg-yellow-500 text-black hover:text-black font-semibold rounded-xl transition-all mt-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnroll(year.year);
                              }}
                            >
                              Enroll {year.year} Batch
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-yellow-500/5 border-t border-yellow-500/10">
              <p className="text-xs text-gray-500 text-center">
                💡 All classes include comprehensive study materials and past paper discussions
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {years.map((year, index) => {
            const classNames = year.classTypes.map((c) => c.name);
            const colors = getColors(index);

            return (
              <div
                key={year.id}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 flex flex-col"
              >
                <div className={`h-2 bg-gradient-to-r ${colors.gradient} flex-shrink-0`} />

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="space-y-5 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-3xl md:text-4xl font-bold text-white">
                          {year.year}
                        </h4>
                        <p className={`${colors.text} text-sm font-medium uppercase tracking-wider mt-1`}>
                          Advanced Level
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.border} border`}>
                        <Calendar className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {classNames.length > 0 ? (
                        <>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Available Classes</p>
                          <div className="space-y-2">
                            {classNames.map((className, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${colors.bg} ${colors.border} border transition-all hover:scale-[1.02]`}
                              >
                                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                <span className="text-gray-200 text-sm font-medium">
                                  {className}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className={`px-4 py-3 rounded-xl ${colors.bg} ${colors.border} border`}>
                          <span className="text-gray-300 text-sm">Classes Available</span>
                        </div>
                      )}
                    </div>

                    {year.description && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {year.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-800 mt-auto">
                    <Button
                      size="lg"
                      className={`w-full bg-white hover:bg-yellow-500 text-black hover:text-black font-semibold rounded-xl transition-all duration-300`}
                      onClick={() => handleEnroll(year.year)}
                    >
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>

        {years.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No batches available yet</p>
            <p className="text-gray-600 text-sm mt-2">New batches will be announced soon. Stay tuned!</p>
          </div>
        )}
      </div>

      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
        whatsappNumber={whatsappNumber}
      />
    </section>
  );
}