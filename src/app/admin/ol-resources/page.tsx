'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, File, ClipboardList, ExternalLink, BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { getFreeResources, createFreeResource, updateFreeResource, deleteFreeResource } from '@/lib/actions/freeResource';
import { getLandingPageContent, updateLandingPageContent } from '@/lib/actions/content';
import { ResourceType } from '@prisma/client';

interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    description: string | null;
    createdAt: Date;
}

const TABS = [
    { id: 'PDF', label: 'PDFs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'PAST_PAPER', label: 'Past Papers', icon: File, color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { id: 'QUIZ', label: 'Quizzes', icon: ClipboardList, color: 'text-green-500', bgColor: 'bg-green-500' },
];

export default function OLResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [activeTab, setActiveTab] = useState<ResourceType>('PDF');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    // Page Settings State
    const [ctaYear, setCtaYear] = useState('2027');
    const [ctaMessage, setCtaMessage] = useState('Want more advanced content? Join our {year} Batch');
    const [categoryCards, setCategoryCards] = useState([
        { title: 'Past Papers', description: 'Access previous exam papers', icon: 'File', link: '#past-papers' },
        { title: 'Study Guides', description: 'Comprehensive study materials', icon: 'BookOpen', link: '#guides' },
        { title: 'Practice Quizzes', description: 'Test your knowledge', icon: 'ClipboardList', link: '#quizzes' }
    ]);
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Form state
    const [resourceType, setResourceType] = useState<ResourceType>('PDF');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
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
    const [successAlert, setSuccessAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resourcesResult, settingsResult] = await Promise.all([
                getFreeResources("Ordinary Level"),
                getLandingPageContent('ol-resources')
            ]);

            if (resourcesResult.success && resourcesResult.data) {
                setResources(resourcesResult.data);
            } else {
                setErrorAlert({ isOpen: true, message: resourcesResult.error || 'Failed to fetch resources' });
            }

            if (settingsResult.success && settingsResult.data) {
                const data = settingsResult.data as any;
                if (data.cta) {
                    setCtaYear(data.cta.year || '2027');
                    setCtaMessage(data.cta.message || 'Want more advanced content? Join our {year} Batch');
                }
                if (data.categoryCards) {
                    setCategoryCards(data.categoryCards);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorAlert({ isOpen: true, message: 'Failed to fetch data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const settingsData = {
                cta: {
                    year: ctaYear,
                    message: ctaMessage
                },
                categoryCards
            };

            const result = await updateLandingPageContent('ol-resources', settingsData);

            if (result.success) {
                setSuccessAlert({ isOpen: true, message: 'Page settings saved successfully' });
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to save settings' });
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setErrorAlert({ isOpen: true, message: 'An error occurred while saving settings' });
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleAddResource = () => {
        setIsAddingResource(true);
        setEditingResource(null);
        setResourceType('PDF');
        setTitle('');
        setUrl('');
        setDescription('');
    };

    const handleEditResource = (resource: Resource) => {
        setEditingResource(resource);
        setIsAddingResource(true);
        setResourceType(resource.type);
        setTitle(resource.title);
        setUrl(resource.url);
        setDescription(resource.description || '');
    };

    const handleCloseModal = () => {
        setIsAddingResource(false);
        setEditingResource(null);
        setTitle('');
        setUrl('');
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const resourceData = {
                title,
                type: resourceType,
                url,
                description,
                level: "Ordinary Level"
            };

            let result;
            if (editingResource) {
                result = await updateFreeResource(editingResource.id, resourceData);
            } else {
                result = await createFreeResource(resourceData);
            }

            if (result.success) {
                setSuccessAlert({ isOpen: true, message: `Resource ${editingResource ? 'updated' : 'created'} successfully` });
                handleCloseModal();
                fetchData();
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to save resource' });
            }
        } catch (error) {
            console.error("Error saving resource:", error);
            setErrorAlert({ isOpen: true, message: 'An error occurred while saving the resource' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (resource: Resource) => {
        setDeleteAlert({
            isOpen: true,
            resourceId: resource.id,
            resourceTitle: resource.title
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteAlert.resourceId) return;

        try {
            const result = await deleteFreeResource(deleteAlert.resourceId);
            if (result.success) {
                setSuccessAlert({ isOpen: true, message: 'Resource deleted successfully' });
                fetchData();
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to delete resource' });
            }
        } catch (error) {
            console.error("Error deleting resource:", error);
            setErrorAlert({ isOpen: true, message: 'An error occurred while deleting the resource' });
        } finally {
            setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: '' });
        }
    };

    const filteredResources = resources.filter(r => r.type === activeTab);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">O/L Free Resources</h1>
                            <p className="text-gray-400">Manage Ordinary Level free resources for students</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleAddResource}
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-12 px-6 font-bold shadow-lg shadow-[#D4AF37]/30"
                    >
                        <Plus className="w-5 h-5" />
                        Add Resource
                    </Button>
                </div>
            </div>

            {/* Page Settings Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Page Settings</h2>
                        <p className="text-sm text-gray-500">Manage the CTA and category cards for the O/L landing page</p>
                    </div>
                    <Button
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSavingSettings ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>

                {/* CTA Settings */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800">Call-to-Action Banner</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ctaYear">Batch Year</Label>
                            <Input
                                id="ctaYear"
                                value={ctaYear}
                                onChange={(e) => setCtaYear(e.target.value)}
                                placeholder="2027"
                                className="bg-white border-gray-300"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="ctaMessage">CTA Message (use {"{year}"} for dynamic year)</Label>
                            <Textarea
                                id="ctaMessage"
                                value={ctaMessage}
                                onChange={(e) => setCtaMessage(e.target.value)}
                                placeholder="Want more advanced content? Join our {year} Batch"
                                rows={2}
                                className="bg-white border-gray-300"
                            />
                            <p className="text-xs text-gray-500">
                                Preview: {ctaMessage.replace('{year}', ctaYear)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Category Cards */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Category Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {categoryCards.map((card, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-500">Card {index + 1}</span>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Title</Label>
                                    <Input
                                        value={card.title}
                                        onChange={(e) => {
                                            const newCards = [...categoryCards];
                                            newCards[index].title = e.target.value;
                                            setCategoryCards(newCards);
                                        }}
                                        placeholder="Card title"
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Description</Label>
                                    <Textarea
                                        value={card.description}
                                        onChange={(e) => {
                                            const newCards = [...categoryCards];
                                            newCards[index].description = e.target.value;
                                            setCategoryCards(newCards);
                                        }}
                                        placeholder="Card description"
                                        rows={2}
                                        className="text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Icon Name</Label>
                                    <Input
                                        value={card.icon}
                                        onChange={(e) => {
                                            const newCards = [...categoryCards];
                                            newCards[index].icon = e.target.value;
                                            setCategoryCards(newCards);
                                        }}
                                        placeholder="File, BookOpen, etc."
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Link</Label>
                                    <Input
                                        value={card.link}
                                        onChange={(e) => {
                                            const newCards = [...categoryCards];
                                            newCards[index].link = e.target.value;
                                            setCategoryCards(newCards);
                                        }}
                                        placeholder="#section or /page"
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ResourceType)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${activeTab === tab.id
                                ? 'text-[#1a1a1a]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.bgColor}`}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading resources...</div>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} yet</p>
                    <Button onClick={handleAddResource} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Resource
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredResources.map((resource, index) => {
                            const tabInfo = TABS.find(t => t.id === resource.type);
                            const Icon = tabInfo?.icon || FileText;
                            return (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${tabInfo?.bgColor} bg-opacity-10`}>
                                            <Icon className={`w-6 h-6 ${tabInfo?.color}`} />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditResource(resource)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(resource)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                                    {resource.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                                    )}

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B5952F] font-medium"
                                    >
                                        View Resource
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Add/Edit Resource Modal */}
            <AnimatePresence>
                {isAddingResource && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Resource Type</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {TABS.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setResourceType(tab.id as ResourceType)}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${resourceType === tab.id
                                                        ? `border-${tab.bgColor.replace('bg-', '')} bg-opacity-10`
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Icon className={`w-6 h-6 ${resourceType === tab.id ? tab.color : 'text-gray-400'}`} />
                                                    <span className={`text-sm font-medium ${resourceType === tab.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {tab.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter resource title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="url">URL</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com/resource"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the resource"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseModal}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a]"
                                    >
                                        {isSubmitting ? 'Saving...' : (editingResource ? 'Update Resource' : 'Add Resource')}
                                    </Button>
                                </div>
                            </form>
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

            {/* Success Alert */}
            <AlertDialog
                isOpen={successAlert.isOpen}
                onClose={() => setSuccessAlert({ isOpen: false, message: '' })}
                title="Success"
                description={successAlert.message}
                type="success"
                cancelText="Close"
            />
        </div>
    );
}
