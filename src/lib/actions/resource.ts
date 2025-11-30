'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ResourceType } from '@prisma/client';

export async function createResource(data: {
    classTypeId: string;
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await prisma.resource.create({
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
                classTypeId: data.classTypeId,
            },
        });

        // Get yearId for revalidation
        const classType = await prisma.classType.findUnique({
            where: { id: data.classTypeId },
            select: { yearId: true }
        });

        if (classType) {
            revalidatePath(`/admin/classes/${classType.yearId}/${data.classTypeId}`);
        }

        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to create resource:', error);
        return { success: false, error: 'Failed to create resource' };
    }
}

export async function getResourcesByClassType(classTypeId: string) {
    try {
        const resources = await prisma.resource.findMany({
            where: { classTypeId },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: resources };
    } catch (error) {
        console.error('Failed to fetch resources:', error);
        return { success: false, error: 'Failed to fetch resources' };
    }
}

export async function updateResource(id: string, data: {
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await prisma.resource.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
            },
        });

        // Get yearId for revalidation
        const classType = await prisma.classType.findUnique({
            where: { id: resource.classTypeId },
            select: { yearId: true }
        });

        if (classType) {
            revalidatePath(`/admin/classes/${classType.yearId}/${resource.classTypeId}`);
        }

        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to update resource:', error);
        return { success: false, error: 'Failed to update resource' };
    }
}

export async function deleteResource(id: string) {
    try {
        const resource = await prisma.resource.findUnique({
            where: { id },
            select: { classTypeId: true }
        });

        if (!resource) {
            return { success: false, error: 'Resource not found' };
        }

        await prisma.resource.delete({
            where: { id },
        });

        // Get yearId for revalidation
        const classType = await prisma.classType.findUnique({
            where: { id: resource.classTypeId },
            select: { yearId: true }
        });

        if (classType) {
            revalidatePath(`/admin/classes/${classType.yearId}/${resource.classTypeId}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to delete resource:', error);
        return { success: false, error: 'Failed to delete resource' };
    }
}
