"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { ResultsSection } from "@/components/landing/ResultsSection";
import { TimetableSection } from "@/components/landing/TimetableSection";
import { ModernFeaturesSection } from "@/components/landing/ModernFeaturesSection";
import { FreeLessonsSection } from "@/components/landing/FreeLessonsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-yellow-500 selection:text-black">
      {/* Overlay Navbar for the landing page */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        {/* <ResultsSection /> */}
        <TimetableSection />
        <ModernFeaturesSection />
        <FreeLessonsSection />
        <TestimonialsSection />
        {/* <ContactSection /> */}
      </main>

      <FooterSection />
    </div>
  );
}
