"use client";

import { Quote, Star } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

import { Testimonial } from "@prisma/client";

interface TestimonialsPreviewProps {
    data: Testimonial[];
    stats?: {
        totalStudents: string;
        averageRating: string;
        recommendationRate: string;
        experienceYears: string;
    };
}

export function TestimonialsPreview({ data, stats }: TestimonialsPreviewProps) {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(234,179,8,0.3),transparent_40%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(234,179,8,0.2),transparent_40%)]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-[#fdf021]/10 rounded-full mb-6">
                        <Quote className="h-8 w-8 text-[#fdf021]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        What Our Students Say
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        අපගේ වචන පමණක් ගන්න එපා. අපගේ මඟපෙන්වීම සමඟ තමන්ගේ සිහින ඉටු කර ගත් සිසුන්ගෙන් අසන්න.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((testimonial, idx) => (
                        <div
                            key={testimonial.id || idx}
                            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#fdf021]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-16 h-16 text-[#fdf021]" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-[#fdf021] fill-yellow-500" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 relative z-10">
                                "{testimonial.content}"
                            </p>

                            {/* Student Info */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-[#fdf021] transition-colors">
                                    {testimonial.imageUrl ? (
                                        <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                                    <p className="text-xs text-[#fdf021] font-semibold">{testimonial.role}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{testimonial.institute}</p>
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No testimonials added yet. Add testimonials from the Testimonials tab.</p>
                    </div>
                )}

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            {stats?.totalStudents || "5000+"}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Happy Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            {stats?.averageRating || "4.9/5"}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Average Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            {stats?.recommendationRate || "98%"}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Would Recommend</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            {stats?.experienceYears || "10+"}
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
