"use client";

import { CustomYouTubePlayer } from "@/components/ui/CustomYouTubePlayer";

export default function TestYouTubePlayerPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-[#fdf021]">
        Custom YouTube Player Test
      </h1>

      <div className="w-full max-w-4xl aspect-video border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Sample Video: "Nature Beautiful Short Video 4k" */}
        <CustomYouTubePlayer videoId="h3fUgOKFMNU" className="w-full h-full" />
      </div>

      <div className="mt-8 text-gray-400 text-center max-w-lg space-y-2">
        <p>Features:</p>
        <ul className="list-disc list-inside text-sm text-gray-500 text-left pl-8">
          <li>
            Transparent overlay blocks ALL direct interaction (no pausing by
            clicking video).
          </li>
          <li>Native YouTube controls are hidden.</li>
          <li>Custom Play/Pause, Rewind/Forward (10s), Volume controls.</li>
          <li>Right-click context menu disabled.</li>
        </ul>
      </div>
    </div>
  );
}
