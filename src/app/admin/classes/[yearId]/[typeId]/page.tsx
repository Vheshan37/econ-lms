'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Layers, FileText, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { getClassTypeById } from '@/lib/actions/classType';
import { createTopic, updateTopic, deleteTopic } from '@/lib/actions/topic';

interface Topic {
    id: string;
    title: string;
    description: string | null;
    order: number;
    _count?: {
        resources: number;
    };
}

interface ClassTypeData {
    id: string;
    name: string;
    year: {
        id: string;
        year: string;
    };
    topics: Topic[];
}

export default async function TopicsPage({ params }: { params: Promise<{ yearId: string; typeId: string }> }) {
    const { yearId, typeId } = await params;
    return <TopicsPageClient yearId={yearId} typeId={typeId} />;
}

function TopicsPageClient({ yearId, typeId }: { yearId: string; typeId: string }) {
    const router = useRouter();
    const [classTypeData, setClassTypeData] = useState<ClassTypeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert Dialog State
    const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; topicId: string | null; topicTitle: string }>({
        isOpen: false,
        topicId: null,
        topicTitle: ''
    });
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    useEffect(() => {
        fetchClassTypeData();
    }, [typeId]);

    const fetchClassTypeData = async () => {
        setIsLoading(true);
        const result = await getClassTypeById(typeId);
        if (result.success && result.data) {
            setClassTypeData(result.data);
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to fetch class type data' });
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = editingTopic
            ? await updateTopic(editingTopic.id, { title, description })
            : await createTopic({ classTypeId: typeId, title, description });

        if (result.success) {
            await fetchClassTypeData();
            closeModal();
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to save topic' });
        }
        setIsSubmitting(false);
    };

    const handleEdit = (topic: Topic) => {
        setEditingTopic(topic);
        setTitle(topic.title);
        setDescription(topic.description || '');
        setIsAdding(true);
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteAlert({ isOpen: true, topicId: id, topicTitle: title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteAlert.topicId) return;

        const result = await deleteTopic(deleteAlert.topicId);
        if (result.success) {
            await fetchClassTypeData();
        } else {
            setErrorAlert({ isOpen: true, message: 'Failed to delete topic' });
        }
    };

    const closeModal = () => {
        setIsAdding(false);
        setEditingTopic(null);
        setTitle('');
        setDescription('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!classTypeData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Class type not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Button
                                onClick={() => router.push(`/admin/classes/${yearId}`)}
                                variant="ghost"
                                className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <span>{classTypeData.year.year}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-[#D4AF37] font-medium">{classTypeData.name}</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white">
                                    Topics
                                </h1>
                                <p className="text-gray-400 mt-2 max-w-xl">
                                    Manage topics and curriculum structure for this class.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Topic
                        </Button>
                    </div>
                </motion.div>

                {/* Topics List */}
                <div className="grid gap-4">
                    {classTypeData.topics.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No topics added yet</p>
                            <p className="text-gray-400 text-sm mt-2">Create your first topic to start adding resources</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {classTypeData.topics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#D4AF37]/30 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => router.push(`/admin/classes/${yearId}/${typeId}/${topic.id}`)}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-[#D4AF37] to-[#B5952F] opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors">
                                                {topic.title}
                                            </h3>
                                            {topic.description && (
                                                <p className="text-gray-500 text-sm mb-3">{topic.description}</p>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                    <FileText className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs font-medium text-gray-600">
                                                        {topic._count?.resources || 0} resources
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(topic);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(topic.id, topic.title);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Add/Edit Topic Modal */}
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
                                            {editingTopic ? <Edit2 className="w-6 h-6 text-[#1a1a1a]" /> : <Plus className="w-6 h-6 text-[#1a1a1a]" />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{editingTopic ? 'Edit Topic' : 'New Topic'}</h2>
                                            <p className="text-gray-400 text-sm">{editingTopic ? 'Update topic details' : 'Create a new topic'}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 ml-1">Topic Title</Label>
                                            <Input
                                                placeholder="e.g. Market Equilibrium"
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                required
                                                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                                            />
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
                                                {isSubmitting ? (editingTopic ? 'Updating...' : 'Creating...') : (editingTopic ? 'Update' : 'Create Topic')}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    isOpen={deleteAlert.isOpen}
                    onClose={() => setDeleteAlert({ isOpen: false, topicId: null, topicTitle: '' })}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Topic"
                    description={`Are you sure you want to delete "${deleteAlert.topicTitle}"? All resources in this topic will also be deleted.`}
                    type="error"
                    confirmText="Delete"
                    cancelText="Cancel"
                />

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
        </div>
    );
}
