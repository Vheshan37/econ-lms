'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { Button } from './button';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    description: string;
    type?: 'confirm' | 'success' | 'error' | 'warning';
    confirmText?: string;
    cancelText?: string;
}

export function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    type = 'confirm',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}: AlertDialogProps) {
    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-6 h-6 text-yellow-500" />;
            default:
                return <AlertCircle className="w-6 h-6 text-[#D4AF37]" />;
        }
    };

    const getAccentColor = () => {
        switch (type) {
            case 'success':
                return 'from-green-500 to-green-600';
            case 'error':
                return 'from-red-500 to-red-600';
            case 'warning':
                return 'from-yellow-500 to-yellow-600';
            default:
                return 'from-[#D4AF37] to-[#B5952F]';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${getAccentColor()} flex items-center justify-center shadow-lg`}>
                                    {getIcon()}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 mb-8 leading-relaxed">{description}</p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </Button>
                                {onConfirm && (
                                    <Button
                                        type="button"
                                        className={`flex-1 bg-gradient-to-r ${getAccentColor()} hover:opacity-90 text-white font-bold h-12 rounded-xl shadow-lg transition-all`}
                                        onClick={handleConfirm}
                                    >
                                        {confirmText}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
