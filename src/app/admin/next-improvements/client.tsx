'use client';

import { motion } from 'framer-motion';
import {
    Sparkles, TrendingUp, Users, MessageSquare, BarChart3, Bell,
    Calendar, Award, FileCheck, Video, Brain, Zap, Target, Globe,
    Shield, Smartphone, Clock, DollarSign, BookOpen, GraduationCap, Mail, Phone, Star, Rocket
} from 'lucide-react';

const upcomingFeatures = [
    {
        category: "Student Engagement",
        icon: Users,
        color: "from-blue-500 via-blue-600 to-cyan-600",
        bgGlow: "bg-blue-500/20",
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
        color: "from-purple-500 via-purple-600 to-pink-600",
        bgGlow: "bg-purple-500/20",
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
        color: "from-orange-500 via-orange-600 to-red-600",
        bgGlow: "bg-orange-500/20",
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
        color: "from-green-500 via-green-600 to-emerald-600",
        bgGlow: "bg-green-500/20",
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
        color: "from-indigo-500 via-indigo-600 to-blue-600",
        bgGlow: "bg-indigo-500/20",
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
        color: "from-yellow-500 via-yellow-600 to-orange-600",
        bgGlow: "bg-yellow-500/20",
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
    High: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/40",
    Medium: "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/40",
    Low: "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/40"
};

interface NextImprovementsClientProps {
    contact: {
        email: string;
        phone: string;
    };
}

export default function NextImprovementsClient({ contact }: NextImprovementsClientProps) {
    return (
        <div className="min-h-screen">
            <div className="space-y-10 pb-16">
                {/* Hero Header - Enhanced */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-16 shadow-2xl border border-[#D4AF37]/20">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="relative z-10 text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Premium Badge */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#F4C430]/20 border border-[#D4AF37]/30 mb-8 backdrop-blur-sm"
                            >
                                <Star className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                                <span className="text-[#D4AF37] text-base font-bold tracking-wide">PREMIUM FEATURES SHOWCASE</span>
                                <Star className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                            </motion.div>

                            {/* Main Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#D4AF37] to-white mb-6 leading-tight"
                            >
                                Next-Level Features
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
                            >
                                Transform your LMS into a <span className="text-[#D4AF37] font-bold">complete educational powerhouse</span> with these professionally developed features.
                            </motion.p>

                            {/* Premium Notice */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 backdrop-blur-sm"
                            >
                                <Rocket className="w-6 h-6 text-orange-400" />
                                <span className="text-orange-300 font-bold text-lg">Premium Add-Ons • Custom Pricing • Contact Developer</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Stats Overview - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Features", value: "18+", icon: Sparkles, gradient: "from-blue-500 to-cyan-500" },
                        { label: "Categories", value: "6", icon: Target, gradient: "from-purple-500 to-pink-500" },
                        { label: "High Impact", value: "12", icon: TrendingUp, gradient: "from-green-500 to-emerald-500" },
                        { label: "Coming Q1", value: "7", icon: Clock, gradient: "from-orange-500 to-red-500" }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 border border-gray-800 group-hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-5xl font-black text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{stat.value}</div>
                                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Features by Category - Enhanced */}
                <div className="space-y-10">
                    {upcomingFeatures.map((category, categoryIndex) => {
                        const CategoryIcon = category.icon;
                        return (
                            <motion.div
                                key={category.category}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + (categoryIndex * 0.15), duration: 0.6 }}
                                className="relative group"
                            >
                                {/* Glow Effect */}
                                <div className={`absolute -inset-1 ${category.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

                                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl border border-gray-800 group-hover:border-gray-700 overflow-hidden shadow-2xl transition-all duration-300">
                                    {/* Category Header - Enhanced */}
                                    <div className={`relative bg-gradient-to-r ${category.color} p-8 overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                                        <div className="relative flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30">
                                                <CategoryIcon className="w-10 h-10 text-white drop-shadow-lg" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-white mb-1 drop-shadow-lg">{category.category}</h2>
                                                <p className="text-white/90 text-base font-medium">{category.features.length} premium features available</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features Grid - Enhanced */}
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {category.features.map((feature, featureIndex) => {
                                            const FeatureIcon = feature.icon;
                                            return (
                                                <motion.div
                                                    key={feature.title}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.9 + (categoryIndex * 0.15) + (featureIndex * 0.08) }}
                                                    whileHover={{ scale: 1.03, y: -8 }}
                                                    className="group/card relative"
                                                >
                                                    {/* Card Glow */}
                                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${category.color} rounded-2xl opacity-0 group-hover/card:opacity-30 blur transition-opacity duration-300`} />

                                                    <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-2xl p-7 border border-gray-800 group-hover/card:border-[#D4AF37]/50 transition-all duration-300 h-full">
                                                        {/* Impact Badge */}
                                                        <div className="absolute top-5 right-5">
                                                            <span className={`text-xs px-3 py-1.5 rounded-full border font-bold ${impactColors[feature.impact as keyof typeof impactColors]}`}>
                                                                {feature.impact}
                                                            </span>
                                                        </div>

                                                        {/* Icon */}
                                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 shadow-lg group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-300`}>
                                                            <FeatureIcon className="w-7 h-7 text-white" />
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-[#D4AF37] transition-colors leading-tight">
                                                            {feature.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-sm text-gray-400 mb-5 leading-relaxed line-clamp-3">
                                                            {feature.description}
                                                        </p>

                                                        {/* Timeline */}
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{feature.timeline}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Section - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#F4C430] to-[#D4AF37] p-16 text-center shadow-2xl"
                >
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-20 h-20 text-[#1a1a1a] mx-auto mb-8 drop-shadow-lg" />
                        </motion.div>

                        <h2 className="text-5xl font-black text-[#1a1a1a] mb-6 leading-tight">
                            Ready to Unlock These Features?
                        </h2>

                        <p className="text-xl text-[#1a1a1a]/90 mb-3 font-semibold">
                            Each feature is professionally developed and customized for your LMS
                        </p>

                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#1a1a1a]/10 border-2 border-[#1a1a1a]/20 mb-10">
                            <DollarSign className="w-6 h-6 text-[#1a1a1a]" />
                            <span className="text-[#1a1a1a] font-bold text-lg">
                                Premium Add-Ons • Separate Pricing • Custom Implementation
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-6">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`mailto:${contact.email}`}
                                className="group px-10 py-5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 border-2 border-[#1a1a1a]"
                            >
                                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Email Developer
                            </motion.a>

                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://wa.me/${contact.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group px-10 py-5 bg-white text-[#1a1a1a] rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 border-2 border-[#1a1a1a]"
                            >
                                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                WhatsApp Developer
                            </motion.a>
                        </div>

                        <p className="text-sm text-[#1a1a1a]/70 font-medium">
                            💡 Features are implemented one-by-one based on your priorities and budget
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
