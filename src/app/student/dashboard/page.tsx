import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentDashboardStats, getStudentYears } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, BookOpen, FileText, TrendingUp, Sparkles, ArrowRight, User } from 'lucide-react';

export default async function StudentDashboard() {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const [statsResult, yearsResult] = await Promise.all([
        getStudentDashboardStats(session.userId),
        getStudentYears(session.userId),
    ]);

    const stats = statsResult.success ? statsResult.data : null;
    const years = yearsResult.success ? yearsResult.data : [];

    if (!stats) {
        return <div className="p-8">Error loading dashboard data</div>;
    }

    const statCards = [
        {
            title: 'Academic Years',
            value: stats.assignedYears,
            icon: GraduationCap,
            description: 'Enrolled batches',
            gradient: 'from-[#D4AF37] to-[#B5952F]',
            link: '/student/classes'
        },
        {
            title: 'Total Classes',
            value: stats.assignedClasses,
            icon: BookOpen,
            description: 'Class types',
            gradient: 'from-[#1a1a1a] to-[#2a2a2a]',
            isDark: true,
            link: '/student/classes'
        },
        {
            title: 'Topics',
            value: stats.totalTopics,
            icon: FileText,
            description: 'Learning topics',
            gradient: 'from-[#1a1a1a] to-[#2a2a2a]',
            isDark: true,
            link: '/student/classes'
        },
        {
            title: 'Resources',
            value: stats.totalResources,
            icon: TrendingUp,
            description: 'Study materials',
            gradient: 'from-[#1a1a1a] to-[#2a2a2a]',
            isDark: true,
            link: '/student/resources'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-20 -mb-20" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Welcome Back</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Student Dashboard
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl">
                        Track your progress and access your learning materials.
                        You have access to <span className="text-[#D4AF37] font-bold">{stats.totalResources} resources</span> across your enrolled classes.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Link key={card.title} href={card.link}>
                        <div className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer ${card.isDark
                            ? 'bg-white border border-gray-100 hover:border-[#D4AF37]/30'
                            : 'bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-[#1a1a1a]'
                            }`}>

                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-50 ${card.isDark ? 'bg-[#D4AF37]/10' : 'bg-white/20'
                                }`} />

                            <div className="relative z-20">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${card.isDark
                                    ? 'bg-[#1a1a1a] text-[#D4AF37]'
                                    : 'bg-[#1a1a1a]/10 text-[#1a1a1a]'
                                    }`}>
                                    <card.icon className="w-6 h-6" />
                                </div>

                                <div className="space-y-1">
                                    <p className={`text-sm font-medium ${card.isDark ? 'text-gray-500' : 'text-[#1a1a1a]/70'
                                        }`}>
                                        {card.title}
                                    </p>
                                    <h3 className={`text-3xl font-bold ${card.isDark ? 'text-gray-900' : 'text-[#1a1a1a]'
                                        }`}>
                                        {card.value}
                                    </h3>
                                    <p className={`text-xs ${card.isDark ? 'text-gray-400' : 'text-[#1a1a1a]/60'
                                        }`}>
                                        {card.description}
                                    </p>
                                </div>

                                <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${card.isDark ? 'text-[#D4AF37]' : 'text-[#1a1a1a]'
                                    }`}>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Access & Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Classes */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
                        <Link href="/student/classes" className="text-[#D4AF37] hover:text-[#B5952F] text-sm font-medium transition-colors flex items-center gap-1">
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
                                        <h3 className="font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">{year.year}</h3>
                                        <p className="text-xs text-gray-500">Active Enrollment</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No classes assigned yet</p>
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
                                <span className="text-3xl font-bold text-[#1a1a1a]">{session.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{session.name}</h3>
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
