"use client";

import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useMemo } from "react";

interface AboutData {
  description?: string;
  features?: string[];
  quote?: string;
  quoteAuthor?: string;
  videoUrl?: string;
  videoPreviewImage?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  secondarySubtitle?: string;
}

interface FeaturesData {
  description?: string;
  studentLove?: {
    title?: string;
    description?: string;
    benefits?: string[];
    successRate?: {
      value?: string;
      suffix?: string;
      label?: string;
      description?: string;
    };
  };
}

interface TeacherData {
  name: string;
  title: string;
  image: string | null;
}

interface AboutPageClientProps {
  aboutData: AboutData | null;
  featuresData: FeaturesData | null;
  teacherData: TeacherData;
}

export function AboutPageClient({
  aboutData,
  featuresData,
  teacherData,
}: AboutPageClientProps) {
  const about = {
    description:
      aboutData?.description ||
      "දශකයකට වැඩි ගුරු අත්දැකීම් සහිතව, අපි සංකීර්ණ ආර්ථික න්‍යායන් පහසුවෙන් තේරුම් ගත හැකි, සැබෑ ලෝක සංකල්ප බවට බිඳ දමන අද්විතීය ක්‍රමවේදයක් වර්ධනය කර ඇත.",
    features: aboutData?.features || [
      "Comprehensive Theory Coverage",
      "Past Paper Analysis",
      "Real-world Economic Examples",
      "Personalized Attention",
    ],
    quote: aboutData?.quote || "",
    quoteAuthor: aboutData?.quoteAuthor || "",
    secondarySubtitle:
      aboutData?.secondarySubtitle || "සංකීර්ණතාවය සරල බවට පරිවර්තනය කිරීම",
    videoUrl: aboutData?.videoUrl || null,
    videoPreviewImage: aboutData?.videoPreviewImage || null,
  };

  const studentLove = {
    title: featuresData?.studentLove?.title || "Why Students Love Us",
    description:
      featuresData?.studentLove?.description ||
      "Our comprehensive learning platform is designed to give you every advantage in your A/L Economics journey.",
    benefits: featuresData?.studentLove?.benefits || [
      "Flexible learning schedule that fits your lifestyle",
      "Access to a vast library of educational resources",
      "Personalized learning paths based on your progress",
      "Direct communication with experienced teachers",
      "Competitive environment that motivates excellence",
    ],
    successRate: {
      value: featuresData?.studentLove?.successRate?.value || "80",
      suffix: featuresData?.studentLove?.successRate?.suffix || "%",
      label: featuresData?.studentLove?.successRate?.label || "Success Rate",
      description:
        featuresData?.studentLove?.successRate?.description ||
        "of our students achieve A or B grades",
    },
  };

  const teacherImageUrl = useMemo(() => {
    if (teacherData.image) {
      return `${teacherData.image}`;
    }
    return "https://placehold.co/600x800/1a1a1a/D4AF37/png?text=Teacher+Image";
  }, [teacherData.image]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navbar />

      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-sm font-medium uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Sri Lanka&apos;s Premier Economics Education Platform
            </span>
            <h1 className="text-5xl md:text-7xl leading-tight font-impact">
              <span>About Quality </span>
              <span className="font-fm-gemunu text-yellow-500 font-black text-6xl md:text-8xl">
                ම{" "}
              </span>
              <span className="text-yellow-500 font-black">Econ</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Empowering A/L students with comprehensive Economics education
              since 2015.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Quality <span className="text-yellow-500">Economics</span>{" "}
                  Education
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {about.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {about.features.map((feature: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="text-yellow-500 h-5 w-5 shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {about.quote && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-black rounded-xl border-l-4 border-yellow-500">
                    <p className="italic text-gray-300 text-lg">
                      {about.quote}
                    </p>
                    {about.quoteAuthor && (
                      <p className="mt-3 font-bold text-yellow-500">
                        {about.quoteAuthor}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden"
              >
                <div className="aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 relative group">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('${teacherImageUrl}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <p className="text-yellow-500 font-bold text-lg">
                        {teacherData.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {teacherData.title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-yellow-500/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-dashed border-gray-800 rounded-full animate-[spin_80s_linear_infinite_reverse] pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full" />
            <div className="relative bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
              <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Why Students{" "}
                    <span className="text-yellow-500">Love Us</span>
                  </h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    {studentLove.description}
                  </p>
                  <ul className="space-y-4">
                    {studentLove.benefits.map(
                      (benefit: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-yellow-500 group-hover:text-black transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-300 font-medium">
                            {benefit}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="relative overflow-hidden">
                  <div className="aspect-square max-w-md mx-auto relative">
                    <div className="absolute inset-0 border border-yellow-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-yellow-900/20">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                        <TrendingUp className="w-10 h-10 text-black" />
                      </div>
                      <div className="text-7xl font-bold text-white mb-2 tracking-tighter">
                        {studentLove.successRate.value}
                        <span className="text-yellow-500 text-4xl">
                          {studentLove.successRate.suffix}
                        </span>
                      </div>
                      <div className="text-xl text-gray-300 font-medium">
                        {studentLove.successRate.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {studentLove.successRate.description}
                      </div>
                    </div>

                    <div className="absolute top-10 right-0 animate-bounce">
                      <div className="bg-black/80 backdrop-blur-md border border-yellow-500/20 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-white">
                          Top Results
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-10 left-0 animate-bounce"
                      style={{ animationDelay: "500ms" }}
                    >
                      <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-xs font-bold text-yellow-500">
                          Best In Island
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "500+", label: "Students" },
              { value: "50+", label: "Island Ranks" },
              { value: "10+", label: "Years Exp." },
              {
                value: `${studentLove.successRate.value}${studentLove.successRate.suffix}`,
                label: "Success Rate",
              },
            ].map((stat, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 text-center hover:border-yellow-500/30 transition-all group"
              >
                <p className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 hover:border-yellow-500/30 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To make Economics education accessible, engaging, and effective
                for every Advanced Level student in Sri Lanka.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 hover:border-yellow-500/30 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To be the leading Economics education platform that produces the
                highest number of A-grade students and island rankers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
