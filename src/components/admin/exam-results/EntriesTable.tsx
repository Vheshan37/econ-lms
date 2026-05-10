'use client';

import { Hash, X, AlertTriangle } from 'lucide-react';

interface ExamEntry {
  id: string;
  indexNumber: string;
  studentName: string;
  marks: number;
}

interface EntriesTableProps {
  entries: ExamEntry[];
  editingEntryId: string | null;
  title: string;
  onDoubleClick: (entry: ExamEntry) => void;
  onRemove: (id: string) => void;
}

export function EntriesTable({ entries, editingEntryId, title, onDoubleClick, onRemove }: EntriesTableProps) {
  if (entries.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h4 className="font-semibold text-gray-700">{title} ({entries.length})</h4>
        {entries.length > 8 && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />Scroll to see more
          </span>
        )}
      </div>
      <div className={entries.length > 8 ? 'h-[400px] overflow-y-auto' : ''}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">Index Number</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">Grade</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry, index) => {
              const grade = entry.marks >= 75 ? 'A' : entry.marks >= 65 ? 'B' : entry.marks >= 55 ? 'C' : entry.marks >= 35 ? 'S' : 'F';
              return (
                <tr
                  key={entry.id}
                  onDoubleClick={() => onDoubleClick(entry)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer group ${editingEntryId === entry.id ? 'bg-[#D4AF37]/5' : ''}`}
                >
                  <td className="px-6 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3 text-gray-400" />
                        {entry.indexNumber}
                      </div>
                      {entry.studentName && (
                        <p className="text-xs text-gray-500 ml-5">{entry.studentName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      grade === 'A' ? 'bg-green-100 text-green-800' : grade === 'F' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{entry.marks}%</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      grade === 'A' ? 'bg-green-100 text-green-700' : grade === 'F' ? 'bg-amber-100 text-amber-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{grade}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => onRemove(entry.id)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Remove entry">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}