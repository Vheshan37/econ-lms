import { getCurrentUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export async function getStudentSession() {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    return {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
    };
}
