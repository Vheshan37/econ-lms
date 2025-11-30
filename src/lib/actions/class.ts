'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClasses() {
    try {
        const classes = await prisma.academicClass.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { success: true, data: classes };
    } catch (error) {
        console.error('Failed to fetch classes:', error);
        return { success: false, error: 'Failed to fetch classes' };
    }
}

export async function createClass(data: { year: string; badge: string; description?: string }) {
    try {
        const count = await prisma.academicClass.count();

        if (count >= 3) {
            return { success: false, error: 'Maximum limit of 3 classes reached. Please delete a class before creating a new one.' };
        }

        const newClass = await prisma.academicClass.create({
            data: {
                year: data.year,
                badge: data.badge,
                description: data.description,
            },
        });

        revalidatePath('/admin/classes');
        return { success: true, data: newClass };
    } catch (error) {
        console.error('Failed to create class:', error);
        return { success: false, error: 'Failed to create class' };
    }
}

export async function deleteClass(id: string) {
    try {
        await prisma.academicClass.delete({
            where: { id },
        });

        revalidatePath('/admin/classes');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete class:', error);
        return { success: false, error: 'Failed to delete class' };
    }
}
