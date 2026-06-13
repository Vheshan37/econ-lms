"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHallOfFame() {
  try {
    const alumni = await (prisma as any).hallOfFame.findMany({
      orderBy: [{ academicYear: "desc" }, { islandRank: "asc" }],
    });

    return { success: true, data: alumni };
  } catch (error) {
    console.error("Failed to fetch hall of fame:", error);
    return { success: false, error: "Failed to fetch hall of fame" };
  }
}

export async function createAlumni(data: {
  name: string;
  district: string;
  academicYear: string;
  islandRank?: number;
  districtRank?: number;
  imageUrl?: string;
}) {
  try {
    const alumni = await (prisma as any).hallOfFame.create({
      data: {
        name: data.name,
        district: data.district,
        academicYear: data.academicYear,
        islandRank: data.islandRank || null,
        districtRank: data.districtRank || null,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidatePath("/admin/hall-of-fame");
    return { success: true, data: alumni };
  } catch (error) {
    console.error("Failed to create alumni:", error);
    return { success: false, error: "Failed to create alumni" };
  }
}

export async function updateAlumni(
  id: string,
  data: {
    name?: string;
    district?: string;
    academicYear?: string;
    islandRank?: number | null;
    districtRank?: number | null;
    imageUrl?: string | null;
  },
) {
  try {
    const alumni = await (prisma as any).hallOfFame.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/hall-of-fame");
    return { success: true, data: alumni };
  } catch (error) {
    console.error("Failed to update alumni:", error);
    return { success: false, error: "Failed to update alumni" };
  }
}

export async function deleteAlumni(id: string) {
  try {
    await (prisma as any).hallOfFame.delete({
      where: { id },
    });

    revalidatePath("/admin/hall-of-fame");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete alumni:", error);
    return { success: false, error: "Failed to delete alumni" };
  }
}
