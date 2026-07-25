import { getCurrentUser } from "@/lib/actions/auth";
import { getStudentClassTypes } from "@/lib/actions/studentData";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, RotateCcw, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_TYPES = {
  Theory: {
    icon: BookOpen,
    description: "Core concepts and fundamental lessons",
  },
  Revision: {
    icon: RotateCcw,
    description: "Review materials and practice sessions",
  },
  "Paper Class": {
    icon: FileEdit,
    description: "Past papers and exam preparation",
  },
};

const CUSTOM_TYPE_CONFIG = {
  icon: Layers,
  description: "Specialized course module",
};

export default async function StudentClassTypesPage({
  params,
}: {
  params: Promise<{ yearId: string }>;
}) {
  const session = await getCurrentUser();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const { yearId } = await params;
  const result = await getStudentClassTypes(session.userId, yearId);
  const classTypes = result.success && result.data ? result.data : [];
  const yearName =
    classTypes.length > 0 ? classTypes[0].year.year : "Academic Year";

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      <div className="mx-auto space-y-8 w-full max-w-full">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-4 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/student/classes">
                <Button
                  variant="ghost"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <div>

                <h1 className="text-xl sm:text-4xl font-bold text-white">{yearName}</h1>
                <p className="text-gray-400 mt-1 text-xs sm:text-sm max-w-xl">
                  Select a class type to view topics and resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {classTypes.length > 0 ? (
            classTypes.map((classType: any) => {
              const isDefault = Object.keys(DEFAULT_TYPES).includes(
                classType.name,
              );
              const config = isDefault
                ? (DEFAULT_TYPES as any)[classType.name]
                : CUSTOM_TYPE_CONFIG;
              const Icon = config.icon;

              return (
                <Link
                  key={classType.id}
                  href={`/student/classes/${yearId}/${classType.id}`}
                  className="relative group overflow-hidden rounded-3xl transition-all bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] cursor-pointer hover:shadow-2xl hover:shadow-[#D4AF37]/20"
                >
                  {/* Decorative glow effect */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10 p-5 sm:p-8">
                    {/* Icon Badge */}
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/30">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#1a1a1a]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2 text-white">
                      {classType.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm mb-6 text-gray-400">
                      {config.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-sm text-gray-300">
                          {classType._count.topics} topics
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No class types found</p>
              <p className="text-gray-400 text-sm mt-2">
                This academic year doesn&apos;t have any class types yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
