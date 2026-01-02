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
            from: `"Quality ම Econ" <${process.env.SMTP_FROM}>`,
            to,
            subject: 'Your Login OTP - Quality ම Econ',
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
                            <h1>🎓 Quality ම Econ</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                ${userName ? `Hello ${userName},` : 'Hello,'}
                            </div>
                            <p>You requested to log in to your Quality ම Econ account. Use the OTP code below to complete your login:</p>
                            
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
    role: 'student' | 'teacher';
}

export async function sendInvitationEmail({ to, userName, role }: SendInvitationEmailParams) {
    try {
        const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://krishankasthuriarachchi.lk';
        const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

        const mailOptions = {
            from: `"Quality ම Econ" <${process.env.SMTP_FROM}>`,
            to,
            subject: `Welcome to Quality ම Econ - Your ${roleLabel} Account is Ready`,
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
                            <h1>🎓 Quality ම Econ</h1>
                        </div>
                        <div class="content">
                            <div class="greeting">
                                Hello ${userName},
                            </div>
                            <div class="message">
                                <p>Welcome to Quality ම Econ! Your <strong>${role}</strong> account has been successfully created.</p>
                                <p>You can now access your management dashboard and resources directly through our platform.</p>
                            </div>
                            
                            <div class="button-container">
                                <a href="${loginUrl}/login" class="login-button">Login to Your Account</a>
                            </div>
                            
                            <div class="info">
                                <p><strong>How to Login:</strong></p>
                                <p>1. Click the button above or go to the login page.</p>
                                <p>2. Enter your email address: <strong>${to}</strong></p>
                                <p>3. Select "<strong>${roleLabel}</strong>" as your user type.</p>
                                <p>4. You will receive a secure OTP code via email to log in.</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Quality ම Econ. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Welcome to Quality ම Econ, ${userName}!\n\nYour ${role} account has been created. You can login at ${loginUrl}/login using your email: ${to}\n\nWe use a secure OTP-based login system, so no password is required.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL_DEBUG] Invitation email sent successfully!`);
        console.log(`[EMAIL_DEBUG] To: ${to}`);
        console.log(`[EMAIL_DEBUG] Role: ${role}`);
        console.log(`[EMAIL_DEBUG] Message-ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send invitation email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

export async function sendNotificationEmail({
    to,
    userName,
    notification
}: {
    to: string;
    userName: string;
    notification: { title: string; message: string; type: string; priority: string; }
}) {
    try {
        const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://krishankasthuriarachchi.lk';

        // Map types to colors/icons for the email
        const getBrandColor = (type: string) => {
            switch (type) {
                case 'announcement': return '#D4AF37'; // Gold
                case 'update': return '#FF8C00'; // Dark Orange
                case 'improvement': return '#32CD32'; // Lime Green
                case 'urgent': return '#FF0000'; // Red
                default: return '#1a1a1a'; // Dark
            }
        };

        const mailOptions = {
            from: `"Quality ම Econ" <${process.env.SMTP_FROM}>`,
            to,
            subject: `📢 ${notification.title} - Quality ම Econ Alert`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fc; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); }
                        .header { background: #1a1a1a; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${getBrandColor(notification.type)}; }
                        .header h1 { color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 2px; }
                        .content { padding: 40px 30px; }
                        .type-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; background: ${getBrandColor(notification.type)}20; color: ${getBrandColor(notification.type)}; }
                        .title { font-size: 22px; color: #1a1a1a; font-weight: 800; margin-bottom: 15px; line-height: 1.3; }
                        .message { color: #4a5568; font-size: 16px; line-height: 1.8; margin-bottom: 30px; white-space: pre-wrap; }
                        .button-container { text-align: center; margin-top: 20px; }
                        .action-button { background: #1a1a1a; color: #D4AF37; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; border: 1px solid #D4AF37; }
                        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #edf2f7; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>QUALITY ම ECON</h1>
                        </div>
                        <div class="content">
                            <span class="type-badge">${notification.type}</span>
                            <div class="title">${notification.title}</div>
                            <div class="message">${notification.message}</div>
                            <div class="button-container">
                                <a href="${loginUrl}/admin/notifications" class="action-button">View in Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Hello ${userName}, this is an important system notification regarding your teaching dashboard.</p>
                            <p>© ${new Date().getFullYear()} Quality ම Econ. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `[${notification.type.toUpperCase()}] ${notification.title}\n\n${notification.message}\n\nView details at: ${loginUrl}/admin/notifications`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Failed to send notification email:', error);
        return { success: false, error: 'Failed to send notification email' };
    }
}

export async function sendDeveloperTicket({
    fromName,
    fromEmail,
    requestType,
    subject,
    message,
    ticketId
}: {
    fromName: string;
    fromEmail: string;
    requestType: string;
    subject: string;
    message: string;
    ticketId: string;
}) {
    try {
        const developerEmail = 'vihangaheshan37@gmail.com';

        const mailOptions = {
            from: `"LMS Support Ticket" <${process.env.SMTP_FROM}>`,
            to: developerEmail,
            replyTo: fromEmail,
            subject: `[${ticketId}] [${requestType.toUpperCase()}] ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                        .container { max-width: 650px; margin: 30px auto; background: white; border-top: 5px solid #D4AF37; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                        .header { padding: 30px; background: #1a1a1a; color: white; }
                        .header h1 { margin: 0; font-size: 20px; color: #D4AF37; letter-spacing: 1px; }
                        .content { padding: 35px; }
                        .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
                        .meta-item { font-size: 13px; }
                        .meta-label { color: #6b7280; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; display: block; }
                        .meta-value { color: #111827; font-weight: 600; }
                        .message-box { border-left: 4px solid #D4AF37; padding: 20px; background: #fffcf0; color: #374151; line-height: 1.6; font-size: 15px; margin-top: 25px; white-space: pre-wrap; }
                        .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 11px; background: #f9fafb; border-top: 1px solid #eee; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>NEW DEVELOPER REQUEST #${ticketId}</h1>
                        </div>
                        <div class="content">
                            <div class="meta-grid">
                                <div class="meta-item">
                                    <span class="meta-label">Ticket ID</span>
                                    <span class="meta-value" style="color: #D4AF37;">${ticketId}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Request Type</span>
                                    <span class="meta-value" style="text-transform: capitalize;">${requestType}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Sender Name</span>
                                    <span class="meta-value">${fromName}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Email Address</span>
                                    <span class="meta-value">${fromEmail}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Timestamp</span>
                                    <span class="meta-value">${new Date().toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <h2 style="font-size: 18px; color: #111827; margin-bottom: 10px;">Subject: ${subject}</h2>
                            <div class="message-box">
                                ${message}
                            </div>
                        </div>
                        <div class="footer">
                            <p>This inquiry was sent directly from the Econ LMS Admin Panel Contact Developer form.</p>
                            <p>© ${new Date().getFullYear()} Econ LMS System Automations</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `NEW DEVELOPER REQUEST [${ticketId}]\n\nFrom: ${fromName} (${fromEmail})\nType: ${requestType}\nSubject: ${subject}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Failed to send developer ticket:', error);
        return { success: false, error: 'Failed to deliver message to developer.' };
    }
}

export async function sendTicketConfirmation({
    toName,
    toEmail,
    ticketId,
    subject,
    requestType,
    message
}: {
    toName: string;
    toEmail: string;
    ticketId: string;
    subject: string;
    requestType: string;
    message: string;
}) {
    try {
        const mailOptions = {
            from: `"Quality ම Econ Support" <${process.env.SMTP_FROM}>`,
            to: toEmail,
            subject: `Ticket Received: ${subject} [${ticketId}]`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                        .header { background: #1a1a1a; padding: 40px 30px; text-align: center; }
                        .header h1 { color: #D4AF37; margin: 10px 0 0 0; font-size: 24px; letter-spacing: 1px; }
                        .ticket-status { background: #fff8e6; border: 1px solid #ffeeba; color: #856404; padding: 12px; text-align: center; font-size: 14px; font-weight: 500; }
                        .content { padding: 40px 35px; color: #444; }
                        .greeting { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; }
                        .summary-box { background: #f9fafb; border: 1px solid #eee; padding: 25px; border-radius: 8px; margin: 25px 0; }
                        .summary-title { font-size: 13px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 15px; }
                        .detail-row { display: flex; margin-bottom: 12px; font-size: 14px; }
                        .detail-label { width: 100px; color: #777; flex-shrink: 0; }
                        .detail-value { color: #1a1a1a; font-weight: 500; }
                        .message-quote { border-left: 3px solid #D4AF37; padding: 15px; background: #fffcf0; font-style: italic; color: #555; margin-top: 15px; font-size: 14px; }
                        .next-steps { border-top: 1px solid #eee; padding-top: 30px; margin-top: 30px; font-size: 14px; line-height: 1.6; }
                        .footer { background: #f8f9fa; padding: 25px; text-align: center; color: #999; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span style="font-size: 32px;">🎓</span>
                            <h1>Quality ම Econ</h1>
                        </div>
                        <div class="ticket-status">
                            Ticket Ref: <strong style="color: #1a1a1a;">${ticketId}</strong> • Status: Received
                        </div>
                        <div class="content">
                            <div class="greeting">Hello ${toName},</div>
                            <p>Thank you for reaching out. We have received your request regarding <strong>"${subject}"</strong>. Our development team has been notified and will review your inquiry shortly.</p>
                            
                            <div class="summary-box">
                                <div class="summary-title">Ticket Information</div>
                                <div class="detail-row">
                                    <div class="detail-label">Ticket ID</div>
                                    <div class="detail-value" style="color: #D4AF37;">${ticketId}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Type</div>
                                    <div class="detail-value" style="text-transform: capitalize;">${requestType}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Subject</div>
                                    <div class="detail-value">${subject}</div>
                                </div>
                                <div class="message-quote">
                                    "${message.length > 200 ? message.substring(0, 200) + '...' : message}"
                                </div>
                            </div>

                            <div class="next-steps">
                                <p><strong>What happens next?</strong></p>
                                <p>A developer will investigate your request. You will receive a response at this email address within 24-48 hours. If this is an urgent technical issue, please mention it in a follow-up if needed.</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Please do not reply directly to this automated confirmation.</p>
                            <p>© ${new Date().getFullYear()} Quality ම Econ. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hello ${toName},\n\nWe have received your ticket #${ticketId} regarding "${subject}". Our team will review it and get back to you shortly.\n\nTicket Summary:\nID: ${ticketId}\nType: ${requestType}\nSubject: ${subject}\n\nThank you for using Quality ම Econ.`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Failed to send teacher confirmation email:', error);
        return { success: false, error: 'Failed to send confirmation email.' };
    }
}

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
