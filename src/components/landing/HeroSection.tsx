"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { EnrollmentModal } from "./EnrollmentModal";

interface HeroSectionProps {
  content?: any;
  timestamp?: number;
}

export function HeroSection({ content, timestamp = 0 }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default values if content is missing
  const defaults = {
    description:
      "දිවයිනේ ප්‍රථම ශ්‍රේණිගත කරුවන් බිහිකරන ලද ඔප්පු වූ ඉතිහාසයක් ඇති වඩාත්ම සවිස්තරාත්මක ආර්ථික විද්‍යා අධ්‍යාපනය අත්විඳින්න. විශිෂ්ටත්වයේ සම්මේලනයට එක්වන්න.",
    studentCount: "5000+",
    rankCount: "100+",
    expCount: "10+",
    teacherName: "Krishan Kashthuriarachchi",
    teacherTitle: "B.Sc. Economics (Sp.) University of Colombo",
    teacherImage: null,
  };

  const data = { ...defaults, ...content };

  // Cache busting for teacher image - use prop timestamp to ensure SSR match
  // Fallback to empty string if timestamp is 0 (or allow browser caching if no update)
  // Actually, if we want cache busting, page.tsx WILL pass a timestamp.
  const teacherImageUrl = data.teacherImage
    ? `${data.teacherImage}${timestamp ? `?t=${timestamp}` : ""}`
    : null;

  return (
    <section className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex items-center">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf021]/10 border border-[#fdf021]/20 rounded-full text-[#fdf021] text-sm font-medium tracking-wider uppercase">
            <span className="w-2 h-2 bg-[#fdf021] rounded-full animate-pulse" />
            #1 Economics Class in Sri Lanka
          </div>

          <h1 className="text-5xl md:text-7xl leading-tight font-impact">
            <span>Quality </span>
            <span className="font-fm-gemunu text-[#fdf021] font-black text-6xl md:text-8xl">
              ම{" "}
            </span>
            <span className="font-black">Econ</span>
            <br />
            <span className="text-3xl md:text-4xl font-normal text-gray-300 block mt-4">
              For A/L Students
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="cursor-pointer h-14 px-8 text-lg bg-[#fdf021] hover:bg-[#f0e51f] text-black font-bold rounded-full w-full sm:w-auto"
              >
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer h-14 px-8 text-lg border-[#fdf021] bg-transparent text-[#fdf021] hover:border-[#fdf021] hover:bg-[#fdf021]/10 hover:text-[#fdf021] rounded-full w-full sm:w-auto transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Register
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="pb-5 m-0">
            <span className="text-gray-400">Contact Us: 077 11 22 334</span>
          </div>

          <div className="items-center gap-8 pt-8 border-t border-gray-800 hidden lg:flex">
            <div>
              <p className="text-3xl font-bold text-white">
                {data.studentCount}
              </p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Students
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{data.rankCount}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Island Ranks
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{data.expCount}</p>
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                Years Exp.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 w-full max-w-md mx-auto">
            {/* Teacher Image */}
            <div className="aspect-3/4 rounded-3xl overflow-hidden bg-transparent relative group">
              {teacherImageUrl ? (
                <div
                  className={`absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700`}
                  style={{ backgroundImage: `url('${teacherImageUrl}')` }}
                />
              ) : (
                <div className="absolute inset-0 bg-[url('https://static.vecteezy.com/system/resources/thumbnails/026/136/046/small/business-man-illustration-ai-generative-png.png')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <p className="text-[#fdf021] font-bold text-lg">
                    {data.teacherName}
                  </p>
                  <p className="text-gray-300 text-sm">{data.teacherTitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#fdf021]/10 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-dashed border-gray-800 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
        </motion.div>

        <div className="flex items-center justify-center gap-8 pt-8 border-t border-gray-800 lg:hidden">
          <div>
            <p className="text-3xl font-bold text-white">{data.studentCount}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Students
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{data.rankCount}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Island Ranks
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{data.expCount}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              Years Exp.
            </p>
          </div>
        </div>
      </div>

      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={"selectedBatch"}
        whatsappNumber={"whatsappNumber"}
      />
    </section>
  );
}
