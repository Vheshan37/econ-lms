import { redirect } from 'next/navigation';
import { getDevSession, devLogout } from '@/lib/actions/dev-auth';
import { Terminal, Shield, Codepen, Activity, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DevDashboardPage() {
    const session = await getDevSession();

    if (!session) {
        redirect('/developer-back-door/login');
    }

    const logoutAction = async () => {
        'use server';
        await devLogout();
        redirect('/developer-back-door/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center">
                            <Terminal className="text-[#050505] w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-serif tracking-tight">Developer Terminal</h1>
                            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">System Admin Panel</p>
                        </div>
                    </div>

                    <form action={logoutAction}>
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 px-6 h-12 rounded-2xl">
                            <LogOut className="w-5 h-5" />
                            Secure Exit
                        </Button>
                    </form>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatusCard icon={Shield} title="Security Level" value="Level 4 (Admin)" color="text-green-500" />
                    <StatusCard icon={Codepen} title="Node Version" value="v18.20.4" color="text-blue-500" />
                    <StatusCard icon={Activity} title="System Load" value="Optimal" color="text-yellow-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-[#D4AF37]" />
                            System Event Log
                        </h2>
                        <div className="space-y-4 font-mono text-sm">
                            <LogEntry time="2025-12-31 10:43" message="Terminal session established successfully" type="success" />
                            <LogEntry time="2025-12-31 09:12" message="Database connection heartbeat OK" type="info" />
                            <LogEntry time="2025-12-31 08:00" message="Daily backup cycle completed" type="info" />
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6">Quick Diagnostics</h2>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <span className="text-gray-400 text-sm">Database</span>
                                <span className="text-green-500 font-bold text-xs uppercase">Online</span>
                            </li>
                            <li className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <span className="text-gray-400 text-sm">Mail Server</span>
                                <span className="text-green-500 font-bold text-xs uppercase">Online</span>
                            </li>
                            <li className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <span className="text-gray-400 text-sm">Storage Layer</span>
                                <span className="text-green-500 font-bold text-xs uppercase">Optimal</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ icon: Icon, title, value, color }: { icon: any, title: string, value: string, color: string }) {
    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-[#D4AF37]/30 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <h3 className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">{title}</h3>
                    <p className="text-lg font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

function LogEntry({ time, message, type }: { time: string, message: string, type: 'success' | 'info' | 'error' }) {
    const typeColor = {
        success: 'text-green-500',
        info: 'text-blue-500',
        error: 'text-red-500'
    }[type];

    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-gray-600 shrink-0">[{time}]</span>
            <span className={`font-bold shrink-0 ${typeColor}`}>{type.toUpperCase()}:</span>
            <span className="text-gray-400">{message}</span>
        </div>
    );
}
