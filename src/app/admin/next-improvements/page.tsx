import { getDeveloperContact } from '@/lib/actions/developer';
import NextImprovementsClient from './client';

export default async function NextImprovementsPage() {
    const contact = await getDeveloperContact();

    return <NextImprovementsClient contact={contact} />;
}
