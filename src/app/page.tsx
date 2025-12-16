

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BannerSection } from "@/components/landing/BannerSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { CoursesSection } from "@/components/landing/CoursesSection";
import { TimetableSection } from "@/components/landing/TimetableSection";
import { ModernFeaturesSection } from "@/components/landing/ModernFeaturesSection";
import { FreeLessonsSection } from "@/components/landing/FreeLessonsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { prisma } from "@/lib/prisma";
import { getLandingPageContent } from "@/lib/actions/content";

export default async function Home() {
  const years = await prisma.academicYear.findMany({
    where: { isActive: true },
    orderBy: { year: "asc" },
    include: {
      classTypes: {
        where: { isActive: true },
        select: { name: true }
      }
    }
  });

  const institutes = await prisma.institute.findMany({
    include: {
      timetables: {
        orderBy: { day: 'asc' } // Or however you want to sort
      }
    }
  });

  // Generate consistent timestamp for hydration matching
  const timestamp = new Date().getTime();
  const heroContent = await getLandingPageContent('hero');
  const heroData = heroContent.success ? heroContent.data : null;

  const bannerContent = await getLandingPageContent('banners');
  const bannerData = bannerContent.success ? bannerContent.data : null;

  const aboutContent = await getLandingPageContent('about');
  const aboutData = aboutContent.success ? aboutContent.data : null;

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-yellow-500 selection:text-black">
      {/* Overlay Navbar for the landing page */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <main>
        <HeroSection content={heroData} timestamp={timestamp} />
        <BannerSection content={bannerData} />
        <AboutSection content={aboutData} />
        <CoursesSection years={years} />
        <TimetableSection institutes={institutes} />
        <ModernFeaturesSection />
        <FreeLessonsSection />
        <TestimonialsSection />
      </main>

      <FooterSection />
    </div>
  );
}
