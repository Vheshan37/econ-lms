import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentDashboardStats, getStudentYears } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, BookOpen, FileText, TrendingUp } from 'lucide-react';

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
            gradient: 'from-[#D4AF37] to-[#B5952F]',
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
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <GraduationCap className="w-8 h-8 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Welcome back, {session.name}!</h1>
                            <p className="text-gray-400 mt-1">
                                You're enrolled in {stats.assignedYears} {stats.assignedYears === 1 ? 'year' : 'years'} with {stats.totalResources} resources
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Link key={card.title} href={card.link}>
                        <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${card.isDark ? 'border border-gray-800' : ''}`}>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`h-12 w-12 rounded-xl ${card.isDark ? 'bg-white/5' : 'bg-white/10'} flex items-center justify-center backdrop-blur-sm`}>
                                        <card.icon className={`w-6 h-6 ${card.isDark ? 'text-[#D4AF37]' : 'text-white'}`} />
                                    </div>
                                </div>
                                <div className={`text-3xl font-bold mb-1 ${card.isDark ? 'text-white' : 'text-white'}`}>
                                    {card.value}
                                </div>
                                <div className={`text-sm font-medium ${card.isDark ? 'text-gray-400' : 'text-white/80'}`}>
                                    {card.title}
                                </div>
                                <div className={`text-xs mt-1 ${card.isDark ? 'text-gray-500' : 'text-white/60'}`}>
                                    {card.description}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Classes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
                        <Link href="/student/classes" className="text-[#D4AF37] hover:text-[#B5952F] text-sm font-medium transition-colors">
                            View All →
                        </Link>
                    </div>

                    {years.length > 0 ? (
                        <div className="space-y-3">
                            {years.slice(0, 3).map((year: any) => (
                                <Link
                                    key={year.id}
                                    href={`/student/classes/${year.id}`}
                                    className="block p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm">
                                                <GraduationCap className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-medium text-gray-900">{year.year}</span>
                                        </div>
                                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No classes assigned yet</p>
                    )}
                </div>

                {/* Resources by Type */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Resources Overview</h2>
                        <Link href="/student/resources" className="text-[#D4AF37] hover:text-[#B5952F] text-sm font-medium transition-colors">
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-center border border-red-200">
                            <div className="text-2xl font-bold text-red-600 mb-1">{stats.resourcesByType.videos}</div>
                            <div className="text-xs text-red-700">Videos</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.resourcesByType.pdfs}</div>
                            <div className="text-xs text-orange-700">PDFs</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center border border-green-200">
                            <div className="text-2xl font-bold text-green-600 mb-1">{stats.resourcesByType.quizzes}</div>
                            <div className="text-xs text-green-700">Quizzes</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.resourcesByType.pastPapers}</div>
                            <div className="text-xs text-purple-700">Past Papers</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
