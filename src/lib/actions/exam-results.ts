'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ExamResultInput {
  id?: string;
  indexNumber: string;
  marks: number;
}

interface ExamInput {
  title: string;
  examDate: string;
  description: string;
  results: ExamResultInput[];
}

// Check if index number exists in database
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
    console.error('Error checking index:', error);
    return {
      success: false,
      exists: false,
      error: 'Failed to check index number',
    };
  }
}

// Check if index number already has marks for a specific exam
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
    console.error('Error checking index in exam:', error);
    return {
      success: false,
      exists: false,
      hasMarks: false,
      error: 'Failed to check index in exam',
    };
  }
}

// Check if exam with same title and date already exists
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
    console.error('Error checking exam:', error);
    return {
      success: false,
      exists: false,
      error: 'Failed to check exam',
    };
  }
}

// Get all exams with their marks
export async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        marks: {
          include: {
            index: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        exam_date: 'desc',
      },
    });

    return { 
      success: true, 
      data: exams || [] 
    };
  } catch (error) {
    console.error('Error fetching exams:', error);
    return {
      success: false,
      error: 'Failed to fetch exams',
      data: [],
    };
  }
}

// Create new exam with marks
export async function createExam(data: ExamInput) {
  try {
    const newExam = await prisma.$transaction(async (tx) => {
      // Create the exam
      const exam = await tx.exam.create({
        data: {
          title: data.title,
          exam_date: new Date(data.examDate),
          desc: data.description || '',
        },
      });

      // Process each result
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          // Check if index exists, if not create it
          let indexRecord = await tx.index.findFirst({
            where: { index_no: result.indexNumber },
          });

          if (!indexRecord) {
            indexRecord = await tx.index.create({
              data: { index_no: result.indexNumber },
            });
          }

          // Create new mark for this exam
          await tx.marks.create({
            data: {
              index_id: indexRecord.id,
              exam_id: exam.id,
              marks: result.marks.toString(),
            },
          });
        }
      }

      // Return exam with marks
      const examWithMarks = await tx.exam.findUnique({
        where: { id: exam.id },
        include: {
          marks: {
            include: {
              index: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      return examWithMarks;
    });

    revalidatePath('/admin/exam-results');
    return { success: true, data: newExam };
  } catch (error) {
    console.error('Error creating exam:', error);
    return {
      success: false,
      error: 'Failed to create exam results',
    };
  }
}

// Update exam - add new marks to existing exam
export async function updateExam(examId: number, data: { results: ExamResultInput[] }) {
  try {
    const updatedExam = await prisma.$transaction(async (tx) => {
      // Only add new marks - never delete existing
      if (data.results && data.results.length > 0) {
        for (const result of data.results) {
          // Check if index exists, if not create it
          let indexRecord = await tx.index.findFirst({
            where: { index_no: result.indexNumber },
          });

          if (!indexRecord) {
            indexRecord = await tx.index.create({
              data: { index_no: result.indexNumber },
            });
          }

          // Check if marks already exist for this index in this exam
          const existingMark = await tx.marks.findFirst({
            where: {
              index_id: indexRecord.id,
              exam_id: examId,
            },
          });

          if (existingMark) {
            // Update existing mark
            await tx.marks.update({
              where: { id: existingMark.id },
              data: { marks: result.marks.toString() },
            });
          } else {
            // Create new mark
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
              createdAt: 'desc',
            },
          },
        },
      });

      return examWithMarks;
    });

    revalidatePath('/admin/exam-results');
    return { success: true, data: updatedExam };
  } catch (error) {
    console.error('Error updating exam:', error);
    return {
      success: false,
      error: 'Failed to update exam',
    };
  }
}

// Delete exam
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

    revalidatePath('/admin/exam-results');
    return { success: true, message: 'Exam deleted successfully' };
  } catch (error) {
    console.error('Error deleting exam:', error);
    return {
      success: false,
      error: 'Failed to delete exam',
    };
  }
}