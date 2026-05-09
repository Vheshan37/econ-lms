'use client';

import { Award } from 'lucide-react';

interface ExamHeaderProps {
  title: string;
  subtitle: string;
  examCount: number;
}

export function ExamHeader({ title, subtitle, examCount }: ExamHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <Award className="w-10 h-10 text-[#1a1a1a]" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-400 text-lg">
              {subtitle}
              <span className="ml-3 text-[#D4AF37] font-medium">
                {examCount} {examCount === 1 ? 'Exam' : 'Exams'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}