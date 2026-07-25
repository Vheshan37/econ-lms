import { getCurrentUser } from "@/lib/actions/auth";
import { getTopicResourcesWithPaymentStatus } from "@/lib/actions/studentData";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicResourcesClient } from "./client";
import { prisma } from "@/lib/prisma";

export default async function StudentTopicResourcesPage({
  params,
}: {
  params: Promise<{ yearId: string; typeId: string; topicId: string }>;
}) {
  const session = await getCurrentUser();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const studentId = String(session.id || session.userId || "");

  if (!studentId || studentId === "undefined") {
    redirect("/login");
  }

  const { yearId, typeId, topicId } = await params;

  const academicYear = await prisma.academicYear.findUnique({
    where: { id: yearId },
    select: { year: true },
  });

  const yearNumber = academicYear?.year
    ? parseInt(academicYear.year.replace(/\D/g, ""), 10)
    : new Date().getFullYear();

  const result = await getTopicResourcesWithPaymentStatus(
    topicId,
    studentId,
    yearNumber,
  );

  const resources =
    result.success && result.data
      ? result.data.map((r: any) => ({
          ...r,
          description: r.description ?? undefined,
          month:
            r.month !== null && r.month !== undefined
              ? Number(r.month)
              : undefined,
          year: r.year ? new Date(r.year).getFullYear() : undefined,
          isPaid: Boolean(r.isPaid),
          isFree: Boolean(r.isFree),
        }))
      : [];

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <div className="mx-auto space-y-8 w-full max-w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href={`/student/classes/${yearId}/${typeId}`}>
                <Button
                  variant="ghost"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                  <span className="text-[#D4AF37] font-medium">Resources</span>
                </div>
                <h1 className="text-xl sm:text-4xl font-bold text-white">
                  Topic Materials
                </h1>
                <p className="text-gray-400 mt-1 text-xs sm:text-sm max-w-xl">
                  Access videos, notes, and quizzes for this topic.
                </p>
              </div>
            </div>
          </div>
        </div>

        <TopicResourcesClient resources={resources} />
      </div>
    </div>
  );
}
