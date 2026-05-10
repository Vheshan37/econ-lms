'use client';

import { Calendar, Plus, Edit2, X, AlertTriangle, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarksInputRow } from './MarksInputRow';
import { EntriesTable } from './EntriesTable';

interface ExamEntry {
  id: string;
  indexNumber: string;
  studentName: string;
  marks: number;
}

interface ExamFormProps {
  continuingExamId: number | null;
  continuingExamTitle: string;
  editingExistingMark: { examId: number; markId: number; indexNumber: string; currentMarks: number } | null;
  examTitle: string;
  examDate: string;
  examDesc: string;
  examTitleWarning: string;
  isCheckingExam: boolean;
  duplicateExamId: number | null;
  indexNumber: string;
  studentName: string;
  marks: string;
  editingEntryId: string | null;
  entries: ExamEntry[];
  isBlocked: boolean;
  isCheckingIndex: boolean;
  indexWarning: string;
  isSubmitting: boolean;
  onExamTitleChange: (value: string) => void;
  onExamDateChange: (value: string) => void;
  onExamDescChange: (value: string) => void;
  onIndexChange: (value: string) => void;
  onStudentNameChange: (value: string) => void;
  onMarksChange: (value: string) => void;
  onAddOrUpdate: () => void;
  onClearEntry: () => void;
  onClearAll: () => void;
  onSubmit: () => void;
  onContinueExam: () => void;
  onGoToDuplicateExam: (examId: number) => void;
  onEntryDoubleClick: (entry: ExamEntry) => void;
  onRemoveEntry: (id: string) => void;
}

export function ExamForm({
  continuingExamId,
  continuingExamTitle,
  editingExistingMark,
  examTitle,
  examDate,
  examDesc,
  examTitleWarning,
  isCheckingExam,
  duplicateExamId,
  indexNumber,
  studentName,
  marks,
  editingEntryId,
  entries,
  isBlocked,
  isCheckingIndex,
  indexWarning,
  isSubmitting,
  onExamTitleChange,
  onExamDateChange,
  onExamDescChange,
  onIndexChange,
  onStudentNameChange,
  onMarksChange,
  onAddOrUpdate,
  onClearEntry,
  onClearAll,
  onSubmit,
  onGoToDuplicateExam,
  onEntryDoubleClick,
  onRemoveEntry,
}: ExamFormProps) {
  const isEditing = !!(continuingExamId || editingExistingMark);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 ${continuingExamId ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-gray-200'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isEditing ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10'}`}>
          {isEditing ? <Edit2 className="w-6 h-6 text-[#D4AF37]" /> : <Plus className="w-6 h-6 text-[#D4AF37]" />}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingExistingMark
              ? `Update Mark for #${editingExistingMark.indexNumber}`
              : continuingExamId
              ? `Continue: ${continuingExamTitle}`
              : 'Create New Exam'}
          </h2>
          <p className="text-sm text-gray-500">
            {editingExistingMark
              ? 'Change the marks below and click Update Mark'
              : continuingExamId
              ? 'Add more student marks to this existing exam'
              : 'Enter exam details and add student marks'}
          </p>
        </div>
        {isEditing && (
          <Button onClick={onClearAll} variant="outline" className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50">
            <X className="w-4 h-4" />{editingExistingMark ? 'Cancel Edit' : 'Stop Editing'}
          </Button>
        )}
      </div>

      {!isEditing && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-gray-700 ml-1">Exam Title or Hall</Label>
              <div className="relative">
                <Input
                  placeholder="e.g., First Term Test 2026"
                  value={examTitle}
                  onChange={(e) => onExamTitleChange(e.target.value)}
                  className={`h-12 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 ${examTitleWarning ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]'}`}
                />
                {isCheckingExam && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div>}
              </div>
              {examTitleWarning && (
                <div className="space-y-2">
                  <p className="text-xs flex items-start gap-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" /><span>{examTitleWarning}</span>
                  </p>
                  {duplicateExamId && (
                    <button onClick={() => onGoToDuplicateExam(duplicateExamId)} className="text-xs flex items-center gap-1 text-[#D4AF37] hover:text-[#B5952F] font-medium ml-1">
                      <Edit2 className="w-3 h-3" />Click here to continue editing that exam instead
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 ml-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D4AF37]" />Exam Date</Label>
              <Input type="date" value={examDate} onChange={(e) => onExamDateChange(e.target.value)} className={`h-12 rounded-xl bg-white text-gray-900 focus:border-[#D4AF37] focus:ring-[#D4AF37] ${examTitleWarning ? 'border-red-300' : 'border-gray-300'}`} />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label className="text-gray-700 ml-1">Description (Optional)</Label>
              <Input placeholder="Brief description of the exam" value={examDesc} onChange={(e) => onExamDescChange(e.target.value)} className="h-12 rounded-xl border-gray-300 bg-white text-gray-900 focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-400" />
            </div>
          </div>
          <div className="border-t border-gray-200 my-6" />
        </>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingExistingMark ? 'Edit Marks' : continuingExamId ? 'Add More Student Marks' : 'Add Student Marks'}
        </h3>
        <MarksInputRow
          indexNumber={indexNumber}
          studentName={studentName}
          marks={marks}
          isBlocked={isBlocked}
          isCheckingIndex={isCheckingIndex}
          indexWarning={editingExistingMark ? '' : indexWarning}
          isEditing={!!(editingEntryId || editingExistingMark)}
          onIndexChange={onIndexChange}
          onStudentNameChange={onStudentNameChange}
          onMarksChange={onMarksChange}
          onAddOrUpdate={onAddOrUpdate}
          onClear={onClearEntry}
        />
      </div>

      {!editingExistingMark && (
        <EntriesTable
          entries={entries}
          editingEntryId={editingEntryId}
          title={continuingExamId ? 'New Marks to Add' : 'Student Marks'}
          onDoubleClick={onEntryDoubleClick}
          onRemove={onRemoveEntry}
        />
      )}

      {entries.length > 0 && !editingExistingMark && (
        <div className="flex justify-end gap-3">
          <Button onClick={onClearAll} variant="outline" className="h-12 px-6 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50">Clear All</Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || (!continuingExamId && !!examTitleWarning)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : continuingExamId ? `Add ${entries.length} Mark${entries.length > 1 ? 's' : ''} to "${continuingExamTitle}"` : `Submit Exam (${entries.length} ${entries.length === 1 ? 'Student' : 'Students'})`}
          </Button>
        </div>
      )}

      {entries.length === 0 && !editingExistingMark && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{continuingExamId ? `Ready to add marks to "${continuingExamTitle}"` : 'No marks added yet'}</p>
          <p className="text-gray-400 text-sm mt-1">Add student marks using the form above</p>
        </div>
      )}
    </div>
  );
}