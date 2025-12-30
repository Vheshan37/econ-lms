import { getLandingPageContent } from '@/lib/actions/content';
import OLStudentsClient from './client';

export const dynamic = 'force-dynamic';

export default async function OLStudentsPage() {
    const hallOfFameContent = await getLandingPageContent('hall-of-fame');
    const isEnabled = hallOfFameContent.success && hallOfFameContent.data ? hallOfFameContent.data.isEnabled !== false : true;

    return (
        <OLStudentsClient isHallOfFameEnabled={isEnabled} />
    );
}
