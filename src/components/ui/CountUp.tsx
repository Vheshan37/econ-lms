"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export function CountUp({ end, duration = 2000, suffix = "", className = "" }: CountUpProps) {
    const countRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!countRef.current || hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        animateCount();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(countRef.current);

        const animateCount = () => {
            const startTime = Date.now();
            const startValue = 0;

            const updateCount = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);

                if (countRef.current) {
                    countRef.current.textContent = currentValue + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else if (countRef.current) {
                    countRef.current.textContent = end + suffix;
                }
            };

            requestAnimationFrame(updateCount);
        };

        return () => {
            if (countRef.current) {
                observer.unobserve(countRef.current);
            }
        };
    }, [end, duration, suffix]);

    return <span ref={countRef} className={className}>0{suffix}</span>;
}
