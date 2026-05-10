'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Hash, Award, Trash2, Search, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ExamMark {
  id: number;
  marks: string;
  index: {
    id: number;
    index_no: string;
    student_name: string;  
  };
}

interface Exam {
  id: number;
  title: string;
  exam_date: Date | string;
  desc: string;
  marks: ExamMark[];
}

interface ExistingExamsListProps {
  exams: Exam[];
  continuingExamId: number | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onContinueExam: (exam: Exam) => void;
  onDeleteExam: (examId: number, title: string) => void;
  onDoubleClickMark: (exam: Exam, mark: ExamMark) => void;
}

export function ExistingExamsList({
  exams,
  continuingExamId,
  searchQuery,
  onSearchChange,
  onContinueExam,
  onDeleteExam,
  onDoubleClickMark,
}: ExistingExamsListProps) {
  const [expandedExam, setExpandedExam] = useState<number | null>(null);

  const filteredExams = exams.filter(exam =>
    !searchQuery ||
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.marks.some(m => m.index.index_no.includes(searchQuery))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Existing Exams</h2>
          <p className="text-sm text-gray-500 mt-1">View, manage, or continue adding marks. Double‑click a row to edit that mark.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search exams or index numbers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-[#D4AF37] w-80"
          />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="text-center py-16">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No exams found</p>
          <p className="text-gray-400 text-sm mt-1">{searchQuery ? 'Try adjusting your search' : 'Create your first exam above'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-xl overflow-hidden ${continuingExamId === exam.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-gray-200'}`}
            >
              <div
                className={`p-4 border-b cursor-pointer transition-colors ${continuingExamId === exam.id ? 'bg-[#D4AF37]/5' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${continuingExamId === exam.id ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10'}`}>
                      <Award className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{exam.title}</h3>
                        {continuingExamId === exam.id && (
                          <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-medium">Editing</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(exam.exam_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{exam.marks.length} student{exam.marks.length !== 1 ? 's' : ''}</span>
                        {exam.desc && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span className="truncate max-w-[200px]">{exam.desc}</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onContinueExam(exam); }} className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors" title="Continue adding marks">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteExam(exam.id, exam.title); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedExam === exam.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedExam === exam.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4">
                      {exam.marks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No marks recorded for this exam</p>
                      ) : (
                        <div className={exam.marks.length > 8 ? 'max-h-[400px] overflow-y-auto' : ''}>
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200 sticky top-0 bg-white z-10">
                                <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700 uppercase bg-white">Rank</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700 uppercase bg-white">Index Number</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700 uppercase bg-white">Marks</th>
                                <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700 uppercase bg-white">Grade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[...exam.marks].sort((a, b) => parseFloat(b.marks) - parseFloat(a.marks)).map((mark, index) => {
                                const marksValue = parseFloat(mark.marks);
                                const grade = marksValue >= 75 ? 'A' : marksValue >= 65 ? 'B' : marksValue >= 55 ? 'C' : marksValue >= 35 ? 'S' : 'F';
                                return (
                                  <tr key={mark.id} onDoubleClick={() => onDoubleClickMark(exam, mark)} className="hover:bg-gray-50 transition-colors cursor-pointer" title="Double‑click to edit this mark">
                                    <td className="py-2 px-4 text-sm font-medium">{index + 1}{index === 0 && ' 🥇'}{index === 1 && ' 🥈'}{index === 2 && ' 🥉'}</td>
                                    <td className="py-2 px-4 font-medium text-gray-900">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <Hash className="w-3 h-3 text-gray-400" />
                                          {mark.index.index_no}
                                        </div>
                                        {mark.index.student_name && (
                                          <p className="text-xs text-gray-500 ml-5">{mark.index.student_name}</p>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-4">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${grade === 'A' ? 'bg-green-100 text-green-800' : grade === 'F' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'}`}>{marksValue}%</span>
                                    </td>
                                    <td className="py-2 px-4">
                                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${grade === 'A' ? 'bg-green-100 text-green-700' : grade === 'F' ? 'bg-amber-100 text-amber-700' : 'bg-yellow-100 text-yellow-700'}`}>{grade}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}