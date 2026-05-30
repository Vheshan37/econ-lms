"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get all academic years assigned to a student
 */
export async function getStudentYears(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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

    // Extract unique years from class assignments
    const yearsMap = new Map();
    student.classAssignments.forEach((assignment) => {
      const year = assignment.classType.year;
      if (!yearsMap.has(year.id)) {
        yearsMap.set(year.id, year);
      }
    });

    const years = Array.from(yearsMap.values()).filter((year) => year.isActive);

    return { success: true, data: years };
  } catch (error) {
    return { success: false, error: "Failed to fetch academic years" };
  }
}

/**
 * Get all class types for a student in a specific year
 */
export async function getStudentClassTypes(studentId: string, yearId: string) {
  try {
    const classTypes = await prisma.classType.findMany({
      where: {
        yearId,
        isActive: true,
        studentAssignments: {
          some: {
            studentId,
          },
        },
      },
      include: {
        year: true,
        topics: {
          where: { isActive: true },
        },
        _count: {
          select: {
            topics: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: classTypes };
  } catch (error) {
    return { success: false, error: "Failed to fetch class types" };
  }
}

/**
 * Get all topics for a specific class type (student view - active only)
 */
export async function getStudentTopics(classTypeId: string) {
  try {
    const topics = await prisma.topic.findMany({
      where: {
        classTypeId,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            resources: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return { success: true, data: topics };
  } catch (error) {
    return { success: false, error: "Failed to fetch topics" };
  }
}

/**
 * Get all resources for a specific topic
 */
export async function getTopicResources(topicId: string) {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        topicId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: resources };
  } catch (error) {
    return { success: false, error: "Failed to fetch resources" };
  }
}

/**
 * Get student profile information
 */
export async function getStudentProfile(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
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
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function getStudentDashboardStats(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                year: true,
                topics: {
                  where: { isActive: true },
                  include: {
                    resources: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // Calculate statistics
    const uniqueYears = new Set();
    let totalTopics = 0;
    let totalResources = 0;
    let videoCount = 0;
    let pdfCount = 0;
    let quizCount = 0;
    let pastPaperCount = 0;

    student.classAssignments.forEach((assignment) => {
      uniqueYears.add(assignment.classType.year.id);
      totalTopics += assignment.classType.topics.length;

      assignment.classType.topics.forEach((topic) => {
        totalResources += topic.resources.length;
        topic.resources.forEach((resource) => {
          switch (resource.type) {
            case "VIDEO":
              videoCount++;
              break;
            case "PDF":
              pdfCount++;
              break;
            case "QUIZ":
              quizCount++;
              break;
            case "PAST_PAPER":
              pastPaperCount++;
              break;
          }
        });
      });
    });

    const stats = {
      assignedYears: uniqueYears.size,
      assignedClasses: student.classAssignments.length,
      totalTopics,
      totalResources,
      resourcesByType: {
        videos: videoCount,
        pdfs: pdfCount,
        quizzes: quizCount,
        pastPapers: pastPaperCount,
      },
    };

    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}

export async function getTopicResourcesWithPaymentStatus(
  topicId: string,
  studentId: string,
  year: number,
) {
  try {
    if (!studentId || studentId === "undefined") {
      return { success: false, error: "Invalid student ID", data: [] };
    }

    const resources = await prisma.resource.findMany({
      where: { topicId },
      orderBy: { createdAt: "desc" },
    });

    const payments = await prisma.studentPayments.findMany({
      where: {
        studentId,
        year, // Direct Int comparison
      },
    });

    const paidMonths = new Set(payments.map((p) => Number(p.month)));

    const resourcesWithStatus = resources.map((resource) => {
      const resourceMonth =
        resource.month !== null && resource.month !== undefined
          ? Number(resource.month)
          : null;

      if (resourceMonth === null) {
        return { ...resource, isPaid: true, isFree: true };
      }

      const isPaid = paidMonths.has(resourceMonth);

      return { ...resource, isPaid, isFree: false };
    });

    return { success: true, data: resourcesWithStatus };
  } catch (error) {
    return { success: false, error: "Failed to fetch resources", data: [] };
  }
}

export async function getAllStudentResources(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        classAssignments: {
          include: {
            classType: {
              include: {
                topics: {
                  where: { isActive: true },
                  include: {
                    resources: true,
                  },
                },
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

    // Fetch ALL student payments once
    const allPayments = await prisma.studentPayments.findMany({
      where: { studentId },
    });

    // Group payments by year for fast lookup
    const paymentsByYear = new Map<number, Set<number>>();
    for (const payment of allPayments) {
      const year = Number(payment.year);
      const month = Number(payment.month);
      if (!paymentsByYear.has(year)) {
        paymentsByYear.set(year, new Set());
      }
      paymentsByYear.get(year)!.add(month);
    }

    // Flatten all resources with payment status
    const resources: any[] = [];

    for (const assignment of student.classAssignments) {
      for (const topic of assignment.classType.topics) {
        for (const resource of topic.resources) {
          const resourceMonth =
            resource.month !== null && resource.month !== undefined
              ? Number(resource.month)
              : null;

          const resourceYear =
            resource.year !== null && resource.year !== undefined
              ? Number(resource.year)
              : null;

          let isPaid = false;
          let isFree = false;

          if (resourceMonth === null) {
            // No month assigned → Free resource
            isFree = true;
            isPaid = true;
          } else if (resourceYear !== null) {
            // Both year and month are set → check payment
            const yearPayments = paymentsByYear.get(resourceYear);
            if (yearPayments) {
              isPaid = yearPayments.has(resourceMonth);
            }
          }

          resources.push({
            id: resource.id,
            title: resource.title,
            type: resource.type,
            url: resource.url,
            description: resource.description,
            month: resourceMonth,
            year: resourceYear,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
            topicTitle: topic.title,
            classTypeName: assignment.classType.name,
            yearName: assignment.classType.year.year,
            yearId: assignment.classType.year.id,
            classTypeId: assignment.classType.id,
            topicId: topic.id,
            isPaid,
            isFree,
          });
        }
      }
    }

    return { success: true, data: resources };
  } catch (error) {
    console.error("Error fetching all student resources:", error);
    return { success: false, error: "Failed to fetch resources" };
  }
}
