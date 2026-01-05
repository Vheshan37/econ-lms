'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, File, ClipboardList, ExternalLink, BookOpen, Save, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { VideoPlayer } from '@/components/VideoPlayer';
import { getFreeResources, createFreeResource, updateFreeResource, deleteFreeResource } from '@/lib/actions/freeResource';
import { getLandingPageContent, updateLandingPageContent } from '@/lib/actions/content';
import { getOLSubjects, createOLSubject, deleteOLSubject } from '@/lib/actions/ol-subject';
import { ResourceType } from '@prisma/client';

interface Resource {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    description: string | null;
    createdAt: Date;
    olSubjectId?: string;
}

interface OLSubject {
    id: string;
    name: string;
    _count?: {
        resources: number;
    }
}

const TABS = [
    { id: 'VIDEO', label: 'Video Lessons', icon: Play, color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'PDF', label: 'PDFs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'PAST_PAPER', label: 'Past Papers', icon: File, color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { id: 'QUIZ', label: 'Quizzes', icon: ClipboardList, color: 'text-green-500', bgColor: 'bg-green-500' },
];

export default function OLResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [subjects, setSubjects] = useState<OLSubject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [newSubjectName, setNewSubjectName] = useState('');

    const [activeTab, setActiveTab] = useState<ResourceType>('VIDEO');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    // Page Settings State
    const [ctaYear, setCtaYear] = useState('2027');
    const [ctaMessage, setCtaMessage] = useState('Want more advanced content? Join our {year} Batch');
    const [heroBadge, setHeroBadge] = useState('Calling all O/L Students');
    const [heroTitle, setHeroTitle] = useState('Start Your A/L Econ Journey Today');
    const [categoryCards, setCategoryCards] = useState([
        { title: 'Video Lessons', description: 'Watch expert video tutorials', icon: 'Play', link: '#videos' },
        { title: 'Past Papers', description: 'Access previous exam papers', icon: 'File', link: '#past-papers' },
        { title: 'Study Guides', description: 'Comprehensive study materials', icon: 'BookOpen', link: '#guides' },
        { title: 'Practice Quizzes', description: 'Test your knowledge', icon: 'ClipboardList', link: '#quizzes' }
    ]);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [isCreatingSubject, setIsCreatingSubject] = useState(false);

    // Form state
    const [resourceType, setResourceType] = useState<ResourceType>('VIDEO');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert Dialog State
    const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; resourceId: string | null; resourceTitle: string; type: 'resource' | 'subject' }>({
        isOpen: false,
        resourceId: null,
        resourceTitle: '',
        type: 'resource'
    });
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });
    const [successAlert, setSuccessAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    // Video Player State
    const [videoPlayer, setVideoPlayer] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: '',
        title: ''
    });

    const handleResourceClick = (resource: Resource) => {
        if (resource.type === 'VIDEO') {
            setVideoPlayer({ isOpen: true, url: resource.url, title: resource.title });
        } else {
            window.open(resource.url, '_blank');
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [subjectsResult, settingsResult] = await Promise.all([
                getOLSubjects(),
                getLandingPageContent('ol-resources')
            ]);

            if (subjectsResult.success && subjectsResult.data) {
                setSubjects(subjectsResult.data);
            } else {
                setErrorAlert({ isOpen: true, message: subjectsResult.error || 'Failed to fetch subjects' });
            }

            if (settingsResult.success && settingsResult.data) {
                const data = settingsResult.data as any;
                if (data.cta) {
                    setCtaYear(data.cta.year || '2027');
                    setCtaMessage(data.cta.message || 'Want more advanced content? Join our {year} Batch');
                }
                if (data.hero) {
                    setHeroBadge(data.hero.badge || 'Calling all O/L Students');
                    setHeroTitle(data.hero.title || 'Start Your A/L Econ Journey Today');
                }
                if (data.categoryCards && Array.isArray(data.categoryCards) && data.categoryCards.length > 0) {
                    // Check if we need to add the video card (migration for existing data)
                    if (data.categoryCards.length === 3 && !data.categoryCards.find((c: any) => c.title === 'Video Lessons')) {
                        const videoCard = { title: 'Video Lessons', description: 'Watch expert video tutorials', icon: 'Play', link: '#videos' };
                        setCategoryCards([videoCard, ...data.categoryCards]);
                    } else {
                        setCategoryCards(data.categoryCards);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorAlert({ isOpen: true, message: 'Failed to fetch data' });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchResources = async () => {
        if (!selectedSubject) return;

        setIsLoading(true);
        try {
            const resourcesResult = await getFreeResources("Ordinary Level", selectedSubject);
            if (resourcesResult.success && resourcesResult.data) {
                setResources(resourcesResult.data);
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchResources();
        } else {
            setResources([]);
        }
    }, [selectedSubject]);

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingSubject(true);
        try {
            const result = await createOLSubject(newSubjectName);
            if (result.success) {
                setSuccessAlert({ isOpen: true, message: 'Subject created successfully' });
                setNewSubjectName('');
                fetchData();
            } else {
                setErrorAlert({ isOpen: true, message: result.error || 'Failed to create subject' });
            }
        } catch (error) {
            console.error("Error creating subject:", error);
            setErrorAlert({ isOpen: true, message: 'An error occurred while creating subject' });
        } finally {
            setIsCreatingSubject(false);
        }
    };

    const handleDeleteSubjectClick = (subject: OLSubject) => {
        setDeleteAlert({
            isOpen: true,
            resourceId: subject.id,
            resourceTitle: subject.name,
            type: 'subject'
        });
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const settingsData = {
                hero: {
                    badge: heroBadge,
                    title: heroTitle
                },
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
        setResourceType('VIDEO');
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
        if (!selectedSubject) {
            setErrorAlert({ isOpen: true, message: 'Please select a subject first' });
            return;
        }

        setIsSubmitting(true);

        try {
            const resourceData = {
                title,
                type: resourceType,
                url,
                description,
                level: "Ordinary Level",
                olSubjectId: selectedSubject
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
                fetchResources();
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
            resourceTitle: resource.title,
            type: 'resource'
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteAlert.resourceId) return;

        try {
            let result;
            if (deleteAlert.type === 'subject') {
                result = await deleteOLSubject(deleteAlert.resourceId);
                // If deleted active subject, clear selection
                if (selectedSubject === deleteAlert.resourceId) {
                    setSelectedSubject(null);
                    setResources([]);
                }
                fetchData();
            } else {
                result = await deleteFreeResource(deleteAlert.resourceId);
                fetchResources(); // Refresh resources instead of fetchData
            }

            if (result.success) {
                setSuccessAlert({ isOpen: true, message: `${deleteAlert.type === 'subject' ? 'Subject' : 'Resource'} deleted successfully` });
            } else {
                setErrorAlert({ isOpen: true, message: result.error || `Failed to delete ${deleteAlert.type}` });
            }
        } catch (error) {
            console.error(`Error deleting ${deleteAlert.type}:`, error);
            setErrorAlert({ isOpen: true, message: `An error occurred while deleting the ${deleteAlert.type}` });
        } finally {
            setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: '', type: 'resource' });
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

                {/* Hero Settings */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800">Hero Section Headers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroBadge">Badge Text</Label>
                            <Input
                                id="heroBadge"
                                value={heroBadge}
                                onChange={(e) => setHeroBadge(e.target.value)}
                                placeholder="Calling all O/L Students"
                                className="bg-white border-gray-300"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="heroTitle">Hero Title</Label>
                            <Textarea
                                id="heroTitle"
                                value={heroTitle}
                                onChange={(e) => setHeroTitle(e.target.value)}
                                placeholder="Start Your A/L Econ Journey Today"
                                rows={2}
                                className="bg-white border-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Settings */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 border-t pt-8">Call-to-Action Banner</h3>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Subject Management Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Subjects</h2>

                {/* Create Subject Form */}
                <form onSubmit={handleCreateSubject} className="flex gap-4 mb-8">
                    <Input
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="Enter new subject name"
                        className="max-w-md"
                    />
                    <Button
                        type="submit"
                        disabled={isCreatingSubject || !newSubjectName.trim()}
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a]"
                    >
                        {isCreatingSubject ? 'Creating...' : 'Create Subject'}
                    </Button>
                </form>

                {/* Subject List / Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject.id)}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedSubject === subject.id
                                ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                : 'border-gray-200 hover:border-[#D4AF37]/50'
                                }`}
                        >
                            <div className="font-semibold text-gray-900 mb-1">{subject.name}</div>
                            <div className="text-xs text-gray-500">
                                {subject._count?.resources || 0} resources
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSubjectClick(subject);
                                }}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Resources Section */}
            {selectedSubject ? (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl font-bold">
                            Resources for <span className="text-[#D4AF37]">{subjects.find(s => s.id === selectedSubject)?.name}</span>
                        </h2>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as ResourceType)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-white text-gray-900 shadow-md'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-[#D4AF37]'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            onClick={handleAddResource}
                            className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 font-bold shadow-lg shadow-[#D4AF37]/30"
                        >
                            <Plus className="w-4 h-4" />
                            Add Resource
                        </Button>
                    </div>

                    {/* Resources Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500">Loading resources...</div>
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} added yet</p>
                            <Button onClick={handleAddResource} variant="outline" className="border-white/20 text-white hover:bg-white/10">
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
                                            className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            onClick={() => handleResourceClick(resource)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl ${tabInfo?.bgColor} bg-opacity-10 relative`}>
                                                    <Icon className={`w-6 h-6 ${tabInfo?.color}`} />
                                                    {resource.type === 'VIDEO' && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="bg-black/10 rounded-full p-1">
                                                                <Play className="w-3 h-3 text-current opacity-50" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditResource(resource);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(resource);
                                                        }}
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
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                        <BookOpen className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Subject Selected</h3>
                    <p className="text-gray-400">Select a subject above to view and manage its resources</p>
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

            <AlertDialog
                isOpen={deleteAlert.isOpen}
                onClose={() => setDeleteAlert({ isOpen: false, resourceId: null, resourceTitle: '', type: 'resource' })}
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
            {/* Video Player */}
            <VideoPlayer
                isOpen={videoPlayer.isOpen}
                onClose={() => setVideoPlayer({ isOpen: false, url: '', title: '' })}
                videoUrl={videoPlayer.url}
                title={videoPlayer.title}
                showWarning={false}
            />
        </div>
    );
}
