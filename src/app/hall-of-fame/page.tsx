import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { ResultsSection } from "@/components/landing/ResultsSection";

export default function HallOfFamePage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className=""> {/* Add padding for fixed navbar */}
                <ResultsSection />
            </div>
            <FooterSection />
        </main>
    );
}
