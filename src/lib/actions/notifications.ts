"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type NotificationType = "payment" | "company" | "system" | "student";

export async function getNotifications(filter?: {
  type?: string;
  isRead?: boolean;
}) {
  try {
    const where: any = {};
    if (filter?.type) where.type = filter.type;
    if (filter?.isRead !== undefined) where.isRead = filter.isRead;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function getNotificationTypes() {
  try {
    const types = await prisma.notification.groupBy({
      by: ["type"],
      _count: true,
    });
    return { success: true, data: types.map((t) => t.type) };
  } catch (error) {
    console.error("Error fetching notification types:", error);
    return { success: false, error: "Failed to fetch types" };
  }
}

export async function getUnreadCount() {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false },
    });
    return { success: true, count };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}

export async function markAsRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAsUnread(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: false },
    });
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as unread:", error);
    return { success: false, error: "Failed to mark as unread" };
  }
}

export async function markAllAsRead() {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

export async function createNotification(data: {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  userId?: string;
  metadata?: any;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || "normal",
        userId: data.userId,
        metadata: data.metadata,
        isRead: false,
      },
    });
    revalidatePath("/admin/notifications");
    return { success: true, data: notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({
      where: { id },
    });
    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}
