"use client";

import { Quote, Star } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

interface Testimonial {
    id?: string;
    name: string;
    achievement: string;
    avatar: string;
    rating: number;
    text: string;
    institute: string;
}

interface TestimonialsPreviewProps {
    data: Testimonial[];
}

export function TestimonialsPreview({ data }: TestimonialsPreviewProps) {
    return (
        <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
                        Success Stories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        What Our Students Say
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6" />
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        අපගේ සිසුන්ගේ ජයග්‍රහණ අපගේ ගුණාත්මකභාවය පිළිබිඹු කරයි
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={5000} duration={2} />+
                        </div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Happy Students</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={100} duration={2} />+
                        </div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Island Ranks</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={98} duration={2} />%
                        </div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Success Rate</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={10} duration={2} />+
                        </div>
                        <p className="text-gray-400 text-sm uppercase tracking-wider">Years Experience</p>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((testimonial, index) => (
                        <div
                            key={testimonial.id || index}
                            className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-12 h-12 text-yellow-500" />
                            </div>

                            {/* Avatar & Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/20">
                                    <img
                                        src={testimonial.avatar || "https://placehold.co/80x80/333/FFF?text=" + testimonial.name.charAt(0)}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                                    <p className="text-yellow-500 text-sm font-semibold">{testimonial.achievement}</p>
                                    <p className="text-gray-500 text-xs">{testimonial.institute}</p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-300 leading-relaxed italic">
                                "{testimonial.text}"
                            </p>
                        </div>
                    ))}
                </div>

                {data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No testimonials added yet. Add testimonials from the Testimonials tab.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
