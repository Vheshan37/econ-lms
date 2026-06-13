"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOLSubjects() {
  try {
    const subjects = await prisma.oLSubject.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { resources: true },
        },
      },
    });
    return { success: true, data: subjects };
  } catch (error) {
    console.error("Failed to fetch O/L subjects:", error);
    return { success: false, error: "Failed to fetch O/L subjects" };
  }
}

export async function createOLSubject(name: string) {
  try {
    const subject = await prisma.oLSubject.create({
      data: { name },
    });
    revalidatePath("/admin/ol-resources");
    return { success: true, data: subject };
  } catch (error) {
    console.error("Failed to create O/L subject:", error);
    return { success: false, error: "Failed to create O/L subject" };
  }
}

export async function deleteOLSubject(id: string) {
  try {
    await prisma.oLSubject.delete({
      where: { id },
    });
    revalidatePath("/admin/ol-resources");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete O/L subject:", error);
    return { success: false, error: "Failed to delete O/L subject" };
  }
}
