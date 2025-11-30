'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getYears() {
    try {
        const years = await prisma.academicYear.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: { classTypes: true }
                }
            }
        });
        return { success: true, data: years };
    } catch (error) {
        console.error('Failed to fetch years:', error);
        return { success: false, error: 'Failed to fetch years' };
    }
}

export async function createYear(data: { year: string; description?: string }) {
    try {
        const activeCount = await prisma.academicYear.count({
            where: { isActive: true }
        });

        if (activeCount >= 3) {
            return { success: false, error: 'Maximum of 3 active years allowed. Please disable a year before creating a new one.' };
        }

        const newYear = await prisma.academicYear.create({
            data: {
                year: data.year,
                description: data.description,
                isActive: true,
            },
        });

        revalidatePath('/admin/classes');
        return { success: true, data: newYear };
    } catch (error) {
        console.error('Failed to create year:', error);
        return { success: false, error: 'Failed to create year' };
    }
}

export async function updateYear(id: string, data: { year: string; description?: string }) {
    try {
        const updatedYear = await prisma.academicYear.update({
            where: { id },
            data: {
                year: data.year,
                description: data.description,
            },
        });

        revalidatePath('/admin/classes');
        return { success: true, data: updatedYear };
    } catch (error) {
        console.error('Failed to update year:', error);
        return { success: false, error: 'Failed to update year' };
    }
}

export async function toggleYearStatus(id: string, newStatus: boolean) {
    try {
        if (newStatus) {
            const activeCount = await prisma.academicYear.count({
                where: { isActive: true }
            });

            if (activeCount >= 3) {
                return { success: false, error: 'Maximum of 3 active years allowed. Please disable another year first.' };
            }
        }

        const updatedYear = await prisma.academicYear.update({
            where: { id },
            data: { isActive: newStatus },
        });

        revalidatePath('/admin/classes');
        return { success: true, data: updatedYear };
    } catch (error) {
        console.error('Failed to toggle year status:', error);
        return { success: false, error: 'Failed to toggle year status' };
    }
}

export async function getYearById(id: string) {
    try {
        const year = await prisma.academicYear.findUnique({
            where: { id },
            include: {
                classTypes: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        _count: {
                            select: { resources: true }
                        }
                    }
                }
            }
        });

        if (!year) {
            return { success: false, error: 'Year not found' };
        }

        return { success: true, data: year };
    } catch (error) {
        console.error('Failed to fetch year:', error);
        return { success: false, error: 'Failed to fetch year' };
    }
}
