import { getCurrentUser } from '@/lib/actions/auth';
import { getAllStudentResources } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import ResourcesClient from './client';

export default async function StudentResourcesPage() {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const studentId = String(session.userId || session.id || '');
    
    const result = await getAllStudentResources(studentId);
    const resources = (result.success && result.data) ? result.data : [];

    return <ResourcesClient resources={resources} />;
}