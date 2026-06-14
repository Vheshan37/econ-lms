import { ExamResultsClient } from "@/components/landing/exam-results/ExamResultsClient";
import { getLandingPageContent } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function ExamResultsPage() {
  const hallOfFameContent = await getLandingPageContent("hall-of-fame");
  const isHallOfFameEnabled =
    hallOfFameContent.success && hallOfFameContent.data
      ? hallOfFameContent.data.isEnabled !== false
      : true;

  return <ExamResultsClient isHallOfFameEnabled={isHallOfFameEnabled} />;
}
