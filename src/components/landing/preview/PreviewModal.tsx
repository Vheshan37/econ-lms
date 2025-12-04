"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function PreviewModal({ isOpen, onClose, title, children }: PreviewModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full min-h-screen"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
                            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                    <h2 className="text-xl font-bold text-white">Preview: {title}</h2>
                                </div>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Close Preview
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full">
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 z-10 bg-black/80 backdrop-blur-md border-t border-gray-800">
                            <div className="container mx-auto px-4 py-4 text-center">
                                <p className="text-sm text-gray-400">
                                    This is a preview. Changes are not saved until you click "Save Changes" in the content management panel.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
