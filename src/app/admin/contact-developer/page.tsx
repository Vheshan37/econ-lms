'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Send,
    Sparkles,
    AlertCircle,
    MessageSquare,
    Wrench,
    CheckCircle2,
    Loader2,
    Bug
} from 'lucide-react';
import { contactDeveloper } from '@/lib/actions/support';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactDeveloperPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
        type: null,
        message: ''
    });
    const [formData, setFormData] = useState({
        requestType: 'improvement',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const result = await contactDeveloper(formData);
            if (result.success) {
                setStatus({
                    type: 'success',
                    message: 'Your request has been sent successfully! The developer will review it soon.'
                });
                setFormData({ requestType: 'improvement', subject: '', message: '' });
            } else {
                setStatus({
                    type: 'error',
                    message: result.error || 'Failed to send message. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const requestTypes = [
        { id: 'improvement', label: 'Feature Improvement', icon: Sparkles, color: 'text-[#fdf021]' },
        { id: 'issue', label: 'Technical Issue', icon: Bug, color: 'text-red-500' },
        { id: 'request', label: 'New Request', icon: MessageSquare, color: 'text-blue-500' },
        { id: 'update', label: 'Content Update', icon: Wrench, color: 'text-green-500' },
        { id: 'other', label: 'Other', icon: Mail, color: 'text-purple-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-10 shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>Developer Support</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Contact Developer</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Have a suggestion or found a bug? Send your requests directly to the developer team.
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                            Submission Guide
                        </h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <p>• Be specific with your subject line.</p>
                            <p>• For issues, describe the steps to reproduce.</p>
                            <p>• For improvements, explain how it helps you.</p>
                            <p>• Your email address will be included for replies.</p>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#D4AF37] to-[#B5952F] rounded-3xl p-6 text-[#1a1a1a]">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Direct Channel
                        </h3>
                        <p className="text-sm opacity-80 leading-relaxed">
                            This form sends your message directly to the developer's inbox for faster review and implementation.
                        </p>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        {status.type && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="text-sm font-medium">{status.message}</span>
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 block ml-1">Request Category</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {requestTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, requestType: type.id }))}
                                        className={`transition-all duration-200 p-4 rounded-2xl border flex items-center gap-4 text-left group ${formData.requestType === type.id
                                                ? 'bg-[#1a1a1a] border-[#1a1a1a] text-[#D4AF37] shadow-lg shadow-black/10'
                                                : 'bg-white border-gray-100 text-gray-600 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg bg-gray-50 transition-colors ${formData.requestType === type.id ? 'bg-white/10' : ''
                                            }`}>
                                            <type.icon className={`w-5 h-5 ${formData.requestType === type.id ? 'text-[#D4AF37]' : type.color
                                                }`} />
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block ml-1">Subject</label>
                            <Input
                                value={formData.subject}
                                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Briefly describe your request..."
                                required
                                className="h-12 border-gray-100 focus:border-[#D4AF37] focus:ring-[#D4AF37] rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block ml-1">Detailed Message</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                required
                                placeholder="Explain your request or issue in detail..."
                                className="w-full min-h-[150px] p-4 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all resize-none text-gray-600 text-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1a1a1a] hover:bg-black text-[#D4AF37] font-bold rounded-xl shadow-xl shadow-[#1a1a1a]/10 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Ticket
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
