import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { ContactSection } from "@/components/landing/ContactSection";

import { getLandingPageContent } from "@/lib/actions/content";

export default async function ContactPage() {
    const hallOfFameContent = await getLandingPageContent('hall-of-fame');
    const isEnabled = hallOfFameContent.success && hallOfFameContent.data ? hallOfFameContent.data.isEnabled !== false : true;

    return (
        <main className="min-h-screen bg-black">
            <Navbar isHallOfFameEnabled={isEnabled} />
            <div className=""> {/* Add padding for fixed navbar */}
                <ContactSection />
            </div>
            <FooterSection />
        </main>
    );
}
