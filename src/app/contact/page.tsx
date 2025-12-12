import { Navbar } from "@/components/Navbar";
import { FooterSection } from "@/components/landing/FooterSection";
import { ContactSection } from "@/components/landing/ContactSection";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className=""> {/* Add padding for fixed navbar */}
                <ContactSection />
            </div>
            <FooterSection />
        </main>
    );
}
