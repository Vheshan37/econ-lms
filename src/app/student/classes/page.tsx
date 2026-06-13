import { getCurrentUser } from "@/lib/actions/auth";
import { getStudentYears } from "@/lib/actions/studentData";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Calendar, Layers, BookOpen } from "lucide-react";

export default async function StudentClassesPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== "student") {
    redirect("/login");
  }

  const result = await getStudentYears(session.userId);
  const years = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <BookOpen className="w-10 h-10 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Classes</h1>
              <p className="text-gray-400 text-lg">
                Access your academic years and learning materials
                <span className="ml-3 text-[#D4AF37] font-medium">
                  {years.length} {years.length === 1 ? "Year" : "Years"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {years.length > 0 ? (
          years.map((year: any) => (
            <Link
              key={year.id}
              href={`/student/classes/${year.id}`}
              className="relative group cursor-pointer overflow-hidden rounded-3xl transition-all bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] hover:shadow-2xl hover:shadow-[#D4AF37]/20"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/30">
                  <GraduationCap className="w-8 h-8 text-[#1a1a1a]" />
                </div>

                {/* Year */}
                <h3 className="text-4xl font-bold mb-2 text-white">
                  {year.year}
                </h3>

                {/* Description */}
                {year.description && (
                  <p className="text-sm mb-6 line-clamp-2 text-gray-400">
                    {year.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm text-gray-300">View Classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No classes assigned yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Please contact your teacher to get assigned to classes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
