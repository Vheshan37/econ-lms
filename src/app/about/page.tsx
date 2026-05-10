import { getLandingPageContent } from "@/lib/actions/content";
import { AboutPageClient } from "@/components/landing/about/AboutPageClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [aboutResult, featuresResult, heroResult] = await Promise.all([
    getLandingPageContent("about"),
    getLandingPageContent("features"),
    getLandingPageContent("hero"),
  ]);

  const aboutData = aboutResult.success ? aboutResult.data : null;
  const featuresData = featuresResult.success ? featuresResult.data : null;
  const heroData = heroResult.success ? heroResult.data : null;

  const teacherData = {
    name: heroData?.teacherName || "Krishan Kashthuriarachchi",
    title: heroData?.teacherTitle || "B.Sc. Economics (Sp.) University of Colombo",
    image: heroData?.teacherImage || null,
  };

  return (
    <AboutPageClient
      aboutData={aboutData}
      featuresData={featuresData}
      teacherData={teacherData}
    />
  );
}