'use client';

import { useState, useEffect } from 'react';
import {
    Terminal, Shield, Codepen, Activity, LogOut,
    Users, UserPlus, Database, Download, CheckCircle2,
    XCircle, RefreshCcw, Loader2, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { devLogout, getAllTeachers, devCreateTeacher, toggleTeacherStatus, getDevAnalytics } from '@/lib/actions/dev-auth';
import { useRouter } from 'next/navigation';

export default function DevDashboardClient() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Create teacher form
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '' });
    const [formMsg, setFormMsg] = useState({ type: '', msg: '' });
    const [analytics, setAnalytics] = useState<any>(null);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
            const data = await getAllTeachers();
            setTeachers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        setIsAnalyticsLoading(true);
        try {
            const data = await getDevAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchAnalytics();
    }, []);

    const handleLogout = async () => {
        await devLogout();
        router.push('/developer-back-door/login');
    };

    const handleCreateTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        setFormMsg({ type: '', msg: '' });

        const result = await devCreateTeacher(newTeacher.name, newTeacher.email);
        if (result.success) {
            setFormMsg({ type: 'success', msg: 'Teacher created successfully!' });
            setNewTeacher({ name: '', email: '' });
            fetchTeachers();
        } else {
            setFormMsg({ type: 'error', msg: result.error || 'Failed to create teacher' });
        }
        setIsActionLoading(false);
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setIsActionLoading(true);
        const result = await toggleTeacherStatus(id, currentStatus);
        if (result.success) {
            fetchTeachers();
        }
        setIsActionLoading(false);
    };

    const handleDownloadBackup = () => {
        window.open('/api/dev/backup', '_blank');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                            <Terminal className="text-[#050505] w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-serif tracking-tight">Developer Terminal</h1>
                            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">System Admin Panel</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 px-6 h-12 rounded-2xl w-fit"
                    >
                        <LogOut className="w-5 h-5" />
                        Secure Exit
                    </Button>
                </header>

                {/* Analytics Snapshot */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                    {[
                        { label: 'Total Students', value: analytics?.counts?.students, icon: Users, color: 'text-blue-500' },
                        { label: 'Active Teachers', value: analytics?.counts?.teachers, icon: Shield, color: 'text-[#D4AF37]' },
                        { label: 'Academic Years', value: analytics?.counts?.academicYears, icon: Database, color: 'text-purple-500' },
                        { label: 'Class Types', value: analytics?.counts?.classTypes, icon: Activity, color: 'text-green-500' },
                        { label: 'Total Topics', value: analytics?.counts?.topics, icon: Codepen, color: 'text-orange-500' },
                        { label: 'Topics Resources', value: analytics?.counts?.resources, icon: Download, color: 'text-cyan-500' },
                        { label: 'Free Resources', value: analytics?.counts?.freeResources, icon: RefreshCcw, color: 'text-emerald-500' },
                        { label: 'OL Subjects', value: analytics?.counts?.olSubjects, icon: Terminal, color: 'text-rose-500' },
                        { label: 'Institutes', value: analytics?.counts?.institutes, icon: Database, color: 'text-amber-500' },
                        { label: 'Timetables', value: analytics?.counts?.timetables, icon: Activity, color: 'text-indigo-500' },
                        { label: 'Hall of Fame', value: analytics?.counts?.hallOfFame, icon: Shield, color: 'text-yellow-500' },
                        { label: 'System Alerts', value: analytics?.counts?.notifications, icon: XCircle, color: 'text-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center justify-between mb-3">
                                <stat.icon className={`w-4 h-4 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                {isAnalyticsLoading && <Loader2 className="w-3 h-3 animate-spin text-gray-700" />}
                            </div>
                            <div className="text-xl font-bold font-mono tracking-tight">
                                {isAnalyticsLoading ? "..." : (stat.value || 0).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-12">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">Active Students:</span>
                        <span className="text-xl font-bold font-mono">{isAnalyticsLoading ? '...' : (analytics?.studentsStatus?.active || 0)}</span>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">Inactive Students:</span>
                        <span className="text-xl font-bold font-mono">{isAnalyticsLoading ? '...' : (analytics?.studentsStatus?.inactive || 0)}</span>
                    </div>
                    <Button
                        onClick={fetchAnalytics}
                        variant="ghost"
                        size="sm"
                        className="h-14 px-6 rounded-2xl border border-white/5 text-gray-500 hover:text-white hover:bg-white/5"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isAnalyticsLoading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Backup */}
                    <div className="space-y-8">
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Database className="w-5 h-5 text-[#D4AF37]" />
                                System Database
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                Generate a full SQL dump of the production database. This includes all tables, data, and schema definitions.
                            </p>
                            <Button
                                onClick={handleDownloadBackup}
                                className="w-full h-14 bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download SQL Backup
                            </Button>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                                Register Teacher
                            </h2>
                            <form onSubmit={handleCreateTeacher} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 text-xs uppercase tracking-widest pl-1">Full Name</Label>
                                    <Input
                                        value={newTeacher.name}
                                        onChange={e => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="John Doe"
                                        required
                                        className="bg-white/5 border-white/10 rounded-xl h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 text-xs uppercase tracking-widest pl-1">Email Address</Label>
                                    <Input
                                        type="email"
                                        value={newTeacher.email}
                                        onChange={e => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="teacher@econ.lk"
                                        required
                                        className="bg-white/5 border-white/10 rounded-xl h-12"
                                    />
                                </div>
                                {formMsg.msg && (
                                    <p className={`text-xs ${formMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {formMsg.msg}
                                    </p>
                                )}
                                <Button
                                    disabled={isActionLoading}
                                    type="submit"
                                    className="w-full h-12 bg-[#D4AF37] hover:bg-[#B5952F] text-[#050505] font-bold rounded-xl"
                                >
                                    {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Teacher Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 min-h-[600px]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <Users className="w-5 h-5 text-[#D4AF37]" />
                                    Account Management
                                </h2>
                                <Button
                                    onClick={fetchTeachers}
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-white"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
                                            <th className="pb-4 px-2">Teacher Name</th>
                                            <th className="pb-4 px-2">Email</th>
                                            <th className="pb-4 px-2">Status</th>
                                            <th className="pb-4 px-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-700" />
                                                </td>
                                            </tr>
                                        ) : teachers.map(teacher => (
                                            <tr key={teacher.id} className="group hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-2">
                                                    <span className="font-bold block">{teacher.name}</span>
                                                    <span className="text-[10px] text-gray-600 uppercase font-mono tracking-tighter">{teacher.id}</span>
                                                </td>
                                                <td className="py-4 px-2 text-gray-400 text-sm italic">{teacher.email}</td>
                                                <td className="py-4 px-2">
                                                    {teacher.isActive ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                                                            <XCircle className="w-3 h-3" />
                                                            Deactivated
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <Button
                                                        onClick={() => handleToggleStatus(teacher.id, teacher.isActive)}
                                                        disabled={isActionLoading}
                                                        variant="ghost"
                                                        className={`h-10 px-4 rounded-xl text-xs font-bold ${teacher.isActive ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'}`}
                                                    >
                                                        {teacher.isActive ? (
                                                            <><ToggleRight className="w-4 h-4 mr-2" /> Deactivate</>
                                                        ) : (
                                                            <><ToggleLeft className="w-4 h-4 mr-2" /> Activate</>
                                                        )}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
