'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStudentPayments(studentId: string, year?: number) {
    try {
        const where: Record<string, unknown> = {
            studentId,
        };

        if (year) {
            where.year = year; 
        }

        const payments = await prisma.studentPayments.findMany({
            where,
            orderBy: { month: 'asc' },
        });

        const cleanData = payments.map((p) => ({
            id: p.id,
            studentId: p.studentId,
            year: p.year, 
            month: Number(p.month),
            fee: Number(p.fee),
        }));

        return {
            success: true,
            data: cleanData,
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch payments' };
    }
}

export async function recordStudentPayment(data: {
    studentId: string;
    year: number;
    month: number;
    fee: number;
}) {
    try {
        const existing = await prisma.studentPayments.findFirst({
            where: {
                studentId: data.studentId,
                year: data.year,
                month: data.month,
            },
        });

        if (existing) {
            const updated = await prisma.studentPayments.update({
                where: { id: existing.id },
                data: { fee: data.fee },
            });

            revalidatePath('/admin/class-fees');
            return {
                success: true,
                data: { ...updated, fee: Number(updated.fee) },
                message: 'Payment updated successfully',
            };
        }

        const payment = await prisma.studentPayments.create({
            data: {
                studentId: data.studentId,
                year: data.year, 
                month: data.month,
                fee: data.fee,
            },
        });

        revalidatePath('/admin/class-fees');
        return {
            success: true,
            data: { ...payment, fee: Number(payment.fee) },
            message: 'Payment recorded successfully',
        };
    } catch (error) {
        return { success: false, error: 'Failed to record payment' };
    }
}