'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ResourceType } from '@prisma/client';

export async function createResource(data: {
    topicId: string;
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await (prisma as any).resource.create({
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
                topicId: data.topicId,
            },
        });

        // Get hierarchy for revalidation
        const topic = await (prisma as any).topic.findUnique({
            where: { id: data.topicId },
            include: {
                classType: {
                    select: { yearId: true, id: true }
                }
            }
        });

        if (topic) {
            revalidatePath(`/admin/classes/${topic.classType.yearId}/${topic.classType.id}/${data.topicId}`);
        }

        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to create resource:', error);
        return { success: false, error: 'Failed to create resource' };
    }
}

export async function updateResource(id: string, data: {
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
}) {
    try {
        const resource = await (prisma as any).resource.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                description: data.description,
            },
        });

        // Get hierarchy for revalidation
        const topic = await (prisma as any).topic.findUnique({
            where: { id: resource.topicId },
            include: {
                classType: {
                    select: { yearId: true, id: true }
                }
            }
        });

        if (topic) {
            revalidatePath(`/admin/classes/${topic.classType.yearId}/${topic.classType.id}/${resource.topicId}`);
        }

        return { success: true, data: resource };
    } catch (error) {
        console.error('Failed to update resource:', error);
        return { success: false, error: 'Failed to update resource' };
    }
}

export async function deleteResource(id: string) {
    try {
        const resource = await (prisma as any).resource.findUnique({
            where: { id },
            include: {
                topic: {
                    include: {
                        // @ts-ignore
                        classType: {
                            select: { yearId: true, id: true }
                        }
                    }
                }
            }
        });

        if (!resource) {
            return { success: false, error: 'Resource not found' };
        }

        await (prisma as any).resource.delete({
            where: { id },
        });

        revalidatePath(`/admin/classes/${resource.topic.classType.yearId}/${resource.topic.classType.id}/${resource.topicId}`);

        return { success: true };
    } catch (error) {
        console.error('Failed to delete resource:', error);
        return { success: false, error: 'Failed to delete resource' };
    }
}
