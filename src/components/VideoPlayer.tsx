'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoPlayerProps {
    videoUrl: string;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    showWarning?: boolean;
}

export function VideoPlayer({ videoUrl, isOpen, onClose, title, showWarning = true }: VideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Detect video platform and extract ID/embed URL
    const getVideoEmbedData = (url: string): { platform: string; embedUrl: string } | null => {
        // YouTube
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) {
            return {
                platform: 'youtube',
                embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`
            };
        }

        // Vimeo
        const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) {
            return {
                platform: 'vimeo',
                embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
            };
        }

        // Google Drive
        if (url.includes('drive.google.com')) {
            const driveIdMatch = url.match(/[-\w]{25,}/);
            if (driveIdMatch) {
                return {
                    platform: 'drive',
                    embedUrl: `https://drive.google.com/file/d/${driveIdMatch[0]}/preview`
                };
            }
        }

        // Direct video files
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return {
                platform: 'direct',
                embedUrl: url
            };
        }

        // Generic iframe embed (for other platforms)
        return {
            platform: 'generic',
            embedUrl: url
        };
    };

    const videoData = getVideoEmbedData(videoUrl);

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

    if (!videoData) {
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
                        className="w-full max-w-6xl relative"
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
                            {videoData.platform === 'direct' ? (
                                <video
                                    className="absolute inset-0 w-full h-full"
                                    controls
                                    controlsList="nodownload"
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    <source src={videoData.embedUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <iframe
                                    ref={iframeRef}
                                    className="absolute inset-0 w-full h-full"
                                    src={videoData.embedUrl}
                                    title={title || 'Video Lesson'}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}

                            {/* Overlay to prevent right-click on video */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ zIndex: 1 }}
                            />
                        </div>

                        {/* Warning Message */}
                        {showWarning && (
                            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                <p className="text-yellow-200 text-sm text-center">
                                    ⚠️ This video is for enrolled students only. Sharing is prohibited.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
