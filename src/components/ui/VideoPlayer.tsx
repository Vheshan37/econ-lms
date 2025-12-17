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
    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        let currentUrl: string | null = null;
        let active = true;

        const loadVideo = async () => {
            // If it's already a blob (e.g. local preview), just use it
            if (src.startsWith('blob:')) {
                setObjectUrl(src);
                return;
            }

            try {
                const response = await fetch(src);
                const blob = await response.blob();
                if (!active) return;
                currentUrl = URL.createObjectURL(blob);
                setObjectUrl(currentUrl);
            } catch (error) {
                console.error("Failed to load video blob", error);
                // Fallback to original src if blob fetch fails
                if (active) setObjectUrl(src);
            }
        };

        loadVideo();

        return () => {
            active = false;
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    }, [src]);

    // Show loading state or pulse while fetching blob
    if (!objectUrl) {
        return <div className={cn("bg-gray-900 animate-pulse w-full h-full", className)} />;
    }

    return (
        <div className={cn("relative overflow-hidden bg-black", className)}>
            <video
                ref={videoRef}
                src={objectUrl}
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
