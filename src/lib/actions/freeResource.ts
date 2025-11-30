'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ResourceType } from '@prisma/client';

export async function getFreeResources() {
    try {
        const resources = await (prisma as any).freeResource.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: resources };
    } catch (error) {
        console.error('Failed to fetch free resources:', error);
        return { success: false, error: 'Failed to fetch free resources' };
    }
}

export async function createFreeResource(data: {
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await (prisma as any).freeResource.create({
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
            },
        });

        revalidatePath('/admin/resources');
        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to create free resource:', error);
        return { success: false, error: 'Failed to create free resource' };
    }
}

export async function updateFreeResource(id: string, data: {
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await (prisma as any).freeResource.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
            },
        });

        revalidatePath('/admin/resources');
        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to update free resource:', error);
        return { success: false, error: 'Failed to update free resource' };
    }
}

export async function deleteFreeResource(id: string) {
    try {
        await (prisma as any).freeResource.delete({
            where: { id },
        });

        revalidatePath('/admin/resources');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete free resource:', error);
        return { success: false, error: 'Failed to delete free resource' };
    }
}
