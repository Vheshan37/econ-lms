import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentUpcomingClasses } from '@/lib/actions/onlineClass';
import { redirect } from 'next/navigation';
import OnlineClassesClient from '@/app/student/online-classes/client';

export default async function OnlineClassesPage() {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const studentId = String(session.userId || session.id || '');
    
    const result = await getStudentUpcomingClasses(studentId);
    const classes = (result.success && result.data) ? result.data : [];

    return <OnlineClassesClient initialClasses={classes} />;
}