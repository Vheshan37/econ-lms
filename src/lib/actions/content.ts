"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Landing Page Content ---

export async function getLandingPageContent(section?: string) {
  try {
    if (section) {
      const content = await prisma.landingPageContent.findUnique({
        where: { section },
      });
      return { success: true, data: content?.content };
    } else {
      const allContent = await prisma.landingPageContent.findMany();
      const result: any = {};
      allContent.forEach((item) => {
        result[item.section] = item.content;
      });
      return { success: true, data: result };
    }
  } catch (error) {
    console.error(`Error fetching content:`, error);
    return { success: false, error: "Failed to fetch content" };
  }
}

export async function updateLandingPageContent(section: string, content: any) {
  try {
    await prisma.landingPageContent.upsert({
      where: { section },
      update: { content },
      create: { section, content },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${section} content:`, error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function updateAllLandingPageContent(data: {
  [key: string]: any;
}) {
  try {
    const promises = Object.keys(data).map((section) =>
      prisma.landingPageContent.upsert({
        where: { section },
        update: { content: data[section] },
        create: { section, content: data[section] },
      }),
    );
    await Promise.all(promises);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating all content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

// --- Testimonials ---

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: "Failed to fetch testimonials" };
  }
}

export async function createTestimonial(data: {
  name: string;
  role: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  institute?: string;
}) {
  try {
    await prisma.testimonial.create({
      data: {
        ...data,
        rating: data.rating || 5,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Failed to create testimonial" };
  }
}

export async function updateTestimonial(
  id: string,
  data: {
    name?: string;
    role?: string;
    content?: string;
    imageUrl?: string;
    rating?: number;
    institute?: string;
    isActive?: boolean;
  },
) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}

// --- Modern Features ---

export async function getModernFeatures() {
  try {
    const features = await prisma.modernFeature.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: features };
  } catch (error) {
    console.error("Error fetching modern features:", error);
    return { success: false, error: "Failed to fetch features" };
  }
}

export async function createModernFeature(data: {
  title: string;
  description: string;
  icon: string;
  color?: string;
  order?: number;
}) {
  try {
    await prisma.modernFeature.create({
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating modern feature:", error);
    return { success: false, error: "Failed to create feature" };
  }
}

export async function updateModernFeature(
  id: string,
  data: {
    title?: string;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
    isActive?: boolean;
  },
) {
  try {
    await prisma.modernFeature.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating modern feature:", error);
    return { success: false, error: "Failed to update feature" };
  }
}

export async function deleteModernFeature(id: string) {
  try {
    await prisma.modernFeature.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting modern feature:", error);
    return { success: false, error: "Failed to delete feature" };
  }
}

// --- Courses ---

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: courses };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function createCourse(data: {
  year: string;
  title: string;
  status: string;
  description: string;
  schedule: string;
  color: string;
  order?: number;
}) {
  try {
    await prisma.course.create({
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(
  id: string,
  data: {
    year?: string;
    title?: string;
    status?: string;
    description?: string;
    schedule?: string;
    color?: string;
    order?: number;
    isActive?: boolean;
  },
) {
  try {
    await prisma.course.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}

// --- Institutes & Timetables ---

export async function getInstitutes() {
  try {
    const institutes = await prisma.institute.findMany({
      include: { timetables: true },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: institutes };
  } catch (error) {
    console.error("Error fetching institutes:", error);
    return { success: false, error: "Failed to fetch institutes" };
  }
}

export async function createInstitute(data: {
  name: string;
  location: string;
}) {
  try {
    await prisma.institute.create({
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating institute:", error);
    return { success: false, error: "Failed to create institute" };
  }
}

export async function updateInstitute(
  id: string,
  data: { name?: string; location?: string },
) {
  try {
    await prisma.institute.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating institute:", error);
    return { success: false, error: "Failed to update institute" };
  }
}

export async function deleteInstitute(id: string) {
  try {
    await prisma.institute.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting institute:", error);
    return { success: false, error: "Failed to delete institute" };
  }
}

export async function createTimetable(data: {
  instituteId: string;
  day: string;
  startTime: string;
  endTime: string;
  academicYear: string;
}) {
  try {
    await prisma.timetable.create({
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating timetable:", error);
    return { success: false, error: "Failed to create timetable" };
  }
}

export async function deleteTimetable(id: string) {
  try {
    await prisma.timetable.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting timetable:", error);
    return { success: false, error: "Failed to delete timetable" };
  }
}

// --- Free Resources ---

export async function getFreeResources() {
  try {
    const resources = await prisma.freeResource.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: resources };
  } catch (error) {
    console.error("Error fetching free resources:", error);
    return { success: false, error: "Failed to fetch free resources" };
  }
}

export async function createFreeResource(data: {
  title: string;
  type: "VIDEO" | "PDF" | "PAST_PAPER" | "QUIZ";
  url: string;
  description?: string;
}) {
  try {
    await prisma.freeResource.create({
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating free resource:", error);
    return { success: false, error: "Failed to create free resource" };
  }
}

export async function updateFreeResource(
  id: string,
  data: {
    title?: string;
    type?: "VIDEO" | "PDF" | "PAST_PAPER" | "QUIZ";
    url?: string;
    description?: string;
  },
) {
  try {
    await prisma.freeResource.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating free resource:", error);
    return { success: false, error: "Failed to update free resource" };
  }
}

export async function deleteFreeResource(id: string) {
  try {
    await prisma.freeResource.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting free resource:", error);
    return { success: false, error: "Failed to delete free resource" };
  }
}
