"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ExamResultInput {
  id?: string;
  indexNumber: string;
  studentName?: string;
  marks: number;
}

interface ExamInput {
  title: string;
  examDate: string;
  description: string;
  results: ExamResultInput[];
}

export type { Exam, ExamMark } from "@/types/exam";

export async function checkIndexNumber(indexNumber: string) {
  try {
    const existingIndex = await prisma.index.findFirst({
      where: { index_no: indexNumber },
    });

    return {
      success: true,
      exists: existingIndex ? true : false,
      indexData: existingIndex || null,
    };
  } catch (error) {
    console.error("Error checking index:", error);
    return {
      success: false,
      exists: false,
      error: "Failed to check index number",
    };
  }
}

export async function checkIndexInExam(indexNumber: string, examId: number) {
  try {
    const existingIndex = await prisma.index.findFirst({
      where: { index_no: indexNumber },
    });

    if (!existingIndex) {
      return {
        success: true,
        exists: false,
        hasMarks: false,
      };
    }

    const existingMark = await prisma.marks.findFirst({
      where: {
        index_id: existingIndex.id,
        exam_id: examId,
      },
    });

    return {
      success: true,
      exists: true,
      hasMarks: existingMark ? true : false,
      existingMarks: existingMark?.marks || null,
    };
  } catch (error) {
    console.error("Error checking index in exam:", error);
    return {
      success: false,
      exists: false,
      hasMarks: false,
      error: "Failed to check index in exam",
    };
  }
}

export async function checkExamExists(title: string, examDate: string) {
  try {
    const existingExam = await prisma.exam.findFirst({
      where: {
        title: title,
        exam_date: new Date(examDate),
      },
      include: {
        marks: {
          include: {
            index: true,
          },
        },
      },
    });

    return {
      success: true,
      exists: existingExam ? true : false,
      examData: existingExam || null,
    };
  } catch (error) {
    console.error("Error checking exam:", error);
    return {
      success: false,
      exists: false,
      error: "Failed to check exam",
    };
  }
}

export async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        marks: {
          include: {
            index: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        exam_date: "desc",
      },
    });

    return {
      success: true,
      data: exams || [],
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return {
      success: false,
      error: "Failed to fetch exams",
      data: [],
    };
  }
}

export async function createExam(data: ExamInput) {
  try {
    const newExam = await prisma.$transaction(async (tx) => {
      const exam = await tx.exam.create({
        data: {
          title: data.title,
          exam_date: new Date(data.examDate),
          desc: data.description || "",
        },
      });

      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          let indexRecord = await tx.index.findFirst({
            where: { index_no: result.indexNumber },
          });

          if (!indexRecord) {
            indexRecord = await tx.index.create({
              data: {
                index_no: result.indexNumber,
                student_name: result.studentName || "",
              },
            });
          } else if (
            result.studentName &&
            result.studentName !== indexRecord.student_name
          ) {
            indexRecord = await tx.index.update({
              where: { id: indexRecord.id },
              data: { student_name: result.studentName },
            });
          }

          await tx.marks.create({
            data: {
              index_id: indexRecord.id,
              exam_id: exam.id,
              marks: result.marks.toString(),
            },
          });
        }
      }

      const examWithMarks = await tx.exam.findUnique({
        where: { id: exam.id },
        include: {
          marks: {
            include: {
              index: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return examWithMarks;
    });

    revalidatePath("/admin/exam-results");
    return { success: true, data: newExam };
  } catch (error) {
    console.error("Error creating exam:", error);
    return {
      success: false,
      error: "Failed to create exam results",
    };
  }
}

export async function updateExam(
  examId: number,
  data: { results: ExamResultInput[] },
) {
  try {
    const updatedExam = await prisma.$transaction(async (tx) => {
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          let indexRecord = await tx.index.findFirst({
            where: { index_no: result.indexNumber },
          });

          if (!indexRecord) {
            indexRecord = await tx.index.create({
              data: {
                index_no: result.indexNumber,
                student_name: result.studentName || "",
              },
            });
          } else if (
            result.studentName &&
            result.studentName !== indexRecord.student_name
          ) {
            indexRecord = await tx.index.update({
              where: { id: indexRecord.id },
              data: { student_name: result.studentName },
            });
          }

          const existingMark = await tx.marks.findFirst({
            where: {
              index_id: indexRecord.id,
              exam_id: examId,
            },
          });

          if (existingMark) {
            await tx.marks.update({
              where: { id: existingMark.id },
              data: { marks: result.marks.toString() },
            });
          } else {
            await tx.marks.create({
              data: {
                index_id: indexRecord.id,
                exam_id: examId,
                marks: result.marks.toString(),
              },
            });
          }
        }
      }

      const examWithMarks = await tx.exam.findUnique({
        where: { id: examId },
        include: {
          marks: {
            include: {
              index: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return examWithMarks;
    });

    revalidatePath("/admin/exam-results");
    return { success: true, data: updatedExam };
  } catch (error) {
    console.error("Error updating exam:", error);
    return {
      success: false,
      error: "Failed to update exam",
    };
  }
}

export async function lookupStudentResults(indexNumber: string) {
  try {
    const indexRecord = await prisma.index.findFirst({
      where: { index_no: indexNumber.trim() },
    });

    if (!indexRecord) {
      return {
        success: false,
        error:
          "No results found for this index number. Please check and try again.",
      };
    }

    const marks = await prisma.marks.findMany({
      where: {
        index_id: indexRecord.id,
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            exam_date: true,
            desc: true,
          },
        },
        index: {
          select: {
            id: true,
            index_no: true,
            student_name: true,
          },
        },
      },
      orderBy: {
        exam: {
          exam_date: "desc",
        },
      },
    });

    if (marks.length === 0) {
      return {
        success: false,
        error: "No exam results have been released yet for this index number.",
      };
    }

    const serializedMarks = JSON.parse(JSON.stringify(marks));

    return {
      success: true,
      data: {
        indexNumber: indexRecord.index_no,
        studentName: indexRecord.student_name,
        marks: serializedMarks,
      },
    };
  } catch (error) {
    console.error("Error looking up student results:", error);
    return {
      success: false,
      error: "An error occurred while fetching results. Please try again.",
    };
  }
}

export async function deleteExam(examId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.marks.deleteMany({
        where: { exam_id: examId },
      });

      await tx.exam.delete({
        where: { id: examId },
      });
    });

    revalidatePath("/admin/exam-results");
    return { success: true, message: "Exam deleted successfully" };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return {
      success: false,
      error: "Failed to delete exam",
    };
  }
}
