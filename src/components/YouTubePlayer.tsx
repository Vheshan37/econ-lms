'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';

interface YouTubePlayerProps {
    videoUrl: string;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export function YouTubePlayer({ videoUrl, isOpen, onClose, title }: YouTubePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Extract video ID from YouTube URL
    const getVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);

    // Disable right-click
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if (isOpen) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, [isOpen]);

    // Disable keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isOpen) {
                // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')
                ) {
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!videoId) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-5xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-t-2xl p-4 flex items-center justify-between">
                            <h3 className="text-white font-semibold truncate">{title || 'Video Lesson'}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Video Container */}
                        <div
                            className="relative bg-black rounded-b-2xl overflow-hidden"
                            style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <iframe
                                ref={iframeRef}
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0`}
                                title={title || 'Video Lesson'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ pointerEvents: 'auto' }}
                            />

                            {/* Overlay to prevent right-click on video */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ zIndex: 1 }}
                            />
                        </div>

                        {/* Warning Message */}
                        <div className="mt-4 bg-[#fdf021]/10 border border-[#fdf021]/20 rounded-xl p-4">
                            <p className="text-yellow-200 text-sm text-center">
                                ⚠️ This video is for enrolled students only. Sharing is prohibited.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
