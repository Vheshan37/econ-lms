"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const banners = [
    {
        id: 1,
        title: "2027 Theory Class",
        subtitle: "Admissions Now Open",
        description: "Join the most comprehensive Economics theory class in Sri Lanka.",
        color: "from-yellow-600 to-amber-800",
        image: "https://placehold.co/1920x600/1a1a1a/D4AF37/png?text=2027+Theory+Class+Started"
    },
    {
        id: 2,
        title: "Revision & Paper Class",
        subtitle: "Fast Track Your 'A'",
        description: "Intensive revision sessions focusing on past papers and model questions.",
        color: "from-blue-900 to-slate-900",
        image: "https://placehold.co/1920x600/0f172a/3b82f6/png?text=Revision+%26+Paper+Class"
    },
    {
        id: 3,
        title: "Free Seminar Series",
        subtitle: "Register Free",
        description: "Experience the quality of our teaching before you commit.",
        color: "from-emerald-900 to-green-950",
        image: "https://placehold.co/1920x600/064e3b/10b981/png?text=Free+Seminar+Series"
    },
    {
        id: 4,
        title: "LMS Mobile App",
        subtitle: "Learn Anywhere",
        description: "Download our new mobile app for seamless learning on the go.",
        color: "from-purple-900 to-indigo-950",
        image: "https://placehold.co/1920x600/312e81/818cf8/png?text=Download+Mobile+App"
    }
];

export function BannerSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + banners.length) % banners.length);
    };

    const nextSlide = () => paginate(1);
    const prevSlide = () => paginate(-1);

    return (
        <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black text-white group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            nextSlide();
                        } else if (swipe > swipeConfidenceThreshold) {
                            prevSlide();
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image/Gradient */}
                    <div className={`absolute inset-0 bg-linear-to-br ${banners[currentIndex].color} opacity-40`} />
                    <img
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].title}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />


                    <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center z-10 space-y-6">
                        {/* Text removed as per request */}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 md:px-8 z-20 pointer-events-none">
                <button
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 duration-300"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 duration-300"
                    onClick={nextSlide}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-20">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-yellow-500 w-8"
                            : "bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
