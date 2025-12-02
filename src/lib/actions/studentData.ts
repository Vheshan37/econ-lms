'use server';

import { prisma } from '@/lib/prisma';

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
            return { success: false, error: 'Student not found' };
        }

        // Extract unique years from class assignments
        const yearsMap = new Map();
        student.classAssignments.forEach((assignment) => {
            const year = assignment.classType.year;
            if (!yearsMap.has(year.id)) {
                yearsMap.set(year.id, year);
            }
        });

        const years = Array.from(yearsMap.values()).filter(year => year.isActive);

        return { success: true, data: years };
    } catch (error) {
        console.error('Error fetching student years:', error);
        return { success: false, error: 'Failed to fetch academic years' };
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
                createdAt: 'asc',
            },
        });

        return { success: true, data: classTypes };
    } catch (error) {
        console.error('Error fetching student class types:', error);
        return { success: false, error: 'Failed to fetch class types' };
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
                order: 'asc',
            },
        });

        return { success: true, data: topics };
    } catch (error) {
        console.error('Error fetching student topics:', error);
        return { success: false, error: 'Failed to fetch topics' };
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
                createdAt: 'desc',
            },
        });

        return { success: true, data: resources };
    } catch (error) {
        console.error('Error fetching topic resources:', error);
        return { success: false, error: 'Failed to fetch resources' };
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
            return { success: false, error: 'Student not found' };
        }

        return { success: true, data: student };
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return { success: false, error: 'Failed to fetch profile' };
    }
}

/**
 * Get all resources accessible to a student (across all assigned classes)
 */
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
            return { success: false, error: 'Student not found' };
        }

        // Flatten all resources from all topics
        const resources: any[] = [];
        student.classAssignments.forEach((assignment) => {
            assignment.classType.topics.forEach((topic) => {
                topic.resources.forEach((resource) => {
                    resources.push({
                        ...resource,
                        topicTitle: topic.title,
                        classTypeName: assignment.classType.name,
                        yearName: assignment.classType.year.year,
                        yearId: assignment.classType.year.id,
                        classTypeId: assignment.classType.id,
                        topicId: topic.id,
                    });
                });
            });
        });

        return { success: true, data: resources };
    } catch (error) {
        console.error('Error fetching all student resources:', error);
        return { success: false, error: 'Failed to fetch resources' };
    }
}

/**
 * Get dashboard statistics for a student
 */
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
            return { success: false, error: 'Student not found' };
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
                        case 'VIDEO':
                            videoCount++;
                            break;
                        case 'PDF':
                            pdfCount++;
                            break;
                        case 'QUIZ':
                            quizCount++;
                            break;
                        case 'PAST_PAPER':
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
        console.error('Error fetching student dashboard stats:', error);
        return { success: false, error: 'Failed to fetch dashboard statistics' };
    }
}
