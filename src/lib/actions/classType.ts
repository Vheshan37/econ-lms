'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClassTypes(yearId: string) {
    try {
        const classTypes = await prisma.classType.findMany({
            where: { yearId },
            orderBy: { createdAt: 'asc' }, // Order by creation time to keep defaults first usually
            include: {
                _count: {
                    // @ts-ignore
                    select: { topics: true }
                }
            }
        });
        return { success: true, data: classTypes };
    } catch (error) {
        console.error('Failed to fetch class types:', error);
        return { success: false, error: 'Failed to fetch class types' };
    }
}

export async function createClassType(yearId: string, name: string) {
    try {
        // Check if this class type already exists for this year (case insensitive)
        const existing = await prisma.classType.findFirst({
            where: {
                yearId,
                // @ts-ignore
                name: name
            }
        });

        if (existing) {
            return { success: false, error: 'This class type already exists for this year' };
        }

        const newClassType = await prisma.classType.create({
            data: {
                // @ts-ignore
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
                // @ts-ignore
                topics: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { resources: true }
                        }
                    }
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

// Default Theory Topics
const THEORY_TOPICS = [
    "Introduction to Economics",
    "Demand",
    "Supply",
    "Elasticity of Demand",
    "Elasticity of Supply",
    "Market and Market Equilibrium",
    "Government Intervention in the Market",
    "Theory of Production",
    "Theory of Costs",
    "Market Structures",
    "Perfect Competition",
    "Factor Markets",
    "Basic Macroeconomic Concepts",
    "Money",
    "Banking and Financial System",
    "Price Level and Inflation",
    "Public Finance",
    "Fiscal Policy",
    "International Trade",
    "Foreign Finance",
    "Economic Growth",
    "Economic Development",
    "Structure of the Sri Lankan Economy",
    "Economic Policies of Sri Lanka",
    "Contemporary Economic Issues in Sri Lanka"
];

// Ensure default class types exist for a year
export async function ensureClassTypes(yearId: string) {
    try {
        const defaultTypes = ['Theory', 'Revision', 'Paper Class'];

        for (const name of defaultTypes) {
            const existing = await prisma.classType.findFirst({
                // @ts-ignore
                where: { yearId, name }
            });

            if (!existing) {
                const newClassType = await prisma.classType.create({
                    data: {
                        // @ts-ignore
                        name,
                        yearId,
                        isActive: false, // Create as inactive by default
                    },
                });

                // If creating Theory class, populate default topics
                if (name === 'Theory') {
                    console.log('Populating default topics for Theory class...');
                    for (let i = 0; i < THEORY_TOPICS.length; i++) {
                        await prisma.topic.create({
                            data: {
                                title: THEORY_TOPICS[i],
                                classTypeId: newClassType.id,
                                order: i,
                                // @ts-ignore
                                isActive: true
                            }
                        });
                    }
                }
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to ensure class types:', error);
        return { success: false, error: 'Failed to ensure class types' };
    }
}

export async function deleteClassType(id: string) {
    try {
        const classType = await prisma.classType.delete({
            where: { id },
        });

        revalidatePath(`/admin/classes/${classType.yearId}`);
        return { success: true, data: classType };
    } catch (error) {
        console.error('Failed to delete class type:', error);
        return { success: false, error: 'Failed to delete class type' };
    }
}
