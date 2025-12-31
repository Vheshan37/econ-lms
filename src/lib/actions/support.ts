'use server';

import { sendDeveloperTicket } from '@/lib/email';
import { getCurrentUser } from '@/lib/actions/auth';

export async function contactDeveloper(formData: {
    requestType: string;
    subject: string;
    message: string;
}) {
    try {
        const session = await getCurrentUser();
        if (!session) {
            return { success: false, error: 'Unauthorized. Please log in.' };
        }

        const result = await sendDeveloperTicket({
            fromName: session.name || 'Admin/Teacher',
            fromEmail: session.email,
            requestType: formData.requestType,
            subject: formData.subject,
            message: formData.message
        });

        return result;
    } catch (error) {
        console.error('Contact developer action error:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again later.' };
    }
}
