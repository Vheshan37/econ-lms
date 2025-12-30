import { getLandingPageContent } from '@/lib/actions/content';
import { getOLSubjects } from '@/lib/actions/ol-subject';
import OLStudentsClient from './client';

export const dynamic = 'force-dynamic';

export default async function OLStudentsPage() {
    const [hallOfFameContent, subjectsResult, pageSettingsResult] = await Promise.all([
        getLandingPageContent('hall-of-fame'),
        getOLSubjects(),
        getLandingPageContent('ol-resources')
    ]);

    const isEnabled = hallOfFameContent.success && hallOfFameContent.data ? hallOfFameContent.data.isEnabled !== false : true;
    const subjects = subjectsResult.success && subjectsResult.data ? subjectsResult.data : [];
    const pageSettings = pageSettingsResult.success && pageSettingsResult.data ? pageSettingsResult.data : null;

    return (
        <OLStudentsClient
            isHallOfFameEnabled={isEnabled}
            initialSubjects={subjects}
            pageSettings={pageSettings}
        />
    );
}
