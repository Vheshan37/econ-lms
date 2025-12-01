'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
    try {
        const [
            studentCount,
            resourceCount,
            yearCount,
            instituteCount,
            hallOfFameCount
        ] = await Promise.all([
            (prisma as any).user.count({ where: { role: 'student' } }),
            (prisma as any).resource.count(),
            (prisma as any).year.count({ where: { isActive: true } }),
            (prisma as any).institute.count(),
            (prisma as any).hallOfFame.count()
        ]);

        return {
            success: true,
            data: {
                studentCount,
                resourceCount,
                yearCount,
                instituteCount,
                hallOfFameCount
            }
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return { success: false, error: 'Failed to fetch dashboard stats' };
    }
}
