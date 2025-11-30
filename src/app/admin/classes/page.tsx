'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, GraduationCap, Calendar, Power, Layers, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { getYears, createYear, updateYear, toggleYearStatus, deleteYear } from '@/lib/actions/year';

interface YearType {
    id: string;
    year: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    _count?: {
        classTypes: number;
    };
}

export default function YearsPage() {
    const router = useRouter();
    const [years, setYears] = useState<YearType[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Alert Dialog State
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; year: string }>({
        isOpen: false,
        id: null,
        year: ''
    });

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        setIsLoading(true);
        const result = await getYears();
        if (result.success && result.data) {
            setYears(result.data);
        } else {
            setError(result.error || 'Failed to fetch years');
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = editingId
            ? await updateYear(editingId, { year, description })
            : await createYear({ year, description });

        if (result.success && result.data) {
            if (editingId) {
                setYears(years.map(y => y.id === editingId ? result.data : y));
            } else {
                setYears([result.data, ...years]);
            }
            closeModal();
        } else {
            setError(result.error || 'Failed to save year');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (yr: YearType) => {
        setEditingId(yr.id);
        setYear(yr.year);
        setDescription(yr.description || '');
        setIsAdding(true);
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const result = await toggleYearStatus(id, newStatus);

        if (result.success && result.data) {
            setYears(years.map(y => y.id === id ? result.data : y));
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to toggle year status' });
        }
    };

    const handleDeleteClick = (id: string, year: string) => {
        setDeleteConfirm({ isOpen: true, id, year });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.id) return;

        const result = await deleteYear(deleteConfirm.id);
        if (result.success) {
            setYears(years.filter(y => y.id !== deleteConfirm.id));
            setDeleteConfirm({ isOpen: false, id: null, year: '' });
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to delete year' });
        }
    };

    const closeModal = () => {
        setIsAdding(false);
        setEditingId(null);
        setYear('');
        setDescription('');
        setError(null);
    };

    const activeCount = years.filter(y => y.isActive).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                            <BookOpen className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Class Management</h1>
                            <p className="text-gray-400 text-lg">
                                Organize your academic years and class structure
                                <span className="ml-3 text-[#D4AF37] font-medium">
                                    {years.length} {years.length === 1 ? 'Year' : 'Years'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-12 px-6 font-bold shadow-lg shadow-[#D4AF37]/30"
                    >
                        <Plus className="w-5 h-5" />
                        Add Year
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {years.map((yr) => (
                        <motion.div
                            key={yr.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`relative group cursor-pointer overflow-hidden rounded-3xl transition-all ${yr.isActive
                                ? 'bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] hover:shadow-2xl hover:shadow-[#D4AF37]/20'
                                : 'bg-gray-100 opacity-60 hover:opacity-80 grayscale'
                                }`}
                            onClick={() => yr.isActive && router.push(`/admin/classes/${yr.id}`)}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-50 pointer-events-auto">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(yr.id, yr.year);
                                    }}
                                    className="p-2 rounded-full transition-colors text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                    title="Delete year"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(yr);
                                    }}
                                    className={`p-2 rounded-full transition-colors ${yr.isActive
                                        ? 'text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(yr.id, yr.isActive);
                                    }}
                                    className={`p-2 rounded-full transition-colors ${yr.isActive
                                        ? 'text-green-400 hover:bg-green-400/10'
                                        : 'text-gray-500 hover:bg-gray-200'
                                        }`}
                                    title={yr.isActive ? 'Disable year' : 'Enable year'}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-8">
                                {/* Icon */}
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 ${yr.isActive
                                    ? 'bg-linear-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/30'
                                    : 'bg-gray-300'
                                    }`}>
                                    <GraduationCap className={`w-8 h-8 ${yr.isActive ? 'text-[#1a1a1a]' : 'text-gray-600'}`} />
                                </div>

                                {/* Year */}
                                <h3 className={`text-4xl font-bold mb-2 ${yr.isActive ? 'text-white' : 'text-gray-700'}`}>
                                    {yr.year}
                                </h3>

                                {/* Description */}
                                {yr.description && (
                                    <p className={`text-sm mb-6 line-clamp-2 ${yr.isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {yr.description}
                                    </p>
                                )}

                                {/* Stats */}
                                <div className={`flex items-center gap-4 pt-4 border-t ${yr.isActive ? 'border-white/10' : 'border-gray-300'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <Layers className={`w-4 h-4 ${yr.isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                                        <span className={`text-sm ${yr.isActive ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {yr._count?.classTypes || 0} class types
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className={`w-4 h-4 ${yr.isActive ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                                        <span className={`text-xs ${yr.isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {new Date(yr.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </AnimatePresence>

                {years.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No academic years found</p>
                        <p className="text-gray-400 text-sm mt-2">Create your first year to get started</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Year Modal */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                                        {editingId ? <Edit2 className="w-6 h-6 text-[#1a1a1a]" /> : <Plus className="w-6 h-6 text-[#1a1a1a]" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Year' : 'New Academic Year'}</h2>
                                        <p className="text-gray-400 text-sm">{editingId ? 'Update year details' : 'Create a new academic year'}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300 ml-1">Year</Label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                                            <Input
                                                placeholder="e.g. 2025 A/L"
                                                value={year}
                                                onChange={e => setYear(e.target.value)}
                                                required
                                                className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-300 ml-1">Description <span className="text-gray-600 text-xs">(Optional)</span></Label>
                                        <Input
                                            placeholder="Brief description..."
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Year' : 'Create Year')}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Alert */}
            <AlertDialog
                isOpen={errorAlert.isOpen}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
                title="Error"
                description={errorAlert.message}
                type="error"
                cancelText="Close"
            />

            {/* Delete Confirmation */}
            <AlertDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null, year: '' })}
                onConfirm={handleConfirmDelete}
                title="Delete Academic Year"
                description={`Are you sure you want to delete "${deleteConfirm.year}"? This will permanently delete all class types, topics, and resources associated with it.`}
                type="warning"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div >
    );
}
