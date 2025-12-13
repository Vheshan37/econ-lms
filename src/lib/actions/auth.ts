'use server';

import { prisma } from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET;
if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

interface SessionPayload extends JWTPayload {
    userId: string;
    email: string;
    role: 'student' | 'teacher';
    name: string;
}

// Generate 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create session token
async function createSessionToken(payload: SessionPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

// Verify session token
async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

// Send OTP to user's email
export async function sendLoginOTP(email: string, userType: 'student' | 'teacher') {
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Invalid email format' };
        }

        // Check if user exists
        let user;
        let userName;

        if (userType === 'student') {
            user = await prisma.student.findUnique({
                where: { email },
                select: { id: true, name: true, isActive: true }
            });
        } else {
            user = await prisma.teacher.findUnique({
                where: { email },
                select: { id: true, name: true, isActive: true }
            });
        }

        if (!user) {
            return { success: false, error: 'Account not found' };
        }

        if (!user.isActive) {
            return { success: false, error: 'Account is inactive. Please contact administrator.' };
        }

        userName = user.name;

        // Check rate limiting (max 3 OTPs per 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const recentOTPs = await prisma.oTP.count({
            where: {
                email,
                userType,
                createdAt: { gte: fifteenMinutesAgo }
            }
        });

        if (recentOTPs >= 3) {
            return {
                success: false,
                error: 'Too many OTP requests. Please try again in 15 minutes.'
            };
        }

        // Invalidate previous OTPs for this email
        await prisma.oTP.deleteMany({
            where: {
                email,
                userType,
                isVerified: false
            }
        });

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        await prisma.oTP.create({
            data: {
                email,
                code: otpCode,
                userType,
                expiresAt,
                isVerified: false
            }
        });

        // Send OTP via email
        const emailResult = await sendOTPEmail({
            to: email,
            otp: otpCode,
            userName
        });

        if (!emailResult.success) {
            return { success: false, error: 'Failed to send OTP email. Please try again.' };
        }

        return {
            success: true,
            message: 'OTP sent successfully to your email'
        };

    } catch (error) {
        console.error('Send OTP error:', error);
        return { success: false, error: 'An error occurred. Please try again.' };
    }
}

// Verify OTP and create session
export async function verifyOTP(email: string, otp: string, userType: 'student' | 'teacher') {
    try {
        // Find valid OTP
        const otpRecord = await prisma.oTP.findFirst({
            where: {
                email,
                code: otp,
                userType,
                isVerified: false,
                expiresAt: { gte: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) {
            return { success: false, error: 'Invalid or expired OTP' };
        }

        // Get user details
        let user;
        if (userType === 'student') {
            user = await prisma.student.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, isActive: true }
            });
        } else {
            user = await prisma.teacher.findUnique({
                where: { email },
                select: { id: true, name: true, email: true, isActive: true }
            });
        }

        if (!user || !user.isActive) {
            return { success: false, error: 'Account not found or inactive' };
        }

        // Mark OTP as verified
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { isVerified: true }
        });

        // Create session
        const sessionPayload: SessionPayload = {
            userId: user.id,
            email: user.email,
            role: userType,
            name: user.name
        };

        const token = await createSessionToken(sessionPayload);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: userType
            }
        };

    } catch (error) {
        console.error('Verify OTP error:', error);
        return { success: false, error: 'An error occurred. Please try again.' };
    }
}

// Get current user from session
export async function getCurrentUser(): Promise<SessionPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;

        if (!token) {
            return null;
        }

        const payload = await verifySessionToken(token);
        return payload;

    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

// Logout
export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('session');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: 'Failed to logout' };
    }
}

// Create teacher account (for initial setup)
export async function createTeacher(name: string, email: string) {
    try {
        // Check if teacher already exists
        const existing = await prisma.teacher.findUnique({
            where: { email }
        });

        if (existing) {
            return { success: false, error: 'Teacher account already exists' };
        }

        // Create teacher
        const teacher = await prisma.teacher.create({
            data: {
                name,
                email,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return { success: true, teacher };

    } catch (error) {
        console.error('Error creating teacher:', error);
        return { success: false, error: 'Failed to create teacher account' };
    }
}
