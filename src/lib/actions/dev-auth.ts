'use server';

import { prisma } from '@/lib/prisma';
import { sendOTPEmail, sendInvitationEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;
if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

interface DevSessionPayload extends JWTPayload {
    role: 'developer';
    email: string;
}

const DEV_EMAIL = 'vihangaheshan37@gmail.com';
const DEV_PASSWORD = 'Vheshan37@37';

// Generate 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create dev session token
async function createDevToken(payload: DevSessionPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
}

// Verify dev session token
export async function verifyDevToken(token: string): Promise<DevSessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'developer') return null;
        return payload as DevSessionPayload;
    } catch {
        return null;
    }
}

// Step 1: Validate Password and Send OTP
export async function sendDevOTP(email: string, password: string) {
    try {
        if (email !== DEV_EMAIL || password !== DEV_PASSWORD) {
            return { success: false, error: 'Invalid developer credentials' };
        }

        await prisma.oTP.deleteMany({
            where: {
                email,
                userType: 'developer',
                isVerified: false
            }
        });

        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.oTP.create({
            data: {
                email,
                code: otpCode,
                userType: 'developer',
                expiresAt,
                isVerified: false
            }
        });

        const emailResult = await sendOTPEmail({
            to: email,
            otp: otpCode,
            userName: 'Developer'
        });

        if (!emailResult.success) {
            return { success: false, error: 'Failed to send OTP email' };
        }

        return { success: true, message: 'Developer OTP sent successfully' };
    } catch (error) {
        console.error('Dev Send OTP error:', error);
        return { success: false, error: 'An error occurred during authentication' };
    }
}

// Step 2: Verify OTP and set Developer Session
export async function verifyDevOTP(email: string, otp: string) {
    try {
        if (email !== DEV_EMAIL) return { success: false, error: 'Invalid request' };

        const otpRecord = await prisma.oTP.findFirst({
            where: {
                email,
                code: otp,
                userType: 'developer',
                isVerified: false,
                expiresAt: { gte: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) return { success: false, error: 'Invalid or expired OTP' };

        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { isVerified: true }
        });

        const payload: DevSessionPayload = { role: 'developer', email: DEV_EMAIL };
        const token = await createDevToken(payload);

        const cookieStore = await cookies();
        cookieStore.set('dev_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/'
        });

        return { success: true };
    } catch (error) {
        console.error('Dev Verify OTP error:', error);
        return { success: false, error: 'An error occurred. Please try again.' };
    }
}

// Get current dev session
export async function getDevSession(): Promise<DevSessionPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('dev_session')?.value;
        if (!token) return null;
        return await verifyDevToken(token);
    } catch {
        return null;
    }
}

// Teacher Management Actions
export async function getAllTeachers() {
    const session = await getDevSession();
    if (!session) throw new Error('Unauthorized');

    return await prisma.teacher.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function devCreateTeacher(name: string, email: string) {
    const session = await getDevSession();
    if (!session) throw new Error('Unauthorized');

    try {
        const existing = await prisma.teacher.findUnique({ where: { email } });
        if (existing) return { success: false, error: 'Email already exists' };

        const teacher = await prisma.teacher.create({
            data: { name, email, isActive: true }
        });

        // Send onboarding email
        await sendInvitationEmail({
            to: email,
            userName: name,
            role: 'teacher'
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error' };
    }
}

export async function toggleTeacherStatus(id: string, currentStatus: boolean) {
    const session = await getDevSession();
    if (!session) throw new Error('Unauthorized');

    try {
        await prisma.teacher.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Database error' };
    }
}

// Analytics Actions
export async function getDevAnalytics() {
    const session = await getDevSession();
    if (!session) throw new Error('Unauthorized');

    try {
        const [
            students,
            teachers,
            academicYears,
            classTypes,
            topics,
            resources,
            freeResources,
            institutes,
            testimonials,
            hallOfFame,
            notifications,
            olSubjects,
            timetables,
            courses,
            features
        ] = await Promise.all([
            prisma.student.count(),
            prisma.teacher.count(),
            prisma.academicYear.count(),
            prisma.classType.count(),
            prisma.topic.count(),
            prisma.resource.count(),
            prisma.freeResource.count(),
            prisma.institute.count(),
            prisma.testimonial.count(),
            prisma.hallOfFame.count(),
            prisma.notification.count(),
            prisma.oLSubject.count(),
            prisma.timetable.count(),
            prisma.course.count(),
            prisma.modernFeature.count()
        ]);

        // Get student status breakdown
        const [activeStudents, inactiveStudents] = await Promise.all([
            prisma.student.count({ where: { isActive: true } }),
            prisma.student.count({ where: { isActive: false } })
        ]);

        return {
            counts: {
                students,
                teachers,
                academicYears,
                classTypes,
                topics,
                resources,
                freeResources,
                institutes,
                testimonials,
                hallOfFame,
                notifications,
                olSubjects,
                timetables,
                courses,
                features
            },
            studentsStatus: {
                active: activeStudents,
                inactive: inactiveStudents
            }
        };
    } catch (error) {
        console.error('Analytics error:', error);
        throw new Error('Failed to fetch analytics');
    }
}

// Logout dev
export async function devLogout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('dev_session');
        return { success: true };
    } catch {
        return { success: false };
    }
}
