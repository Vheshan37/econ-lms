import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { ResultsSection } from "@/components/landing/ResultsSection";

import { getLandingPageContent } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function HallOfFamePage() {
  const hallOfFameContent = await getLandingPageContent("hall-of-fame");
  const isEnabled =
    hallOfFameContent.success && hallOfFameContent.data
      ? hallOfFameContent.data.isEnabled !== false
      : true;

  return (
    <main className="min-h-screen bg-black">
      <Navbar isHallOfFameEnabled={isEnabled} />
      <div className="">
        {" "}
        {/* Add padding for fixed navbar */}
        <ResultsSection />
      </div>
      <FooterSection />
    </main>
  );
}
