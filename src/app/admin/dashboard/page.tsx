"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FormInput,
  Projector,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Trophy,
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import Link from "next/link";

interface DashboardStats {
  studentCount: number;
  resourceCount: number;
  yearCount: number;
  instituteCount: number;
  hallOfFameCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.studentCount || 0,
      icon: Users,
      description: "Active learners",
      gradient: "from-[#D4AF37] to-[#B5952F]",
      link: "/admin/students",
    },
    {
      title: "Resources",
      value: stats?.resourceCount || 0,
      icon: BookOpen,
      description: "Learning materials",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/admin/resources",
    },
    {
      title: "Active Years",
      value: stats?.yearCount || 0,
      icon: GraduationCap,
      description: "Academic batches",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/admin/classes",
    },
    {
      title: "Institutes",
      value: stats?.instituteCount || 0,
      icon: Building2,
      description: "Teaching locations",
      gradient: "from-[#1a1a1a] to-[#2a2a2a]",
      isDark: true,
      link: "/admin/timetable",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2 sm:mb-4">
            <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Welcome Back</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
            Teacher Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl max-w-2xl">
            Manage your students, classes, and resources from one central hub.
            You have{" "}
            <span className="text-[#D4AF37] font-bold">
              {stats?.studentCount} students
            </span>{" "}
            learning with you today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={item}
            className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer ${
              stat.isDark
                ? "bg-white border border-gray-100 hover:border-[#D4AF37]/30"
                : "bg-linear-to-br from-[#D4AF37] to-[#B5952F] text-[#1a1a1a]"
            }`}
          >
            <Link href={stat.link} className="absolute inset-0 z-10" />

            {/* Background decoration */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-50 ${
                stat.isDark ? "bg-[#D4AF37]/10" : "bg-white/20"
              }`}
            />

            <div className="relative z-20">
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                  stat.isDark
                    ? "bg-[#1a1a1a] text-[#D4AF37]"
                    : "bg-[#1a1a1a]/10 text-[#1a1a1a]"
                }`}
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    stat.isDark ? "text-gray-500" : "text-[#1a1a1a]/70"
                  }`}
                >
                  {stat.title}
                </p>
                <h3
                  className={`text-xl sm:text-3xl font-bold ${
                    stat.isDark ? "text-gray-900" : "text-[#1a1a1a]"
                  }`}
                >
                  {stat.value}
                </h3>
                <p
                  className={`text-[10px] sm:text-xs ${
                    stat.isDark ? "text-gray-400" : "text-[#1a1a1a]/60"
                  }`}
                >
                  {stat.description}
                </p>
              </div>

              <div
                className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${
                  stat.isDark ? "text-[#D4AF37]" : "text-[#1a1a1a]"
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/students">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Add Student</h3>
                  <p className="text-xs text-gray-500">Register new learner</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/classes">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Create Class</h3>
                  <p className="text-xs text-gray-500">New academic year</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/timetable">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Timetable</h3>
                  <p className="text-xs text-gray-500">
                    Manage class schedules
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/admin/hall-of-fame">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Add Achiever</h3>
                  <p className="text-xs text-gray-500">Hall of fame</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/online-class">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-50 text-cyan-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <Projector className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Online Class</h3>
                  <p className="text-xs text-gray-500">Live Sessions</p>
                </div>
              </div>
            </Link>
            <Link href="/admin/content">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-50 text-red-600 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#1a1a1a] transition-colors">
                  <FormInput className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Site Content</h3>
                  <p className="text-xs text-gray-500">Update Contents</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Hall of Fame Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a1a] rounded-3xl p-8 shadow-xl relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-[#D4AF37]" />
              <h2 className="text-xl font-bold">Hall of Fame</h2>
            </div>

            <div className="text-center py-8">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">
                {stats?.hallOfFameCount || 0}
              </div>
              <p className="text-gray-400 mb-6">Top Achievers Showcased</p>

              <Link href="/admin/hall-of-fame">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                  View All Achievers
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
