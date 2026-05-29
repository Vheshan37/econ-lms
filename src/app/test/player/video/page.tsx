"use client";

import { VideoPlayer } from "@/components/ui/VideoPlayer";

export default function TestPlayerPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-8 text-[#fdf021]">Video Player Test Drive</h1>

            <div className="w-full max-w-4xl aspect-video border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <VideoPlayer
                    src="/uploads/about-trailer-video.mp4"
                    className="w-full h-full"
                    autoPlay
                    muted={false}
                />
            </div>

            <div className="mt-8 text-gray-400 text-center max-w-lg">
                <p>This player prevents downloading and right-click context menu.</p>
                <p className="text-sm mt-2 font-mono bg-gray-900 p-2 rounded">src: /uploads/about-trailer-video.mp4</p>
            </div>
        </div>
    );
}
