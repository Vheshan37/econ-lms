'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ClassTypeName } from '@prisma/client';

export async function getClassTypes(yearId: string) {
    try {
        const classTypes = await prisma.classType.findMany({
            where: { yearId },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { resources: true }
                }
            }
        });
        return { success: true, data: classTypes };
    } catch (error) {
        console.error('Failed to fetch class types:', error);
        return { success: false, error: 'Failed to fetch class types' };
    }
}

export async function createClassType(yearId: string, name: ClassTypeName) {
    try {
        // Check if this class type already exists for this year
        const existing = await prisma.classType.findFirst({
            where: { yearId, name }
        });

        if (existing) {
            return { success: false, error: 'This class type already exists for this year' };
        }

        const newClassType = await prisma.classType.create({
            data: {
                name,
                yearId,
                isActive: true,
            },
        });

        revalidatePath(`/admin/classes/${yearId}`);
        return { success: true, data: newClassType };
    } catch (error) {
        console.error('Failed to create class type:', error);
        return { success: false, error: 'Failed to create class type' };
    }
}

export async function toggleClassTypeStatus(id: string, newStatus: boolean) {
    try {
        const classType = await prisma.classType.update({
            where: { id },
            data: { isActive: newStatus },
        });

        revalidatePath(`/admin/classes/${classType.yearId}`);
        return { success: true, data: classType };
    } catch (error) {
        console.error('Failed to toggle class type status:', error);
        return { success: false, error: 'Failed to toggle class type status' };
    }
}

export async function getClassTypeById(id: string) {
    try {
        const classType = await prisma.classType.findUnique({
            where: { id },
            include: {
                year: true,
                resources: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!classType) {
            return { success: false, error: 'Class type not found' };
        }

        return { success: true, data: classType };
    } catch (error) {
        console.error('Failed to fetch class type:', error);
        return { success: false, error: 'Failed to fetch class type' };
    }
}

// Ensure all 3 class types exist for a year
export async function ensureClassTypes(yearId: string) {
    try {
        const classTypeNames: ClassTypeName[] = ['THEORY', 'REVISION', 'PAPER_CLASS'];

        for (const name of classTypeNames) {
            const existing = await prisma.classType.findFirst({
                where: { yearId, name }
            });

            if (!existing) {
                await prisma.classType.create({
                    data: {
                        name,
                        yearId,
                        isActive: false, // Create as inactive by default
                    },
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to ensure class types:', error);
        return { success: false, error: 'Failed to ensure class types' };
    }
}
