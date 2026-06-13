"use client";

import { useState } from "react";
import { CustomYouTubePlayer } from "@/components/ui/CustomYouTubePlayer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Shield } from "lucide-react";

// Helper to extract YouTube ID (reused from other parts of the app)
const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function TestDrivePage() {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=h3fUgOKFMNU",
  ); // Default to sample
  const [videoId, setVideoId] = useState<string | null>("h3fUgOKFMNU");
  const [key, setKey] = useState(0); // To force re-render on load

  const handleLoadVideo = () => {
    const id = getYouTubeVideoId(videoUrl);
    if (id) {
      setVideoId(id);
      setKey((prev) => prev + 1); // Force player reset
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Test Drive: Restricted Player
        </h1>
        <p className="text-gray-500">
          Verify the secure playback experience. This player prevents direct
          YouTube interactions, hiding native controls and blocking
          right-clicks.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              YouTube Video URL
            </label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <Button
            onClick={handleLoadVideo}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Play className="w-4 h-4 mr-2" />
            Load Video
          </Button>
        </div>
      </div>

      {/* Player Container */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-900 relative group">
            {videoId ? (
              <CustomYouTubePlayer
                key={key}
                videoId={videoId}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No Video Loaded
              </div>
            )}
          </div>
          <div className="text-xs text-center text-gray-400">
            Player Version 1.0.0 • Secure Mode Active
          </div>
        </div>

        {/* Features Info */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="flex items-center gap-2 font-bold text-blue-900 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              Security Features
            </h3>
            <ul className="space-y-3">
              {[
                "Transparent Overlay blocks direct clicks",
                "Native YouTube controls hidden",
                "Right-click context menu disabled",
                "Keyboard shortcuts restricted",
                "Clean interface without recommended videos",
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">How to test?</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Try to click the YouTube logo, pause by clicking the video center,
              or right-click to inspect. None of these actions should work on
              the video stream itself.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setVideoId("h3fUgOKFMNU"); // Reset to reliable sample
                setVideoUrl("https://www.youtube.com/watch?v=h3fUgOKFMNU");
                setKey((prev) => prev + 1);
              }}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default Sample
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
