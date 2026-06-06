'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function toUTCDate(localDateTime: string): Date | null {
    if (!localDateTime) return null;
    return new Date(localDateTime);
}

export async function getOnlineClasses(page = 1, limit = 10) {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        
        const [classes, total] = await Promise.all([
            prisma.onlineClasses.findMany({
                where: {
                    OR: [
                        { youtubeTime: { gte: startOfToday } },
                        { zoomTime: { gte: startOfToday } },
                    ],
                },
                orderBy: [
                    { youtubeTime: { sort: 'asc', nulls: 'last' } },
                    { zoomTime: { sort: 'asc', nulls: 'last' } },
                ],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.onlineClasses.count({
                where: {
                    OR: [
                        { youtubeTime: { gte: startOfToday } },
                        { zoomTime: { gte: startOfToday } },
                    ],
                },
            }),
        ]);

        const serialized = JSON.parse(JSON.stringify(classes));

        return {
            success: true,
            data: serialized.map((cls: Record<string, unknown>) => ({
                ...cls,
                classTypes: Array.isArray(cls.classTypes) ? cls.classTypes : [],
            })),
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch online classes' };
    }
}

export async function createOnlineClass(data: {
    youtubeLink?: string;
    youtubeTime?: string;
    zoomLink?: string;
    zoomTime?: string;
    zoomId?: string;
    zoomPasscode?: string;
    classTypeIds: string[];
}) {
    try {
        await prisma.onlineClasses.create({
            data: {
                youtubeLink: data.youtubeLink || null,
                youtubeTime: toUTCDate(data.youtubeTime || ''),
                zoomLink: data.zoomLink || null,
                zoomTime: toUTCDate(data.zoomTime || ''),
                zoomId: data.zoomId || null,
                zoomPasscode: data.zoomPasscode || null,
                classTypes: data.classTypeIds,
            },
        });

        revalidatePath('/admin/online-class');
        return { success: true, message: 'Online class created successfully' };
    } catch (error) {
        return { success: false, error: 'Failed to create online class' };
    }
}

export async function updateOnlineClass(
    id: number,
    data: {
        youtubeLink?: string;
        youtubeTime?: string;
        zoomLink?: string;
        zoomTime?: string;
        zoomId?: string;
        zoomPasscode?: string;
        classTypeIds: string[];
    }
) {
    try {
        await prisma.onlineClasses.update({
            where: { id },
            data: {
                youtubeLink: data.youtubeLink || null,
                youtubeTime: toUTCDate(data.youtubeTime || ''),
                zoomLink: data.zoomLink || null,
                zoomTime: toUTCDate(data.zoomTime || ''),
                zoomId: data.zoomId || null,
                zoomPasscode: data.zoomPasscode || null,
                classTypes: data.classTypeIds,
            },
        });

        revalidatePath('/admin/online-class');
        return { success: true, message: 'Online class updated successfully' };
    } catch (error) {
        return { success: false, error: 'Failed to update online class' };
    }
}

export async function deleteOnlineClass(id: number) {
    try {
        await prisma.onlineClasses.delete({ where: { id } });

        revalidatePath('/admin/online-class');
        return { success: true, message: 'Online class deleted successfully' };
    } catch (error) {
        return { success: false, error: 'Failed to delete online class' };
    }
}


export async function getStudentUpcomingClasses(studentId: string) {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        
        // Get student's assigned class types
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                classAssignments: {
                    include: {
                        classType: {
                            include: {
                                year: true
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return { success: false, error: 'Student not found', data: [] };
        }

        const studentClassTypeIds = new Set(student.classAssignments.map(a => a.classTypeId));
        
        // Fetch all classes from today onwards
        const allClasses = await prisma.onlineClasses.findMany({
            where: {
                OR: [
                    { youtubeTime: { gte: startOfToday } },
                    { zoomTime: { gte: startOfToday } },
                ],
            },
        });

        // Filter classes that match student's class types
        const relevantClasses = allClasses.filter((cls) => {
            const classTypes = cls.classTypes as string[];
            if (!Array.isArray(classTypes) || classTypes.length === 0) return false;
            return classTypes.some((ctId) => studentClassTypeIds.has(ctId));
        });

        // Enrich classes with class type details
        const enrichedClasses = await Promise.all(
            relevantClasses.map(async (cls) => {
                const classTypesList = await prisma.classType.findMany({
                    where: {
                        id: { in: cls.classTypes as string[] }
                    },
                    include: {
                        year: true
                    }
                });

                return {
                    ...cls,
                    classTypesDetails: classTypesList,
                    youtubeTime: cls.youtubeTime ? new Date(cls.youtubeTime) : null,
                    zoomTime: cls.zoomTime ? new Date(cls.zoomTime) : null,
                };
            })
        );

        const serialized = JSON.parse(JSON.stringify(enrichedClasses));

        return {
            success: true,
            data: serialized,
            total: serialized.length,
        };
    } catch (error) {
        console.error('Error fetching student upcoming classes:', error);
        return { success: false, error: 'Failed to fetch online classes', data: [] };
    }
}