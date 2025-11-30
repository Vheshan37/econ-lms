'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, RotateCcw, FileEdit, Power, FileText, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { getYearById } from '@/lib/actions/year';
import { ensureClassTypes, toggleClassTypeStatus } from '@/lib/actions/classType';
import { ClassTypeName } from '@prisma/client';

interface ClassType {
    id: string;
    name: ClassTypeName;
    isActive: boolean;
    _count?: {
        resources: number;
    };
}

interface YearData {
    id: string;
    year: string;
    description: string | null;
    classTypes: ClassType[];
}

const CLASS_TYPE_CONFIG = {
    THEORY: {
        label: 'Theory',
        icon: BookOpen,
        color: 'from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',
        description: 'Core concepts and fundamental lessons'
    },
    REVISION: {
        label: 'Revision',
        icon: RotateCcw,
        color: 'from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',
        description: 'Review materials and practice sessions'
    },
    PAPER_CLASS: {
        label: 'Paper Class',
        icon: FileEdit,
        color: 'from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]',
        description: 'Past papers and exam preparation'
    }
};

export default async function ClassTypesPage({ params }: { params: Promise<{ yearId: string }> }) {
    const { yearId } = await params;
    return <ClassTypesPageClient yearId={yearId} />;
}

function ClassTypesPageClient({ yearId }: { yearId: string }) {
    const router = useRouter();
    const [yearData, setYearData] = useState<YearData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    useEffect(() => {
        fetchYearData();
    }, [yearId]);

    const fetchYearData = async () => {
        setIsLoading(true);

        // Ensure all 3 class types exist
        await ensureClassTypes(yearId);

        const result = await getYearById(yearId);
        if (result.success && result.data) {
            setYearData(result.data);
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to fetch year data' });
        }
        setIsLoading(false);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const result = await toggleClassTypeStatus(id, newStatus);

        if (result.success) {
            await fetchYearData();
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to toggle class type status' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!yearData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Year not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => router.push('/admin/classes')}
                    className="gap-2 bg-[#1a1a1a] hover:bg-black text-white border-none"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{yearData.year}</h1>
                    <p className="text-gray-500 mt-1">Select a class type to manage resources</p>
                </div>
            </div>

            {yearData.description && (
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-700">{yearData.description}</p>
                </div>
            )}

            {/* Class Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['THEORY', 'REVISION', 'PAPER_CLASS'] as ClassTypeName[]).map((typeName, index) => {
                    const classType = yearData.classTypes.find(ct => ct.name === typeName);
                    const config = CLASS_TYPE_CONFIG[typeName];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={typeName}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group cursor-pointer overflow-hidden rounded-3xl transition-all ${classType?.isActive
                                    ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] hover:shadow-2xl hover:shadow-[#D4AF37]/20'
                                    : 'bg-gray-100 opacity-60 hover:opacity-80'
                                }`}
                            onClick={() => classType?.isActive && router.push(`/admin/classes/${yearId}/${classType.id}`)}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                            {/* Action Buttons */}
                            {classType && (
                                <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggle(classType.id, classType.isActive);
                                        }}
                                        className={`p-2 rounded-full transition-colors ${classType.isActive
                                                ? 'text-green-400 hover:bg-green-400/10'
                                                : 'text-gray-500 hover:bg-gray-200'
                                            }`}
                                        title={classType.isActive ? 'Disable class type' : 'Enable class type'}
                                    >
                                        <Power className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10 p-8">
                                {/* Icon */}
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 ${classType?.isActive
                                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/30'
                                        : 'bg-gray-300'
                                    }`}>
                                    <Icon className={`w-8 h-8 ${classType?.isActive ? 'text-[#1a1a1a]' : 'text-gray-600'}`} />
                                </div>

                                {/* Title */}
                                <h3 className={`text-3xl font-bold mb-2 ${classType?.isActive ? 'text-white' : 'text-gray-700'}`}>
                                    {config.label}
                                </h3>

                                {/* Description */}
                                <p className={`text-sm mb-6 line-clamp-2 ${classType?.isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {config.description}
                                </p>

                                {/* Stats */}
                                <div className={`flex items-center gap-4 pt-4 border-t ${classType?.isActive ? 'border-white/10' : 'border-gray-300'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <FileText className={`w-4 h-4 ${classType?.isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${classType?.isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {classType?._count?.resources || 0} resources
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Inactive Overlay */}
                            {!classType?.isActive && (
                                <div className="absolute inset-0 bg-gray-50/50 rounded-3xl flex items-center justify-center pointer-events-none">
                                    <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                                        Inactive
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Error Alert */}
            <AlertDialog
                isOpen={errorAlert.isOpen}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
                title="Error"
                description={errorAlert.message}
                type="error"
                cancelText="Close"
            />
        </div>
    );
}
