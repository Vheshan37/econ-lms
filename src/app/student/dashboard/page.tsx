import { getCurrentUser } from "@/lib/actions/auth";
import {
  getStudentDashboardStats,
  getStudentYears,
} from "@/lib/actions/studentData";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  BookOpen,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  User,
  Video,
  Monitor,
  Clock,
  ExternalLink,
} from "lucide-react";

// Type for a single session (either YouTube or Zoom - never both)
// Each session represents ONE platform at ONE specific time
type Session = {
  id: string; // Composite key: `${classId}-${platform}`
  classId: number;
  platform: "youtube" | "zoom";
  time: Date;
  link: string;
  zoomId?: string | null;
  zoomPasscode?: string | null;
  dayLabel: string;
};

export default async function StudentDashboard() {
  const session = await getCurrentUser();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const [statsResult, yearsResult] = await Promise.all([
    getStudentDashboardStats(session.userId),
    getStudentYears(session.userId),
  ]);

  const stats = statsResult.success ? statsResult.data : null;
  const years = yearsResult.success && yearsResult.data ? yearsResult.data : [];

  // ─── Fetch Upcoming Sessions (Starting from Today) ──────
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  // Get the student's assigned class type IDs
  const student = await prisma.student.findUnique({
    where: { id: session.userId },
    include: {
      classAssignments: {
        select: { classTypeId: true },
      },
    },
  });

  const studentClassTypeIds = student
    ? new Set(student.classAssignments.map((a) => a.classTypeId))
    : new Set<string>();

  // Fetch all classes from today onwards
  const allFutureClasses = await prisma.onlineClasses.findMany({
    where: {
      OR: [
        { youtubeTime: { gte: startOfToday } },
        { zoomTime: { gte: startOfToday } },
      ],
    },
  });

  // Filter classes to only show those relevant to the student
  const relevantClasses = allFutureClasses.filter((cls) => {
    const classTypes = cls.classTypes as string[];
    if (!Array.isArray(classTypes) || classTypes.length === 0) return false;
    return classTypes.some((ctId) => studentClassTypeIds.has(ctId));
  });

  // ─── CRITICAL FIX: Treat each platform as completely independent session ──────
  // Each OnlineClass record becomes 0, 1, or 2 separate sessions
  // No combining - each session has its own date/time and platform
  const allSessions: Session[] = [];

  for (const cls of relevantClasses) {
    // Check YouTube session
    if (cls.youtubeLink && cls.youtubeTime) {
      const youtubeTime = new Date(cls.youtubeTime);
      // Only include if time is valid and not in the past
      if (youtubeTime >= startOfToday) {
        allSessions.push({
          id: `${cls.id}-youtube`,
          classId: cls.id,
          platform: "youtube",
          time: youtubeTime,
          link: cls.youtubeLink,
          dayLabel: "", // Will be filled later
        });
      }
    }

    // Check Zoom session (completely independent from YouTube)
    if (cls.zoomLink && cls.zoomTime) {
      const zoomTime = new Date(cls.zoomTime);
      // Only include if time is valid and not in the past
      if (zoomTime >= startOfToday) {
        allSessions.push({
          id: `${cls.id}-zoom`,
          classId: cls.id,
          platform: "zoom",
          time: zoomTime,
          link: cls.zoomLink,
          zoomId: cls.zoomId,
          zoomPasscode: cls.zoomPasscode,
          dayLabel: "", // Will be filled later
        });
      }
    }
  }

  // Sort all sessions by time (earliest first)
  // This naturally orders: Today's sessions first, then tomorrow, etc.
  allSessions.sort((a, b) => a.time.getTime() - b.time.getTime());

  // Take only the first 3 upcoming sessions
  const upcomingSessions = allSessions.slice(0, 3);

  // Helper: Get relative day label (Today, Tomorrow, or formatted date)
  const getDayLabel = (date: Date): string => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const dayAfter = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 2,
    );

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (date.toDateString() === dayAfter.toDateString())
      return date.toLocaleDateString("en-US", { weekday: "long" });

    // For dates beyond 3 days, show date
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Add dayLabel to each session
  for (const session of upcomingSessions) {
    session.dayLabel = getDayLabel(session.time);
  }

  if (!stats) {
    return <div className="p-8">Error loading dashboard data</div>;
  }

  const statCards = [
    {
      title: "Academic Years",
      value: stats.assignedYears,
      icon: GraduationCap,
      description: "Enrolled batches",
      gradient: "from-[#D4AF37] to-[#B5952F]",
      link: "/student/classes",
    },
    {
      title: "Total Classes",
      value: stats.assignedClasses,
      icon: BookOpen,
      description: "Class types",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/student/classes",
    },
    {
      title: "Topics",
      value: stats.totalTopics,
      icon: FileText,
      description: "Learning topics",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/student/classes",
    },
    {
      title: "Resources",
      value: stats.totalResources,
      icon: TrendingUp,
      description: "Study materials",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/student/resources",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">

          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
            Student Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl max-w-2xl">
            Track your progress and access your learning materials. You have
            access to{" "}
            <span className="text-[#D4AF37] font-bold">
              {stats.totalResources} resources
            </span>{" "}
            across your enrolled classes.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.link}>
            <div
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer ${
                card.isDark
                  ? "bg-white border border-gray-100 hover:border-[#D4AF37]/30"
                  : "bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-[#1a1a1a]"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-50 ${
                  card.isDark ? "bg-[#D4AF37]/10" : "bg-white/20"
                }`}
              />
              <div className="relative z-20">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                    card.isDark
                      ? "bg-[#1a1a1a] text-[#D4AF37]"
                      : "bg-[#1a1a1a]/10 text-[#1a1a1a]"
                  }`}
                >
                  <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      card.isDark ? "text-gray-500" : "text-[#1a1a1a]/70"
                    }`}
                  >
                    {card.title}
                  </p>
                  <h3
                    className={`text-xl sm:text-3xl font-bold ${
                      card.isDark ? "text-gray-900" : "text-[#1a1a1a]"
                    }`}
                  >
                    {card.value}
                  </h3>
                  <p
                    className={`text-[10px] sm:text-xs ${
                      card.isDark ? "text-gray-400" : "text-[#1a1a1a]/60"
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
                <div
                  className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${
                    card.isDark ? "text-[#D4AF37]" : "text-[#1a1a1a]"
                  }`}
                >
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Sessions - Next 3 Upcoming Sessions */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        {/* Header with Title and View All Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Live Classes
              </h2>
              <p className="text-sm text-gray-500">
                {upcomingSessions.length > 0
                  ? `Your next ${upcomingSessions.length} scheduled session${
                      upcomingSessions.length > 1 ? "s" : ""
                    }`
                  : "No upcoming classes scheduled"}
              </p>
            </div>
          </div>

          {/* View All Button - Top Right Corner */}
          <Link
            href="/student/online-classes"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#D4AF37] transition-all duration-200 text-sm font-medium group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {upcomingSessions.map((session) => {
              const formattedTime = session.time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const formattedDate = session.time.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-xl border border-gray-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group"
                >
                  {/* Day Label + Platform Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        session.dayLabel === "Today"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : session.dayLabel === "Tomorrow"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {session.dayLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {session.platform === "youtube" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-600">
                          <Video className="w-3 h-3" /> YouTube
                        </span>
                      )}
                      {session.platform === "zoom" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600">
                          <Monitor className="w-3 h-3" /> Zoom
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date & Time Display */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{formattedTime}</span>
                    </div>
                    {session.dayLabel !== "Today" &&
                      session.dayLabel !== "Tomorrow" && (
                        <span className="text-xs text-gray-400">
                          {formattedDate}
                        </span>
                      )}
                  </div>

                  {/* Session Content based on platform */}
                  {session.platform === "youtube" && (
                    <>
                      <div className="mb-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">
                          YouTube Link:
                        </p>
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 break-all font-medium"
                        >
                          {session.link.length > 50
                            ? session.link.substring(0, 50) + "..."
                            : session.link}
                        </a>
                      </div>
                      <div className="flex flex-col gap-2 pt-3">
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                          <Video className="w-4 h-4" />
                          Join YouTube Class
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  )}

                  {session.platform === "zoom" && (
                    <>
                      <div className="mb-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">
                            Zoom Link:
                          </p>
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 break-all font-medium"
                          >
                            {session.link.length > 50
                              ? session.link.substring(0, 50) + "..."
                              : session.link}
                          </a>
                        </div>
                        {session.zoomId && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">ID:</span>{" "}
                            {session.zoomId}
                          </p>
                        )}
                        {session.zoomPasscode && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Passcode:</span>{" "}
                            {session.zoomPasscode}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 pt-3">
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                          <Monitor className="w-4 h-4" />
                          Join Zoom Class
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State when no future classes
          <div className="text-center py-12">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Upcoming Classes
            </h3>
            <p className="text-gray-500 text-sm">
              There are no scheduled classes at the moment. Check back later for
              updates!
            </p>
            <Link href="/student/online-classes">
              <button className="mt-6 px-6 py-2 rounded-xl bg-[#D4AF37] text-[#1a1a1a] font-medium hover:bg-[#B5952F] transition-colors">
                Browse All Classes
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Access & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Classes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
            <Link
              href="/student/classes"
              className="text-[#D4AF37] hover:text-[#B5952F] text-sm font-medium transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {years.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {years.slice(0, 4).map((year: any) => (
                <Link
                  key={year.id}
                  href={`/student/classes/${year.id}`}
                  className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <GraduationCap className="w-5 h-5 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                      {year.year}
                    </h3>
                    <p className="text-xs text-gray-500">Active Enrollment</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No classes assigned yet
            </p>
          )}
        </div>

        {/* Profile Preview */}
        <div className="bg-[#1a1a1a] rounded-3xl p-8 shadow-xl relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="text-xl font-bold">My Profile</h2>
            </div>
            <div className="text-center py-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B5952F] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  {session.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {session.name}
              </h3>
              <p className="text-gray-400 mb-6 text-sm">{session.email}</p>
              <Link href="/student/profile">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                  View Full Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
