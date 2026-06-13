"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudents(filters?: {
  search?: string;
  classTypeId?: string;
  yearId?: string;
  isActive?: boolean;
}) {
  try {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
        { school: { contains: filters.search } },
      ];
    }

    if (filters?.classTypeId) {
      where.classAssignments = {
        some: {
          classTypeId: filters.classTypeId,
        },
      };
    }

    const students = await (prisma as any).student.findMany({
      where,
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                year: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter by yearId if provided (done in JS since it's nested)
    let filteredStudents = students;
    if (filters?.yearId) {
      filteredStudents = students.filter((student: any) =>
        student.classAssignments.some(
          (assignment: any) => assignment.classType.yearId === filters.yearId,
        ),
      );
    }

    return { success: true, data: filteredStudents };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
}

export async function getStudentById(id: string) {
  try {
    const student = await (prisma as any).student.findUnique({
      where: { id },
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    return { success: true, data: student };
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return { success: false, error: "Failed to fetch student" };
  }
}

export async function createStudent(data: {
  name: string;
  school: string;
  dateOfBirth: string;
  email: string;
  classTypeIds: string[];
}) {
  try {
    // Check if email already exists
    const existing = await (prisma as any).student.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return { success: false, error: "Email already exists" };
    }

    // Create student with class assignments
    const student = await (prisma as any).student.create({
      data: {
        name: data.name,
        school: data.school,
        dateOfBirth: new Date(data.dateOfBirth),
        email: data.email,
        classAssignments: {
          create: data.classTypeIds.map((classTypeId) => ({
            classTypeId,
          })),
        },
      },
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    // Send invitation email
    const { sendInvitationEmail } = await import("@/lib/email");
    await sendInvitationEmail({
      to: student.email,
      userName: student.name,
      role: "student",
    });

    revalidatePath("/admin/students");
    return { success: true, data: student };
  } catch (error) {
    console.error("Failed to create student:", error);
    return { success: false, error: "Failed to create student" };
  }
}

export async function updateStudent(
  id: string,
  data: {
    name?: string;
    school?: string;
    dateOfBirth?: string;
    email?: string;
    isActive?: boolean;
  },
) {
  try {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.school) updateData.school = data.school;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.email) updateData.email = data.email;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const student = await (prisma as any).student.update({
      where: { id },
      data: updateData,
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/admin/students");
    return { success: true, data: student };
  } catch (error) {
    console.error("Failed to update student:", error);
    return { success: false, error: "Failed to update student" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await (prisma as any).student.delete({
      where: { id },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function assignClassTypes(
  studentId: string,
  classTypeIds: string[],
) {
  try {
    // Get existing assignments
    const existing = await (prisma as any).studentClassType.findMany({
      where: { studentId },
      select: { classTypeId: true },
    });

    const existingIds = existing.map((a: any) => a.classTypeId);

    // Find new assignments to create
    const toCreate = classTypeIds.filter((id) => !existingIds.includes(id));

    // Create new assignments
    if (toCreate.length > 0) {
      await (prisma as any).studentClassType.createMany({
        data: toCreate.map((classTypeId) => ({
          studentId,
          classTypeId,
        })),
      });
    }

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign class types:", error);
    return { success: false, error: "Failed to assign class types" };
  }
}

export async function removeClassType(studentId: string, classTypeId: string) {
  try {
    await (prisma as any).studentClassType.deleteMany({
      where: {
        studentId,
        classTypeId,
      },
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove class type:", error);
    return { success: false, error: "Failed to remove class type" };
  }
}
