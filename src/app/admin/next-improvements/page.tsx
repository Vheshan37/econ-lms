'use client';

import { motion } from 'framer-motion';
import {
    Sparkles, TrendingUp, Users, MessageSquare, BarChart3, Bell,
    Calendar, Award, FileCheck, Video, Brain, Zap, Target, Globe,
    Shield, Smartphone, Clock, DollarSign, BookOpen, GraduationCap
} from 'lucide-react';

const upcomingFeatures = [
    {
        category: "Student Engagement",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        features: [
            {
                title: "Live Classes Integration",
                description: "Conduct real-time video classes with screen sharing, whiteboard, and recording capabilities",
                icon: Video,
                impact: "High",
                timeline: "Q1 2025"
            },
            {
                title: "Discussion Forums",
                description: "Enable students to ask questions, discuss topics, and collaborate with peers",
                icon: MessageSquare,
                impact: "High",
                timeline: "Q1 2025"
            },
            {
                title: "Gamification System",
                description: "Reward students with points, badges, and leaderboards to boost motivation",
                icon: Award,
                impact: "Medium",
                timeline: "Q2 2025"
            }
        ]
    },
    {
        category: "Assessment & Analytics",
        icon: BarChart3,
        color: "from-purple-500 to-pink-500",
        features: [
            {
                title: "Advanced Analytics Dashboard",
                description: "Track student performance, engagement metrics, and learning patterns with AI insights",
                icon: TrendingUp,
                impact: "High",
                timeline: "Q1 2025"
            },
            {
                title: "Auto-Grading System",
                description: "Automatically grade quizzes and assignments with detailed feedback generation",
                icon: FileCheck,
                impact: "High",
                timeline: "Q2 2025"
            },
            {
                title: "Progress Reports",
                description: "Generate comprehensive PDF reports for students and parents with performance insights",
                icon: Target,
                impact: "Medium",
                timeline: "Q2 2025"
            }
        ]
    },
    {
        category: "Communication & Notifications",
        icon: Bell,
        color: "from-orange-500 to-red-500",
        features: [
            {
                title: "Smart Notifications",
                description: "Push notifications for assignments, announcements, and upcoming classes",
                icon: Bell,
                impact: "High",
                timeline: "Q1 2025"
            },
            {
                title: "WhatsApp Integration",
                description: "Send automated reminders and updates directly to students' WhatsApp",
                icon: MessageSquare,
                impact: "High",
                timeline: "Q2 2025"
            },
            {
                title: "Email Campaigns",
                description: "Create and schedule email campaigns for announcements and marketing",
                icon: Globe,
                impact: "Medium",
                timeline: "Q2 2025"
            }
        ]
    },
    {
        category: "Content & Learning",
        icon: BookOpen,
        color: "from-green-500 to-emerald-500",
        features: [
            {
                title: "AI Content Generator",
                description: "Generate quizzes, flashcards, and study materials using AI from your lessons",
                icon: Brain,
                impact: "High",
                timeline: "Q2 2025"
            },
            {
                title: "Interactive Simulations",
                description: "Create interactive economic simulations and case studies for better understanding",
                icon: Zap,
                impact: "Medium",
                timeline: "Q3 2025"
            },
            {
                title: "Mobile App",
                description: "Native iOS and Android apps for students to learn on-the-go",
                icon: Smartphone,
                impact: "High",
                timeline: "Q3 2025"
            }
        ]
    },
    {
        category: "Administration & Management",
        icon: Shield,
        color: "from-indigo-500 to-blue-500",
        features: [
            {
                title: "Attendance Tracking",
                description: "Mark and track student attendance with automated reports and alerts",
                icon: Clock,
                impact: "High",
                timeline: "Q1 2025"
            },
            {
                title: "Payment Integration",
                description: "Accept online payments for courses with automated invoicing and receipts",
                icon: DollarSign,
                impact: "High",
                timeline: "Q2 2025"
            },
            {
                title: "Calendar & Scheduling",
                description: "Manage class schedules, exams, and events with calendar integration",
                icon: Calendar,
                impact: "Medium",
                timeline: "Q2 2025"
            }
        ]
    },
    {
        category: "Advanced Features",
        icon: Sparkles,
        color: "from-yellow-500 to-orange-500",
        features: [
            {
                title: "AI Teaching Assistant",
                description: "24/7 AI chatbot to answer student questions and provide instant support",
                icon: Brain,
                impact: "High",
                timeline: "Q3 2025"
            },
            {
                title: "Certificate Generation",
                description: "Auto-generate and send completion certificates with custom branding",
                icon: GraduationCap,
                impact: "Medium",
                timeline: "Q2 2025"
            },
            {
                title: "Multi-Language Support",
                description: "Support for Sinhala, Tamil, and English interfaces for wider reach",
                icon: Globe,
                impact: "Medium",
                timeline: "Q3 2025"
            }
        ]
    }
];

const impactColors = {
    High: "bg-red-500/10 text-red-600 border-red-500/20",
    Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-600 border-green-500/20"
};

export default function NextImprovementsPage() {
    return (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
                            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-[#D4AF37] text-sm font-medium">Coming Soon</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            Next-Level Features
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Transform your LMS into a complete educational powerhouse with these upcoming features.
                            <span className="text-[#D4AF37]"> Stay ahead of the competition.</span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Features", value: "18+", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
                    { label: "Categories", value: "6", icon: Target, color: "from-purple-500 to-pink-500" },
                    { label: "High Impact", value: "12", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
                    { label: "Coming Q1", value: "7", icon: Clock, color: "from-orange-500 to-red-500" }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Features by Category */}
            <div className="space-y-8">
                {upcomingFeatures.map((category, categoryIndex) => {
                    const CategoryIcon = category.icon;
                    return (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            {/* Category Header */}
                            <div className={`bg-linear-to-r ${category.color} p-6`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <CategoryIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                                        <p className="text-white/80 text-sm">{category.features.length} upcoming features</p>
                                    </div>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {category.features.map((feature, featureIndex) => {
                                    const FeatureIcon = feature.icon;
                                    return (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: (categoryIndex * 0.1) + (featureIndex * 0.05) }}
                                            className="group relative bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#D4AF37]/30"
                                        >
                                            <div className="absolute top-4 right-4">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${impactColors[feature.impact as keyof typeof impactColors]}`}>
                                                    {feature.impact} Impact
                                                </span>
                                            </div>

                                            <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <FeatureIcon className="w-6 h-6 text-white" />
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors">
                                                {feature.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                {feature.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{feature.timeline}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#D4AF37] via-[#F4C430] to-[#D4AF37] p-12 text-center"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <Sparkles className="w-16 h-16 text-[#1a1a1a] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
                        Ready to Unlock These Features?
                    </h2>
                    <p className="text-lg text-[#1a1a1a]/80 mb-8">
                        Contact us to discuss implementing these features one by one.
                        Each feature is designed to increase student engagement, improve learning outcomes, and grow your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:contact@example.com"
                            className="px-8 py-4 bg-[#1a1a1a] text-white rounded-xl font-semibold hover:bg-black transition-colors shadow-lg hover:shadow-xl"
                        >
                            Request a Feature
                        </a>
                        <a
                            href="https://wa.me/719892932"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white text-[#1a1a1a] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-[#1a1a1a]"
                        >
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
