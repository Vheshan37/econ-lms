"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTopics(classTypeId: string) {
  try {
    const topics = await (prisma as any).topic.findMany({
      where: { classTypeId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          // @ts-ignore
          select: { resources: true },
        },
      },
    });
    return { success: true, data: topics };
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return { success: false, error: "Failed to fetch topics" };
  }
}

export async function createTopic(data: {
  classTypeId: string;
  title: string;
  description?: string;
  isActive?: boolean;
}) {
  try {
    // Get highest order to append to end
    const lastTopic = await (prisma as any).topic.findFirst({
      where: { classTypeId: data.classTypeId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastTopic ? lastTopic.order + 1 : 0;

    const topic = await (prisma as any).topic.create({
      data: {
        title: data.title,
        description: data.description,
        classTypeId: data.classTypeId,
        order: newOrder,
        isActive: data.isActive ?? true,
      },
    });

    // Get yearId for revalidation path construction
    const classType = await prisma.classType.findUnique({
      where: { id: data.classTypeId },
      select: { yearId: true },
    });

    if (classType) {
      revalidatePath(`/admin/classes/${classType.yearId}/${data.classTypeId}`);
    }

    return { success: true, data: topic };
  } catch (error) {
    console.error("Failed to create topic:", error);
    return { success: false, error: "Failed to create topic" };
  }
}

export async function updateTopic(
  id: string,
  data: {
    title: string;
    description?: string;
    isActive?: boolean;
  },
) {
  try {
    const topic = await (prisma as any).topic.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        isActive: data.isActive,
      },
    });

    // Get hierarchy for revalidation
    const classType = await prisma.classType.findUnique({
      where: { id: topic.classTypeId },
      select: { yearId: true },
    });

    if (classType) {
      revalidatePath(`/admin/classes/${classType.yearId}/${topic.classTypeId}`);
    }

    return { success: true, data: topic };
  } catch (error) {
    console.error("Failed to update topic:", error);
    return { success: false, error: "Failed to update topic" };
  }
}

export async function deleteTopic(id: string) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id },
      select: { classTypeId: true },
    });

    if (!topic) {
      return { success: false, error: "Topic not found" };
    }

    await (prisma as any).topic.delete({
      where: { id },
    });

    const classType = await prisma.classType.findUnique({
      where: { id: topic.classTypeId },
      select: { yearId: true },
    });

    if (classType) {
      revalidatePath(`/admin/classes/${classType.yearId}/${topic.classTypeId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete topic:", error);
    return { success: false, error: "Failed to delete topic" };
  }
}

export async function getTopicById(id: string) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        // @ts-ignore
        classType: {
          include: {
            year: true,
          },
        },
        // @ts-ignore
        resources: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!topic) {
      return { success: false, error: "Topic not found" };
    }

    return { success: true, data: topic };
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    return { success: false, error: "Failed to fetch topic" };
  }
}
