"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, Brain, Download, Sparkles, GraduationCap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';

interface OLStudentsClientProps {
    isHallOfFameEnabled: boolean;
}

export default function OLStudentsClient({ isHallOfFameEnabled }: OLStudentsClientProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const resources = [
        {
            title: 'Intro to Economics',
            type: 'Short Note',
            icon: FileText,
            color: 'blue',
            description: 'Basic concepts for beginners'
        },
        {
            title: 'O/L Econ Past Papers',
            type: 'PDF',
            icon: Download,
            color: 'yellow',
            description: 'Last 5 years with answers'
        },
        {
            title: 'Market Mechanisms',
            type: 'Quiz',
            icon: Brain,
            color: 'purple',
            description: 'Test your knowledge'
        },
        {
            title: 'Demand & Supply',
            type: 'Short Note',
            icon: FileText,
            color: 'green',
            description: 'Visual summary chart'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500 selection:text-black">
            {/* Header / Navbar */}
            <div className="absolute top-0 left-0 right-0 z-50">
                <Navbar isHallOfFameEnabled={isHallOfFameEnabled} />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Calling all O/L Students</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
                            Start Your <span className="text-yellow-500">A/L Econ</span><br />
                            Journey Today
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Don't wait until after O/Ls. Build your foundation now with our exclusive free resources designed for smart achievers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            <Button size="lg" className="h-16 px-10 text-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full shadow-lg shadow-yellow-500/20">
                                Start Learning Free
                                <ArrowRight className="ml-2 h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Start Early? */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: Trophy,
                                title: "Competitive Edge",
                                desc: "Stay ahead of 80% of students who start late. Secure your 'A' grade foundation."
                            },
                            {
                                icon: Brain,
                                title: "Master Concepts",
                                desc: "Absorb complex economic theories at your own pace without the pressure of A/L exams."
                            },
                            {
                                icon: GraduationCap,
                                title: "University Dream",
                                desc: "Early preparation is the secret weapon of every Island Ranker we've produced."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="py-24 bg-[#0a0a0a] relative">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-yellow-500/20 to-transparent" />

                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold">Free <span className="text-yellow-500">Resources</span></h2>
                        <p className="text-gray-400">Curated materials to kickstart your economics knowledge</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 rounded-2xl bg-[#111] border border-gray-800 hover:border-yellow-500/50 transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <resource.icon className="w-24 h-24 text-white" />
                                </div>

                                <div className="relative z-10 space-y-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                        resource.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
                                            resource.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                                                'bg-green-500/10 text-green-500'
                                        }`}>
                                        <resource.icon className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{resource.type}</div>
                                        <h3 className="text-lg font-bold group-hover:text-yellow-500 transition-colors">{resource.title}</h3>
                                        <p className="text-sm text-gray-400 mt-2">{resource.description}</p>
                                    </div>

                                    <div className="pt-4 flex items-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                        Access Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-block p-1 rounded-full bg-linear-to-r from-yellow-500/20 to-purple-500/20 border border-white/10">
                            <div className="px-6 py-3 rounded-full bg-black/50 backdrop-blur-md flex items-center gap-3">
                                <span className="text-gray-300">Want more advanced content?</span>
                                <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-bold hover:underline">
                                    Join our 2027 Batch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterSection />
        </div>
    );
}
