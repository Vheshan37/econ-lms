"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, FastForward, Rewind, Volume2, VolumeX } from "lucide-react";

interface CustomYouTubePlayerProps {
    videoId: string;
    className?: string;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: (() => void) | undefined;
    }
}

export function CustomYouTubePlayer({ videoId, className }: CustomYouTubePlayerProps) {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Progress Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isReady && isPlaying) {
            interval = setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    setCurrentTime(playerRef.current.getCurrentTime());
                    // Update duration periodically just in case
                    if (!duration) setDuration(playerRef.current.getDuration());
                }
            }, 500); // Check every 500ms
        }

        return () => clearInterval(interval);
    }, [isReady, isPlaying, duration]);

    useEffect(() => {
        // 1. Load the IFrame Player API code asynchronously.
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // 2. Initialize player when API is ready
        const initPlayer = () => {
            // If player already exists, destroy it first (cleanup)
            if (playerRef.current) {
                // playerRef.current.destroy(); // Optional, but risky if re-mounting quickly
            }

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 0, // Hide native controls
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            // Append to existing callback or create new one
            const existingCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (existingCallback) existingCallback();
                initPlayer();
            };
        }

        return () => {
            // Optional: Cleanup
        };
    }, [videoId]);

    const onPlayerReady = (event: any) => {
        setIsReady(true);
        // Sync initial state
        setIsMuted(event.target.isMuted());
        setDuration(event.target.getDuration());
    };

    const onPlayerStateChange = (event: any) => {
        // 1 = Playing, 2 = Paused
        setIsPlaying(event.data === 1);
    };

    // Controls
    const togglePlay = () => {
        if (!playerRef.current || !isReady) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const seek = (seconds: number) => {
        if (!playerRef.current || !isReady) return;
        const currentTime = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(currentTime + seconds, true);
    };

    const toggleMute = () => {
        if (!playerRef.current || !isReady) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    return (
        <div className={cn("relative group bg-black rounded-xl overflow-hidden shadow-2xl", className)}>

            {/* 1. The Engine: YouTube Iframe Container */}
            <div className="absolute inset-0 pointer-events-none">
                <div ref={containerRef} className="w-full h-full" />
            </div>

            {/* 2. The Shield: Transparent Overlay */}
            <div
                className="absolute inset-0 bg-transparent z-10"
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* 3. The Dashboard: Custom Controls (Z-index > Shield) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                {/* Rewind */}
                <button
                    onClick={() => seek(-10)}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                    title="-10s"
                >
                    <Rewind className="w-6 h-6" />
                </button>

                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="p-5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-transform hover:scale-110 active:scale-95"
                    disabled={!isReady}
                >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                {/* Forward */}
                <button
                    onClick={() => seek(10)}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                    title="+10s"
                >
                    <FastForward className="w-6 h-6" />
                </button>

                {/* Volume */}
                <button
                    onClick={toggleMute}
                    className="absolute right-6 p-2 text-gray-400 hover:text-white"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

            </div>

            {/* Timeline Scrubber */}
            <div className="absolute bottom-[88px] left-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        setCurrentTime(newTime);
                        if (playerRef.current && isReady) {
                            playerRef.current.seekTo(newTime, true);
                        }
                    }}
                    className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:h-2 transition-all"
                    style={{
                        background: `linear-gradient(to right, #eab308 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 ${duration ? (currentTime / duration) * 100 : 0}%)`
                    }}
                />
            </div>
        </div>
    );
}
