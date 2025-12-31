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
        .setExpirationTime('24h') // Developer session is shorter for security
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
        // Validate credentials
        if (email !== DEV_EMAIL || password !== DEV_PASSWORD) {
            return { success: false, error: 'Invalid developer credentials' };
        }

        // Check if dev user is tracked in some way? 
        // We'll use the 'teacher' user type in OTP table but mark it as developer in role if needed
        // Or just use 'teacher' as a proxy if we don't want to change the schema.
        // Actually the OTP table has userType string. We can use 'developer'.

        // Invalidate previous OTPs for this email
        await prisma.oTP.deleteMany({
            where: {
                email,
                userType: 'developer',
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
                userType: 'developer',
                expiresAt,
                isVerified: false
            }
        });

        // Send OTP via email
        const emailResult = await sendOTPEmail({
            to: email,
            otp: otpCode,
            userName: 'Developer'
        });

        if (!emailResult.success) {
            return { success: false, error: 'Failed to send OTP email' };
        }

        return {
            success: true,
            message: 'Developer OTP sent successfully'
        };

    } catch (error) {
        console.error('Dev Send OTP error:', error);
        return { success: false, error: 'An error occurred during authentication' };
    }
}

// Step 2: Verify OTP and set Developer Session
export async function verifyDevOTP(email: string, otp: string) {
    try {
        if (email !== DEV_EMAIL) {
            return { success: false, error: 'Invalid request' };
        }

        // Find valid OTP
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

        if (!otpRecord) {
            return { success: false, error: 'Invalid or expired OTP' };
        }

        // Mark OTP as verified
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { isVerified: true }
        });

        // Create dev session
        const payload: DevSessionPayload = {
            role: 'developer',
            email: DEV_EMAIL
        };

        const token = await createDevToken(payload);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('dev_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
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
