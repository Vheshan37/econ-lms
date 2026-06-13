"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      studentCount,
      resourceCount,
      yearCount,
      instituteCount,
      hallOfFameCount,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.resource.count(),
      prisma.academicYear.count({ where: { isActive: true } }),
      prisma.institute.count(),
      prisma.hallOfFame.count(),
    ]);

    return {
      success: true,
      data: {
        studentCount,
        resourceCount,
        yearCount,
        instituteCount,
        hallOfFameCount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}
