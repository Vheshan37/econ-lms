"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  checkIndexNumber,
  checkIndexInExam,
  checkExamExists,
} from "@/lib/actions/exam-results";
import { ExamHeader } from "@/components/admin/exam-results/ExamHeader";
import { ExamForm } from "@/components/admin/exam-results/ExamForm";
import { ExistingExamsList } from "@/components/admin/exam-results/ExistingExamsList";

interface ExamEntry {
  id: string;
  indexNumber: string;
  studentName: string;
  marks: number;
}

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

export default function ExamResultsPage() {
  const [continuingExamId, setContinuingExamId] = useState<number | null>(null);
  const [continuingExamTitle, setContinuingExamTitle] = useState("");
  const [editingExistingMark, setEditingExistingMark] = useState<{
    examId: number;
    markId: number;
    indexNumber: string;
    currentMarks: number;
    studentName: string;
  } | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examDesc, setExamDesc] = useState("");
  const [studentName, setStudentName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [marks, setMarks] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState<ExamEntry[]>([]);
  const [indexWarning, setIndexWarning] = useState("");
  const [isCheckingIndex, setIsCheckingIndex] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [examTitleWarning, setExamTitleWarning] = useState("");
  const [isCheckingExam, setIsCheckingExam] = useState(false);
  const [duplicateExamId, setDuplicateExamId] = useState<number | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    message: "",
  });
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    examId: number | null;
    examTitle: string;
  }>({ isOpen: false, examId: null, examTitle: "" });
  const debounceTimerRef = useRef<NodeJS.Timeout>(null);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    const result = await getExams();
    if (result.success && result.data) {
      setExams(Array.isArray(result.data) ? result.data : []);
    } else {
      setExams([]);
      if (result.error) setErrorAlert({ isOpen: true, message: result.error });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const checkDuplicateExam = useCallback(
    async (title: string, date: string) => {
      if (!title.trim() || !date) {
        setExamTitleWarning("");
        setDuplicateExamId(null);
        return;
      }
      setIsCheckingExam(true);
      const result = await checkExamExists(title.trim(), date);
      if (result.success && result.exists && result.examData) {
        setExamTitleWarning(
          `An exam named "${title}" on ${new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} already exists! Please use the edit icon below to continue adding marks.`,
        );
        setDuplicateExamId(result.examData.id);
      } else {
        setExamTitleWarning("");
        setDuplicateExamId(null);
      }
      setIsCheckingExam(false);
    },
    [],
  );

  const checkDuplicateInEntries = useCallback(
    (index: string) =>
      entries.some(
        (entry) => entry.indexNumber === index && entry.id !== editingEntryId,
      ),
    [entries, editingEntryId],
  );

  const checkIndexInCurrentExam = useCallback(
    async (index: string) => {
      if (!index.trim()) {
        setIndexWarning("");
        setIsBlocked(false);
        return;
      }
      if (editingExistingMark && index === editingExistingMark.indexNumber) {
        setIndexWarning("");
        setIsBlocked(false);
        return;
      }
      if (checkDuplicateInEntries(index)) {
        setIndexWarning(
          `Student #${index} is already in the list. You cannot add the same student twice.`,
        );
        setIsBlocked(true);
        setIsCheckingIndex(false);
        return;
      }
      setIsCheckingIndex(true);
      if (continuingExamId) {
        const examResult = await checkIndexInExam(index, continuingExamId);
        if (examResult.success && examResult.hasMarks) {
          setIndexWarning(
            `Student #${index} already has ${examResult.existingMarks} marks in this exam.`,
          );
          setIsBlocked(true);
          setIsCheckingIndex(false);
          return;
        }
      }
      const result = await checkIndexNumber(index);
      if (result.success && result.exists) {
        setIndexWarning(
          `Student #${index} is already registered in the system and has marks in other exams.`,
        );
      } else {
        setIndexWarning("");
      }
      setIsBlocked(false);
      setIsCheckingIndex(false);
    },
    [checkDuplicateInEntries, continuingExamId, editingExistingMark],
  );

  const handleIndexChange = (value: string) => {
    setIndexNumber(value);
    setIndexWarning("");
    setIsBlocked(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(
      () => checkIndexInCurrentExam(value),
      500,
    );
  };

  const clearEntryForm = () => {
    setIndexNumber("");
    setStudentName("");
    setMarks("");
    setEditingEntryId(null);
    setIndexWarning("");
    setIsBlocked(false);
    setIsCheckingIndex(false);
    setEditingExistingMark(null);
  };

  const clearAll = () => {
    setExamTitle("");
    setExamDate("");
    setExamDesc("");
    setEntries([]);
    setContinuingExamId(null);
    setContinuingExamTitle("");
    setExamTitleWarning("");
    setDuplicateExamId(null);
    clearEntryForm();
  };

  const handleAddOrUpdateEntry = () => {
    if (!indexNumber.trim()) {
      setErrorAlert({ isOpen: true, message: "Please enter an index number." });
      return;
    }

    if (editingExistingMark) {
      const mark = Number(marks);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        setErrorAlert({
          isOpen: true,
          message: "Please enter a valid mark between 0 and 100.",
        });
        return;
      }
      setIsSubmitting(true);
      updateExam(editingExistingMark.examId, {
        results: [
          {
            indexNumber: indexNumber.trim(),
            studentName: studentName.trim(),
            marks: mark,
          },
        ],
      })
        .then((r) => {
          if (r.success) {
            setSuccessAlert({
              isOpen: true,
              message: `Mark for student #${indexNumber.trim()} updated to ${mark}!`,
            });
            clearAll();
            fetchExams();
          } else {
            setErrorAlert({
              isOpen: true,
              message: r.error || "Failed to update mark.",
            });
          }
        })
        .catch(() =>
          setErrorAlert({
            isOpen: true,
            message: "An unexpected error occurred.",
          }),
        )
        .finally(() => setIsSubmitting(false));
      return;
    }

    if (isBlocked) {
      setErrorAlert({
        isOpen: true,
        message: `Student #${indexNumber.trim()} already has marks in this exam.`,
      });
      return;
    }
    if (checkDuplicateInEntries(indexNumber.trim())) {
      setErrorAlert({
        isOpen: true,
        message: "This student is already in the list.",
      });
      return;
    }
    const mark = Number(marks);
    if (isNaN(mark) || mark < 0 || mark > 100) {
      setErrorAlert({
        isOpen: true,
        message: "Please enter a valid mark between 0 and 100.",
      });
      return;
    }

    if (editingEntryId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntryId
            ? {
                ...e,
                indexNumber: indexNumber.trim(),
                studentName: studentName.trim(),
                marks: mark,
              }
            : e,
        ),
      );
    } else {
      setEntries((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          indexNumber: indexNumber.trim(),
          studentName: studentName.trim(),
          marks: mark,
        },
      ]);
    }
    clearEntryForm();
  };

  const handleSubmitExam = async () => {
    if (!continuingExamId) {
      if (!examTitle.trim()) {
        setErrorAlert({ isOpen: true, message: "Please enter an exam title." });
        return;
      }
      if (!examDate) {
        setErrorAlert({ isOpen: true, message: "Please select an exam date." });
        return;
      }
      if (examTitleWarning) {
        setErrorAlert({ isOpen: true, message: "This exam already exists." });
        return;
      }
    }
    if (entries.length === 0) {
      setErrorAlert({
        isOpen: true,
        message: "Please add at least one student mark.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = continuingExamId
        ? await updateExam(continuingExamId, {
            results: entries.map((e) => ({
              indexNumber: e.indexNumber,
              studentName: e.studentName,
              marks: e.marks,
            })),
          })
        : await createExam({
            title: examTitle.trim(),
            examDate,
            description: examDesc.trim(),
            results: entries.map((e) => ({
              indexNumber: e.indexNumber,
              studentName: e.studentName,
              marks: e.marks,
            })),
          });

      if (result.success) {
        setSuccessAlert({
          isOpen: true,
          message: continuingExamId
            ? `Successfully added ${entries.length} mark(s)!`
            : `Exam "${examTitle.trim()}" created!`,
        });
        clearAll();
        fetchExams();
      } else {
        setErrorAlert({
          isOpen: true,
          message: result.error || "Failed to save.",
        });
      }
    } catch (error) {
      setErrorAlert({ isOpen: true, message: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAlert.examId) return;
    const result = await deleteExam(deleteAlert.examId);
    if (result.success) {
      setSuccessAlert({ isOpen: true, message: "Exam deleted!" });
      if (continuingExamId === deleteAlert.examId) clearAll();
      fetchExams();
    } else {
      setErrorAlert({
        isOpen: true,
        message: result.error || "Failed to delete.",
      });
    }
    setDeleteAlert({ isOpen: false, examId: null, examTitle: "" });
  };

  const handleContinueExam = (exam: Exam) => {
    setContinuingExamId(exam.id);
    setContinuingExamTitle(exam.title);
    setExamTitle("");
    setExamDate("");
    setExamDesc("");
    setEntries([]);
    setExamTitleWarning("");
    setDuplicateExamId(null);
    clearEntryForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToDuplicateExam = (examId: number) => {
    const exam = exams.find((e) => e.id === examId);
    if (exam) handleContinueExam(exam);
  };

  const handleEntryDoubleClick = (entry: ExamEntry) => {
    setEditingEntryId(entry.id);
    setIndexNumber(entry.indexNumber);
    setStudentName(entry.studentName || "");
    setMarks(entry.marks.toString());
    setIndexWarning("");
    setIsBlocked(false);
    setEditingExistingMark(null);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingEntryId === id) clearEntryForm();
  };

  const handleDoubleClickMark = (exam: Exam, mark: ExamMark) => {
    setEditingExistingMark({
      examId: exam.id,
      markId: mark.id,
      indexNumber: mark.index.index_no,
      currentMarks: parseFloat(mark.marks),
      studentName: mark.index.student_name || "",
    });
    setIndexNumber(mark.index.index_no);
    setStudentName(mark.index.student_name || "");
    setMarks(mark.marks);
    setIndexWarning("");
    setIsBlocked(false);
    setEditingEntryId(null);
    setEntries([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const headerSubtitle = continuingExamId
    ? `Adding marks to: "${continuingExamTitle}"`
    : editingExistingMark
      ? `Editing mark for student #${editingExistingMark.indexNumber}`
      : "Create exams and manage student marks";

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <ExamHeader
        title="Exam Results Management"
        subtitle={headerSubtitle}
        examCount={exams.length}
      />

      <ExamForm
        continuingExamId={continuingExamId}
        continuingExamTitle={continuingExamTitle}
        editingExistingMark={editingExistingMark}
        examTitle={examTitle}
        examDate={examDate}
        examDesc={examDesc}
        examTitleWarning={examTitleWarning}
        isCheckingExam={isCheckingExam}
        duplicateExamId={duplicateExamId}
        indexNumber={indexNumber}
        studentName={studentName}
        marks={marks}
        editingEntryId={editingEntryId}
        entries={entries}
        isBlocked={isBlocked}
        isCheckingIndex={isCheckingIndex}
        indexWarning={indexWarning}
        isSubmitting={isSubmitting}
        onExamTitleChange={(v) => {
          setExamTitle(v);
          if (examDate) {
            if (debounceTimerRef.current)
              clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(
              () => checkDuplicateExam(v, examDate),
              500,
            );
          }
        }}
        onExamDateChange={(v) => {
          setExamDate(v);
          if (examTitle.trim()) {
            if (debounceTimerRef.current)
              clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(
              () => checkDuplicateExam(examTitle, v),
              500,
            );
          }
        }}
        onExamDescChange={setExamDesc}
        onIndexChange={handleIndexChange}
        onStudentNameChange={setStudentName}
        onMarksChange={setMarks}
        onAddOrUpdate={handleAddOrUpdateEntry}
        onClearEntry={clearEntryForm}
        onClearAll={clearAll}
        onSubmit={handleSubmitExam}
        onContinueExam={() => {}}
        onGoToDuplicateExam={handleGoToDuplicateExam}
        onEntryDoubleClick={handleEntryDoubleClick}
        onRemoveEntry={handleRemoveEntry}
      />

      <ExistingExamsList
        exams={exams}
        continuingExamId={continuingExamId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onContinueExam={handleContinueExam}
        onDeleteExam={(id, title) =>
          setDeleteAlert({ isOpen: true, examId: id, examTitle: title })
        }
        onDoubleClickMark={handleDoubleClickMark}
      />

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
      <AlertDialog
        isOpen={deleteAlert.isOpen}
        onClose={() =>
          setDeleteAlert({ isOpen: false, examId: null, examTitle: "" })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Exam"
        description={`Are you sure you want to delete "${deleteAlert.examTitle}"?`}
        type="error"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
