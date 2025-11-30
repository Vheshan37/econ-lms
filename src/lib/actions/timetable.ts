'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Institute Actions
export async function getInstitutes() {
    try {
        const institutes = await (prisma as any).institute.findMany({
            include: {
                timetables: {
                    orderBy: [
                        { day: 'asc' },
                        { startTime: 'asc' }
                    ]
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return { success: true, data: institutes };
    } catch (error) {
        console.error('Failed to fetch institutes:', error);
        return { success: false, error: 'Failed to fetch institutes' };
    }
}

export async function createInstitute(data: {
    name: string;
    location: string;
}) {
    try {
        const institute = await (prisma as any).institute.create({
            data: {
                name: data.name,
                location: data.location,
            },
        });

        revalidatePath('/admin/timetable');
        return { success: true, data: institute };
    } catch (error) {
        console.error('Failed to create institute:', error);
        return { success: false, error: 'Failed to create institute' };
    }
}

export async function updateInstitute(id: string, data: {
    name?: string;
    location?: string;
}) {
    try {
        const institute = await (prisma as any).institute.update({
            where: { id },
            data,
        });

        revalidatePath('/admin/timetable');
        return { success: true, data: institute };
    } catch (error) {
        console.error('Failed to update institute:', error);
        return { success: false, error: 'Failed to update institute' };
    }
}

export async function deleteInstitute(id: string) {
    try {
        await (prisma as any).institute.delete({
            where: { id },
        });

        revalidatePath('/admin/timetable');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete institute:', error);
        return { success: false, error: 'Failed to delete institute' };
    }
}

// Timetable Actions
export async function createTimetable(data: {
    instituteId: string;
    day: string;
    startTime: string;
    endTime: string;
    academicYear: string;
}) {
    try {
        const timetable = await (prisma as any).timetable.create({
            data: {
                instituteId: data.instituteId,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                academicYear: data.academicYear,
            },
        });

        revalidatePath('/admin/timetable');
        return { success: true, data: timetable };
    } catch (error) {
        console.error('Failed to create timetable:', error);
        return { success: false, error: 'Failed to create timetable' };
    }
}

export async function updateTimetable(id: string, data: {
    day?: string;
    startTime?: string;
    endTime?: string;
    academicYear?: string;
}) {
    try {
        const timetable = await (prisma as any).timetable.update({
            where: { id },
            data,
        });

        revalidatePath('/admin/timetable');
        return { success: true, data: timetable };
    } catch (error) {
        console.error('Failed to update timetable:', error);
        return { success: false, error: 'Failed to update timetable' };
    }
}

export async function deleteTimetable(id: string) {
    try {
        await (prisma as any).timetable.delete({
            where: { id },
        });

        revalidatePath('/admin/timetable');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete timetable:', error);
        return { success: false, error: 'Failed to delete timetable' };
    }
}
