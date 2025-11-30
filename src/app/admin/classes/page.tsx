'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClass, getClasses, deleteClass } from '@/lib/actions/class';

interface ClassType {
    id: string;
    year: string;
    badge: string;
    description: string | null;
    createdAt: Date;
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassType[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [year, setYear] = useState('');
    const [badge, setBadge] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        const result = await getClasses();
        if (result.success && result.data) {
            setClasses(result.data);
        } else {
            setError(result.error || 'Failed to fetch classes');
        }
        setIsLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await createClass({ year, badge, description });

        if (result.success && result.data) {
            setClasses([result.data, ...classes]);
            setIsAdding(false);
            setYear('');
            setBadge('');
            setDescription('');
        } else {
            setError(result.error || 'Failed to create class');
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return;

        const result = await deleteClass(id);
        if (result.success) {
            setClasses(classes.filter(c => c.id !== id));
        } else {
            alert('Failed to delete class');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
                    <p className="text-gray-500 mt-2">Create and manage your academic classes (Max 3).</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    disabled={classes.length >= 3}
                    className="bg-[#1a1a1a] hover:bg-black text-white gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Class
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {classes.map((cls) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(cls.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{cls.year}</h3>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{cls.badge}</p>
                                </div>
                            </div>

                            {cls.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {cls.description}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(cls.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {cls.badge}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {classes.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No classes found. Create your first class to get started.</p>
                    </div>
                )}
            </div>

            {/* Add Class Modal/Dialog Overlay */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsAdding(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Class</h2>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Academic Year</Label>
                                    <Input
                                        placeholder="e.g. 2025 A/L"
                                        value={year}
                                        onChange={e => setYear(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Badge / Type</Label>
                                    <Input
                                        placeholder="e.g. Theory & Revision"
                                        value={badge}
                                        onChange={e => setBadge(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description (Optional)</Label>
                                    <Input
                                        placeholder="Brief description..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsAdding(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-[#1a1a1a] hover:bg-black text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Class'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
