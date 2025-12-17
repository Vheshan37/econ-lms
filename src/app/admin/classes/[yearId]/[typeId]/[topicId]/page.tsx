'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Youtube, FileText, File, ClipboardList, Play, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { VideoPlayer } from '@/components/VideoPlayer';
import { getTopicById } from '@/lib/actions/topic';
import { createResource, updateResource, deleteResource } from '@/lib/actions/resource';
import { uploadFile } from '@/lib/actions/upload';
import { ResourceType } from '@prisma/client';

interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    description: string | null;
    createdAt: Date;
}

interface TopicData {
    id: string;
    title: string;
    classType: {
        id: string;
        name: string;
        year: {
            id: string;
            year: string;
        };
    };
    resources: Resource[];
}

const TABS = [
    { id: 'VIDEO', label: 'Videos', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'PDF', label: 'PDFs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'PAST_PAPER', label: 'Past Papers', icon: File, color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { id: 'QUIZ', label: 'Quizzes', icon: ClipboardList, color: 'text-green-500', bgColor: 'bg-green-500' },
];

export default function ResourceManagementPage({ params }: { params: Promise<{ yearId: string; typeId: string; topicId: string }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ yearId: string; typeId: string; topicId: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) return null;

    return <ResourceManagementPageClient yearId={resolvedParams.yearId} typeId={resolvedParams.typeId} topicId={resolvedParams.topicId} />;
}

function ResourceManagementPageClient({ yearId, typeId, topicId }: { yearId: string; typeId: string; topicId: string }) {
    const router = useRouter();
    const [topicData, setTopicData] = useState<TopicData | null>(null);
    const [activeTab, setActiveTab] = useState<ResourceType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    // Form state
    const [resourceType, setResourceType] = useState<ResourceType>('VIDEO');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [resourceFile, setResourceFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert Dialog State
    const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; resourceId: string | null; resourceTitle: string }>({
        isOpen: false,
        resourceId: null,
        resourceTitle: ''
    });
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    // Video Player State
    const [videoPlayer, setVideoPlayer] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: '',
        title: ''
    });

    const fetchTopicData = async () => {
        setIsLoading(true);
        const result = await getTopicById(topicId);
        if (result.success && result.data) {
            setTopicData(result.data);

            // Set active tab to the first available type if not already set or if current active tab has no resources
            const availableTypes = new Set(result.data.resources.map(r => r.type));
            if (availableTypes.size > 0) {
                if (!activeTab || !availableTypes.has(activeTab)) {
                    // Find the first tab defined in TABS that has resources
                    const firstAvailableTab = TABS.find(t => availableTypes.has(t.id as ResourceType));
                    if (firstAvailableTab) {
                        setActiveTab(firstAvailableTab.id as ResourceType);
                    }
                }
            } else {
                setActiveTab(null);
            }
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to fetch topic data' });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await getTopicById(topicId);
            if (result.success && result.data) {
                setTopicData(result.data);

                const availableTypes = new Set(result.data.resources.map(r => r.type));
                if (availableTypes.size > 0) {
                    const firstAvailableTab = TABS.find(t => availableTypes.has(t.id as ResourceType));
                    if (firstAvailableTab) setActiveTab(firstAvailableTab.id as ResourceType);
                } else {
                    setActiveTab(null);
                }
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to fetch topic data' });
            }
            setIsLoading(false);
        };

        fetchData();
    }, [topicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalUrl = url;

            if (resourceFile && (resourceType === 'PDF' || resourceType === 'PAST_PAPER')) {
                const formData = new FormData();
                formData.append('file', resourceFile);
                const uploadResult = await uploadFile(formData);
                if (uploadResult.success && uploadResult.url) {
                    finalUrl = uploadResult.url;
                } else {
                    throw new Error(uploadResult.error || 'Failed to upload file');
                }
            }

            const result = editingResource
                ? await updateResource(editingResource.id, { title, type: resourceType, url: finalUrl, description })
                : await createResource({ topicId, title, type: resourceType, url: finalUrl, description });

            if (result.success) {
                await fetchTopicData();
                closeModal();
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to save resource' });
            }
        } catch (error) {
            setErrorAlert({ isOpen: true, message: 'An unexpected error occurred' });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource);
        setTitle(resource.title);
        setUrl(resource.url);
        setDescription(resource.description || '');
        setResourceType(resource.type);
        setIsAddingResource(true);
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteAlert({ isOpen: true, resourceId: id, resourceTitle: title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteAlert.resourceId) return;

        const result = await deleteResource(deleteAlert.resourceId);
        if (result.success) {
            await fetchTopicData();
        } else {
            setErrorAlert({ isOpen: true, message: 'Failed to delete resource' });
        }
    };

    const handleResourceClick = (resource: Resource) => {
        if (resource.type === 'VIDEO') {
            setVideoPlayer({ isOpen: true, url: resource.url, title: resource.title });
        } else {
            window.open(resource.url, '_blank');
        }
    };

    const closeModal = () => {
        setIsAddingResource(false);
        setEditingResource(null);
        setTitle('');
        setUrl('');
        setDescription('');
        setResourceType('VIDEO'); // Reset to default
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!topicData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Topic not found</div>
            </div>
        );
    }

    const availableTabs = TABS.filter(tab =>
        topicData.resources.some(r => r.type === tab.id)
    );

    const currentTab = activeTab ? TABS.find(t => t.id === activeTab) : null;
    const currentTabResources = activeTab ? topicData.resources.filter(r => r.type === activeTab) : [];
    const TabIcon = currentTab ? currentTab.icon : Plus;

    return (
        <div className="space-y-8">
            <div className="mx-auto space-y-8">
                {/* Breadcrumb Header */}
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
                                onClick={() => router.push(`/admin/classes/${yearId}/${typeId}`)}
                                variant="ghost"
                                className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <span>{topicData.classType.year.year}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span>{topicData.classType.name}</span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-[#D4AF37] font-medium">{topicData.title}</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white">
                                    Resources
                                </h1>
                                <p className="text-gray-400 mt-2 max-w-xl">
                                    Manage learning materials, videos, and quizzes for this topic.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                setResourceType('VIDEO');
                                setIsAddingResource(true);
                            }}
                            className="bg-linear-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Resource
                        </Button>
                    </div>
                </motion.div>

                {/* Tabs - Only show if there are resources */}
                {availableTabs.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex border-b border-gray-200">
                            {availableTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const count = topicData.resources.filter(r => r.type === tab.id).length;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ResourceType)}
                                        className={`flex-1 relative px-6 py-4 font-medium transition-colors ${isActive
                                            ? 'text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                                            <span>{tab.label}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? `${tab.bgColor} text-white` : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {count}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                                                transition={{ type: "spring", duration: 0.5 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab || 'empty'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {currentTabResources.length === 0 && activeTab ? (
                                        <div className="text-center py-16">
                                            <TabIcon className={`w-16 h-16 mx-auto mb-4 ${currentTab?.color} opacity-20`} />
                                            <p className="text-gray-500 text-lg">No {currentTab?.label.toLowerCase()} added yet</p>
                                            <p className="text-gray-400 text-sm mt-2">Click &quot;Add {currentTab?.label.slice(0, -1)}&quot; to get started</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {currentTabResources.map((resource) => (
                                                <motion.div
                                                    key={resource.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all group cursor-pointer border border-gray-100"
                                                    onClick={() => handleResourceClick(resource)}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                                                                {resource.type === 'VIDEO' && (
                                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                        <Play className="w-4 h-4 text-red-500" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {resource.description && (
                                                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{resource.description}</p>
                                                            )}
                                                            {resource.type !== 'VIDEO' && (
                                                                <div className="text-xs text-[#D4AF37] hover:underline inline-flex items-center gap-1">
                                                                    Open Link <ExternalLink className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(resource);
                                                                }}
                                                                className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteClick(resource.id, resource.title);
                                                                }}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Empty State when no resources exist */}
                {availableTabs.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No resources yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Get started by adding videos, PDFs, past papers, or quizzes to this topic.
                        </p>
                        <Button
                            onClick={() => setIsAddingResource(true)}
                            className="bg-[#1a1a1a] hover:bg-black text-white gap-2 h-12 px-8 rounded-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Add First Resource
                        </Button>
                    </div>
                )}

                {/* Add/Edit Resource Modal */}
                <AnimatePresence>
                    {isAddingResource && (
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
                                        <div className={`h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg`}>
                                            {editingResource ? <Edit2 className="w-6 h-6 text-[#1a1a1a]" /> : <Plus className="w-6 h-6 text-[#1a1a1a]" />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {editingResource ? 'Edit Resource' : 'Add Resource'}
                                            </h2>
                                            <p className="text-gray-400 text-sm">
                                                {editingResource ? 'Update resource details' : 'Select type and add details'}
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 ml-1">Resource Type</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TABS.map((tab) => {
                                                    const Icon = tab.icon;
                                                    const isSelected = resourceType === tab.id;
                                                    return (
                                                        <button
                                                            key={tab.id}
                                                            type="button"
                                                            onClick={() => setResourceType(tab.id as ResourceType)}
                                                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <Icon className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{tab.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-300 ml-1">Title</Label>
                                            <Input
                                                placeholder="e.g. Introduction to Economics"
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                required
                                                className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-300 ml-1">
                                                {(resourceType === 'PDF' || resourceType === 'PAST_PAPER') ? 'Upload Document' : 'URL'}
                                            </Label>

                                            {(resourceType === 'PDF' || resourceType === 'PAST_PAPER') ? (
                                                <div className="space-y-2">
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-[#1a1a1a] hover:file:bg-[#B5952F]"
                                                        onChange={e => {
                                                            if (e.target.files?.[0]) {
                                                                setResourceFile(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    {url && (
                                                        <p className="text-xs text-green-500 truncate pl-1">
                                                            Current: {url}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <Input
                                                    placeholder="https://..."
                                                    value={url}
                                                    onChange={e => setUrl(e.target.value)}
                                                    required
                                                    type="url"
                                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-600"
                                                />
                                            )}
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
                                                {isSubmitting ? (editingResource ? 'Updating...' : 'Adding...') : (editingResource ? 'Update' : 'Add Resource')}
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
                    onClose={() => setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: '' })}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Resource"
                    description={`Are you sure you want to delete "${deleteAlert.resourceTitle}"? This action cannot be undone.`}
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

                {/* Video Player */}
                <VideoPlayer
                    isOpen={videoPlayer.isOpen}
                    onClose={() => setVideoPlayer({ isOpen: false, url: '', title: '' })}
                    videoUrl={videoPlayer.url}
                    title={videoPlayer.title}
                />
            </div>
        </div>
    );
}
