"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
    className?: string;
}

export function VideoPlayer({
    src,
    className,
    controls = true,
    ...props
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className={cn("relative overflow-hidden bg-black", className)}>
            <video
                ref={videoRef}
                src={src}
                controls={controls}
                controlsList="nodownload" // Chrome/Edge specific
                onContextMenu={(e) => e.preventDefault()} // Disable right click
                className="w-full h-full object-cover"
                {...props}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
