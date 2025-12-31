import { redirect } from 'next/navigation';
import { getDevSession } from '@/lib/actions/dev-auth';
import DevDashboardClient from './client';

export default async function DevDashboardPage() {
    const session = await getDevSession();

    if (!session) {
        redirect('/developer-back-door/login');
    }

    return <DevDashboardClient />;
}
