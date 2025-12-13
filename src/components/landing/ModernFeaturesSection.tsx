"use client";

import { BookOpen, Video, Users, Award, TrendingUp, Headphones } from "lucide-react";

export function ModernFeaturesSection() {
    const features = [
        {
            icon: Video,
            title: "Recorded Lessons",
            description: "ඕනෑම වේලාවක, ඕනෑම තැනක උසස් තත්ත්වයේ වීඩියෝ පාඩම් වලට ප්‍රවේශ වන්න. නැවත කිසිදා පන්තියක් මග හරින්න එපා.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: BookOpen,
            title: "Comprehensive Resources",
            description: "ප්‍රවීණයන් විසින් සකස් කරන ලද සවිස්තරාත්මක සටහන්, පසුගිය ප්‍රශ්න පත්‍ර සහ අධ්‍යයන ද්‍රව්‍ය වෙත ප්‍රවේශය ලබා ගන්න.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Users,
            title: "Interactive Classes",
            description: "ගතික, අන්තර්ක්‍රියාකාරී පන්ති කාමර සැසිවලදී ගුරුවරුන් සහ සම වයසේ මිතුරන් සමඟ සම්බන්ධ වන්න.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: Award,
            title: "Regular Assessments",
            description: "මුළු වර්ෂය පුරාම ප්‍රශ්න මාලා, පැවරුම් සහ ආදර්ශ විභාග සමඟ ඔබගේ ප්‍රගතිය නිරීක්ෂණය කරන්න.",
            color: "from-red-500 to-red-600"
        },
        {
            icon: TrendingUp,
            title: "Performance Analytics",
            description: "සවිස්තරාත්මක විශ්ලේෂණ සහ පුද්ගලික ප්‍රතිපෝෂණ සමඟ ඔබගේ දියුණුව නිරීක්ෂණය කරන්න.",
            color: "from-yellow-500 to-yellow-600"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            description: "අපගේ කැප වූ සහාය නාලිකා හරහා ඕනෑම වේලාවක ඔබගේ ප්‍රශ්නවලට පිළිතුරු ලබා ගන්න.",
            color: "from-pink-500 to-pink-600"
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Modern Teaching Features
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6" />
                    </div>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                        අති නවීන තාක්ෂණය සහ ඔප්පු වූ ගුරු ක්‍රමවේද සමඟ උ.පෙ. ආර්ථික විද්‍යා අධ්‍යාපනයට විප්ලවවාදී ප්‍රවේශයක් අත්විඳින්න.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)] hover:-translate-y-2"
                        >
                            {/* Icon with Gradient Background */}
                            <div className="relative mb-6">
                                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* Student Benefits Section - Redesigned */}
                <div className="mt-24 relative">
                    <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full" />
                    <div className="relative bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden">
                        {/* Inner stroke */}
                        <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                                    Why Students <span className="text-yellow-500">Love Us</span>
                                </h3>
                                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                                    Our comprehensive learning platform is designed to give you every advantage in your A/L Economics journey, combining traditional teaching excellence with modern technology.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Flexible learning schedule that fits your lifestyle",
                                        "Access to a vast library of educational resources",
                                        "Personalized learning paths based on your progress",
                                        "Direct communication with experienced teachers",
                                        "Competitive environment that motivates excellence"
                                    ].map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300 group">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                                <svg className="w-4 h-4 text-yellow-500 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-300 font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative">
                                {/* Success Rate Card - Premium Design */}
                                <div className="aspect-square max-w-md mx-auto relative">
                                    {/* Rotating borders */}
                                    <div className="absolute inset-0 border border-yellow-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                                    <div className="absolute inset-4 border border-dashed border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-yellow-900/20">
                                        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                            <TrendingUp className="w-10 h-10 text-black" />
                                        </div>
                                        <div className="text-7xl font-bold text-white mb-2 tracking-tighter">
                                            92<span className="text-yellow-500 text-4xl">%</span>
                                        </div>
                                        <div className="text-xl text-gray-300 font-medium">Success Rate</div>
                                        <div className="text-sm text-gray-500 mt-2">of our students achieve<br />A or B grades</div>
                                    </div>

                                    {/* Floating Badges */}
                                    <div className="absolute top-10 right-0 animate-bounce delay-700">
                                        <div className="bg-black/80 backdrop-blur-md border border-yellow-500/20 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-xs font-bold text-white">Top Result</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-10 left-0 animate-bounce delay-1000">
                                        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-lg">
                                            <span className="text-xs font-bold text-yellow-500">Best In Island</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
