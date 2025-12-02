'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- Landing Page Content ---

export async function getLandingPageContent(section: string) {
    try {
        const content = await prisma.landingPageContent.findUnique({
            where: { section },
        });
        return { success: true, data: content?.content };
    } catch (error) {
        console.error(`Error fetching ${section} content:`, error);
        return { success: false, error: 'Failed to fetch content' };
    }
}

export async function updateLandingPageContent(section: string, content: any) {
    try {
        await prisma.landingPageContent.upsert({
            where: { section },
            update: { content },
            create: { section, content },
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error(`Error updating ${section} content:`, error);
        return { success: false, error: 'Failed to update content' };
    }
}

// --- Testimonials ---

export async function getTestimonials() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: testimonials };
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return { success: false, error: 'Failed to fetch testimonials' };
    }
}

export async function createTestimonial(data: { name: string; role: string; content: string; imageUrl?: string }) {
    try {
        await prisma.testimonial.create({
            data,
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return { success: false, error: 'Failed to create testimonial' };
    }
}

export async function updateTestimonial(id: string, data: { name?: string; role?: string; content?: string; imageUrl?: string; isActive?: boolean }) {
    try {
        await prisma.testimonial.update({
            where: { id },
            data,
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return { success: false, error: 'Failed to update testimonial' };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await prisma.testimonial.delete({
            where: { id },
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return { success: false, error: 'Failed to delete testimonial' };
    }
}

// --- Modern Features ---

export async function getModernFeatures() {
    try {
        const features = await prisma.modernFeature.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: features };
    } catch (error) {
        console.error('Error fetching modern features:', error);
        return { success: false, error: 'Failed to fetch features' };
    }
}

export async function createModernFeature(data: { title: string; description: string; icon: string; order?: number }) {
    try {
        await prisma.modernFeature.create({
            data,
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating modern feature:', error);
        return { success: false, error: 'Failed to create feature' };
    }
}

export async function updateModernFeature(id: string, data: { title?: string; description?: string; icon?: string; order?: number; isActive?: boolean }) {
    try {
        await prisma.modernFeature.update({
            where: { id },
            data,
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating modern feature:', error);
        return { success: false, error: 'Failed to update feature' };
    }
}

export async function deleteModernFeature(id: string) {
    try {
        await prisma.modernFeature.delete({
            where: { id },
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting modern feature:', error);
        return { success: false, error: 'Failed to delete feature' };
    }
}
