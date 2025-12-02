'use server';

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface SendOTPEmailParams {
    to: string;
    otp: string;
    userName?: string;
}

export async function sendOTPEmail({ to, otp, userName }: SendOTPEmailParams) {
    try {
        const mailOptions = {
            from: `"Econ LMS" <${process.env.SMTP_FROM}>`,
            to,
            subject: 'Your Login OTP - Econ LMS',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                            padding: 40px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            color: #D4AF37;
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 20px;
                        }
                        .otp-box {
                            background: linear-gradient(135deg, #D4AF37 0%, #B5952F 100%);
                            color: #1a1a1a;
                            font-size: 36px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            text-align: center;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 30px 0;
                        }
                        .info {
                            color: #666;
                            font-size: 14px;
                            line-height: 1.6;
                            margin-top: 20px;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 12px;
                            margin-top: 20px;
                            font-size: 13px;
                            color: #856404;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎓 Econ LMS</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                ${userName ? `Hello ${userName},` : 'Hello,'}
                            </div>
                            <p>You requested to log in to your Econ LMS account. Use the OTP code below to complete your login:</p>
                            
                            <div class="otp-box">
                                ${otp}
                            </div>
                            
                            <div class="info">
                                <p><strong>This OTP is valid for 10 minutes.</strong></p>
                                <p>If you didn't request this code, please ignore this email. Your account remains secure.</p>
                            </div>
                            
                            <div class="warning">
                                ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. Econ LMS staff will never ask for your OTP.
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Econ LMS. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Your Econ LMS login OTP is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

interface SendInvitationEmailParams {
    to: string;
    userName: string;
}

export async function sendInvitationEmail({ to, userName }: SendInvitationEmailParams) {
    try {
        const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const mailOptions = {
            from: `"Econ LMS" <${process.env.SMTP_FROM}>`,
            to,
            subject: 'Welcome to Econ LMS - Your Account is Ready',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                            padding: 40px 20px;
                            text-align: center;
                        }
                        .header h1 {
                            color: #D4AF37;
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #333;
                            margin-bottom: 20px;
                        }
                        .message {
                            color: #666;
                            font-size: 16px;
                            line-height: 1.6;
                            margin-bottom: 30px;
                        }
                        .button-container {
                            text-align: center;
                            margin: 30px 0;
                        }
                        .login-button {
                            background: linear-gradient(135deg, #D4AF37 0%, #B5952F 100%);
                            color: #1a1a1a;
                            text-decoration: none;
                            padding: 15px 30px;
                            border-radius: 8px;
                            font-weight: bold;
                            font-size: 16px;
                            display: inline-block;
                            box-shadow: 0 4px 6px rgba(212, 175, 55, 0.2);
                        }
                        .info {
                            color: #666;
                            font-size: 14px;
                            line-height: 1.6;
                            margin-top: 20px;
                            background: #f8f9fa;
                            padding: 15px;
                            border-radius: 8px;
                        }
                        .footer {
                            background: #f8f9fa;
                            padding: 20px;
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎓 Econ LMS</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                Hello ${userName},
                            </div>
                            <div class="message">
                                <p>Welcome to Econ LMS! Your student account has been successfully created.</p>
                                <p>You can now access your classes, resources, and learning materials directly through our platform.</p>
                            </div>
                            
                            <div class="button-container">
                                <a href="${loginUrl}/login" class="login-button">Login to Your Account</a>
                            </div>
                            
                            <div class="info">
                                <p><strong>How to Login:</strong></p>
                                <p>1. Click the button above or go to the login page.</p>
                                <p>2. Enter your email address: <strong>${to}</strong></p>
                                <p>3. Select "Student" as your user type.</p>
                                <p>4. You will receive a secure OTP code via email to log in.</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Econ LMS. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Welcome to Econ LMS, ${userName}!\n\nYour account has been created. You can login at ${loginUrl}/login using your email: ${to}\n\nWe use a secure OTP-based login system, so no password is required.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Invitation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send invitation email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

// Verify email configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('Email server is ready');
        return { success: true };
    } catch (error) {
        console.error('Email configuration error:', error);
        return { success: false, error: 'Invalid email configuration' };
    }
}
