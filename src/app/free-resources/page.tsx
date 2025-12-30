import { getLandingPageContent } from '@/lib/actions/content';
import { getFreeResources } from '@/lib/actions/freeResource';
import FreeResourcesClient from './client';

export const dynamic = 'force-dynamic';

export default async function FreeResourcesPage() {
    const [resourcesResult, hallOfFameContent] = await Promise.all([
        getFreeResources(),
        getLandingPageContent('hall-of-fame')
    ]);

    const resources = resourcesResult.success && resourcesResult.data ? resourcesResult.data : [];
    const isEnabled = hallOfFameContent.success && hallOfFameContent.data ? hallOfFameContent.data.isEnabled !== false : true;

    return (
        <FreeResourcesClient
            initialResources={resources}
            isHallOfFameEnabled={isEnabled}
        />
    );
}
