"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
} from "lucide-react";

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

export function CustomYouTubePlayer({
  videoId,
  className,
}: CustomYouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Progress Loop - with auto-pause before end to prevent suggestions
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isReady && isPlaying) {
      interval = setInterval(() => {
        if (
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === "function"
        ) {
          const current = playerRef.current.getCurrentTime();
          const videoDuration = playerRef.current.getDuration();

          setCurrentTime(current);

          // Update duration periodically just in case
          if (!duration) setDuration(videoDuration);

          // Auto-pause 1.5 seconds before end to prevent YouTube suggestions
          if (videoDuration && videoDuration - current <= 1.5) {
            playerRef.current.pauseVideo();
            setIsPlaying(false);
          }
        }
      }, 500); // Check every 500ms
    }

    return () => clearInterval(interval);
  }, [isReady, isPlaying, duration]);

  useEffect(() => {
    // 1. Load the IFrame Player API code asynchronously.
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. Initialize player when API is ready
    const initPlayer = () => {
      // If player already exists, destroy it first (cleanup)
      if (playerRef.current) {
        // playerRef.current.destroy(); // Optional, but risky if re-mounting quickly
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: "100%",
        width: "100%",
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
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
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
    // 1 = Playing, 2 = Paused, 0 = Ended
    const state = event.data;
    setIsPlaying(state === 1);

    if (state === 1) {
      setHasStarted(true); // Ensure mask is hidden if it starts playing
    }

    // Auto-reset when video ends to prevent "Suggested Videos"
    if (state === 0) {
      playerRef.current.seekTo(0);
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setCurrentTime(0);
      // Optional: setHasStarted(false) if we want to show cover again on end
      // but usually looping or staying on last frame is better
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    if (
      playerRef.current &&
      isReady &&
      typeof playerRef.current.playVideo === "function"
    ) {
      playerRef.current.playVideo();
    }
  };

  // Controls
  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (typeof playerRef.current.playVideo !== "function") return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const seek = (seconds: number) => {
    if (!playerRef.current || !isReady) return;
    if (typeof playerRef.current.getCurrentTime !== "function") return;
    if (typeof playerRef.current.seekTo !== "function") return;

    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (typeof playerRef.current.mute !== "function") return;
    if (typeof playerRef.current.unMute !== "function") return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div
      className={cn(
        "relative group bg-black rounded-xl overflow-hidden shadow-2xl",
        className,
      )}
    >
      {/* 1. The Engine: YouTube Iframe Container */}
      <div className="absolute inset-0 pointer-events-none">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* 2. The Shield: Transparent Overlay */}
      <div
        className="absolute inset-0 bg-transparent z-10"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* NEW: Start Mask (Thumbnail + Big Play Button) */}
      {!hasStarted && (
        <div
          className="absolute inset-0 z-40 bg-cover bg-center flex items-center justify-center cursor-pointer group/mask"
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
          }}
          onClick={handleStart}
        >
          <div className="absolute inset-0 bg-black/30 group-hover/mask:bg-black/40 transition-colors" />
          <button className="relative z-50 p-6 rounded-full bg-[#fdf021] shadow-[0_0_30px_rgba(234,179,8,0.5)] group-hover/mask:scale-110 transition-transform duration-300">
            <Play className="w-12 h-12 text-black fill-current ml-2" />
          </button>
        </div>
      )}

      {/* 3. The Dashboard: Container for Timeline + Controls (Z-index > Shield) */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-6 px-6 flex flex-col gap-4 transition-opacity duration-300",
          !hasStarted
            ? "opacity-0 pointer-events-none"
            : "opacity-0 group-hover:opacity-100",
        )}
      >
        {/* Timeline Scrubber (Top) */}
        <div className="w-full flex items-center">
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
              background: `linear-gradient(to right, #eab308 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 ${duration ? (currentTime / duration) * 100 : 0}%)`,
            }}
          />
        </div>

        {/* Control Buttons (Bottom) */}
        <div className="flex items-center justify-center gap-6 relative">
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
            className="p-4 rounded-full bg-[#fdf021] hover:bg-[#f0e51f] text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-transform hover:scale-110 active:scale-95"
            disabled={!isReady}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
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
            className="absolute right-0 p-2 text-gray-400 hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
