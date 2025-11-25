"use client";

import { Quote, Star } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Kasun Perera",
            achievement: "Island 1st - 2023",
            avatar: "https://placehold.co/80x80/333/FFF?text=K",
            rating: 5,
            text: "The teaching methodology here is exceptional. The recorded lessons helped me understand complex concepts at my own pace, and the regular assessments kept me on track throughout the year.",
            institute: "Colombo Institute"
        },
        {
            name: "Amaya Silva",
            achievement: "Island 3rd - 2023",
            avatar: "https://placehold.co/80x80/333/FFF?text=A",
            rating: 5,
            text: "I highly recommend this to anyone serious about getting top marks in Economics. The past papers and practice materials were invaluable in my preparation.",
            institute: "Gampaha Institute"
        },
        {
            name: "Tharindu Jayawardena",
            achievement: "Island 12th - 2022",
            avatar: "https://placehold.co/80x80/333/FFF?text=T",
            rating: 5,
            text: "The interactive classes and supportive learning environment made Economics my favorite subject. The teacher's dedication to student success is truly inspiring.",
            institute: "Colombo Institute"
        },
        {
            name: "Nimali De Silva",
            achievement: "Island 5th - 2022",
            avatar: "https://placehold.co/80x80/333/FFF?text=N",
            rating: 5,
            text: "Starting from basics to advanced concepts, everything was explained clearly. The analytics dashboard helped me identify my weak areas and improve systematically.",
            institute: "Kandy Institute"
        },
        {
            name: "Chathurika Bandara",
            achievement: "District 1st - 2023",
            avatar: "https://placehold.co/100x100/333/FFF?text=C",
            rating: 5,
            text: "The best investment I made for my A/Ls. The comprehensive study materials and personalized feedback transformed my understanding of Economics completely.",
            institute: "Ratnapura Institute"
        },
        {
            name: "Ruwan Fernando",
            achievement: "Island 9th - 2022",
            avatar: "https://placehold.co/80x80/333/FFF?text=R",
            rating: 5,
            text: "The free resources initially attracted me, but the quality of teaching made me stay. Every class was engaging and the teacher genuinely cared about our success.",
            institute: "Galle Institute"
        },
    ];

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
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-6">
                        <Quote className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        What Our Students Say
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Don't just take our word for it. Hear from students who achieved their dreams with our guidance.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-16 h-16 text-yellow-500" />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 relative z-10">
                                "{testimonial.text}"
                            </p>

                            {/* Student Info */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-800">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-yellow-500 transition-colors">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                                    <p className="text-xs text-yellow-500 font-semibold">{testimonial.achievement}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{testimonial.institute}</p>
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={5000} suffix="+" />
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Happy Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            4.9/5
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Average Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={98} suffix="%" />
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Would Recommend</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                            <CountUp end={10} suffix="+" />
                        </div>
                        <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
