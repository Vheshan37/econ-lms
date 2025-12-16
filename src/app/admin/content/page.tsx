'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, Layers, MessageSquare, Zap, Mail, X, Calendar, BookOpen, Clock, MapPin, FileText, Play, ClipboardCheck, Video, Users, Award, Target, TrendingUp, Lightbulb, CheckCircle, Star, GraduationCap, Brain, Sparkles, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
    getLandingPageContent,
    updateLandingPageContent,
    updateAllLandingPageContent,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getModernFeatures,
    createModernFeature,
    updateModernFeature,
    deleteModernFeature,
    getFreeResources,
    createFreeResource,
    updateFreeResource,
    deleteFreeResource
} from '@/lib/actions/content';
import { uploadImage } from '@/lib/actions/upload';
import { PreviewModal } from '@/components/landing/preview/PreviewModal';
import { HeroPreview } from '@/components/landing/preview/HeroPreview';
import { AboutPreview } from '@/components/landing/preview/AboutPreview';
import { ModernFeaturesPreview } from '@/components/landing/preview/ModernFeaturesPreview';
import { TestimonialsPreview } from '@/components/landing/preview/TestimonialsPreview';
import { FreeLessonsPreview } from '@/components/landing/preview/FreeLessonsPreview';
import { ContactPreview } from '@/components/landing/preview/ContactPreview';

export default function ContentManagementPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Icon and Color options for Features
    const FEATURE_ICONS = [
        { name: 'BookOpen', icon: BookOpen, label: 'Book' },
        { name: 'GraduationCap', icon: GraduationCap, label: 'Graduation' },
        { name: 'Video', icon: Video, label: 'Video' },
        { name: 'FileText', icon: FileText, label: 'Document' },
        { name: 'Users', icon: Users, label: 'Users' },
        { name: 'Award', icon: Award, label: 'Award' },
        { name: 'Target', icon: Target, label: 'Target' },
        { name: 'TrendingUp', icon: TrendingUp, label: 'Growth' },
        { name: 'Lightbulb', icon: Lightbulb, label: 'Idea' },
        { name: 'CheckCircle', icon: CheckCircle, label: 'Check' },
        { name: 'Star', icon: Star, label: 'Star' },
        { name: 'Zap', icon: Zap, label: 'Lightning' },
        { name: 'Brain', icon: Brain, label: 'Brain' },
        { name: 'Sparkles', icon: Sparkles, label: 'Sparkles' }
    ];

    const GRADIENT_COLORS = [
        { name: 'Blue', value: 'from-blue-500 to-blue-600', preview: 'bg-gradient-to-r from-blue-500 to-blue-600' },
        { name: 'Purple', value: 'from-purple-500 to-purple-600', preview: 'bg-gradient-to-r from-purple-500 to-purple-600' },
        { name: 'Green', value: 'from-green-500 to-green-600', preview: 'bg-gradient-to-r from-green-500 to-green-600' },
        { name: 'Red', value: 'from-red-500 to-red-600', preview: 'bg-gradient-to-r from-red-500 to-red-600' },
        { name: 'Yellow', value: 'from-yellow-500 to-yellow-600', preview: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
        { name: 'Pink', value: 'from-pink-500 to-pink-600', preview: 'bg-gradient-to-r from-pink-500 to-pink-600' }
    ];

    // General Content State
    const [heroContent, setHeroContent] = useState({
        description: '', // Sinhala description
        studentCount: '', rankCount: '', expCount: '',
        teacherName: '', teacherTitle: '', teacherImage: ''
    });
    const [teacherImageFile, setTeacherImageFile] = useState<File | null>(null);

    const [aboutContent, setAboutContent] = useState({
        sectionSubtitle: '', // "ABOUT THE MENTOR"
        sectionTitle: '', // "Why Choose Quality Econ"
        secondarySubtitle: '', // "සංකීර්ණතාවය සරල බවට පරිවර්තනය කිරීම"
        description: '', // Sinhala description
        features: [] as string[], // Array of feature strings
        quote: '', quoteAuthor: '',
        videoUrl: ''
    });
    const [contactContent, setContactContent] = useState({
        subtitle: '',
        title: '',
        description: '',
        email: '', phone: '', address: '',
        formTitle: '', mapUrl: '',
        officeHours: { title: '', weekdays: '', weekends: '' }
    });

    const [footerContent, setFooterContent] = useState({
        logoText: '', description: '',
        socialLinks: { facebook: '', youtube: '', telegram: '' },
        quickLinks: [] as { title: string; url: string }[],
        contactInfo: { address: '', phone: '', email: '' },
        copyright: ''
    });

    // Banner State
    const [bannerContent, setBannerContent] = useState([
        { id: 1, title: '', subtitle: '', description: '', image: '', color: 'from-yellow-600 to-amber-800' },
        { id: 2, title: '', subtitle: '', description: '', image: '', color: 'from-blue-900 to-slate-900' },
        { id: 3, title: '', subtitle: '', description: '', image: '', color: 'from-emerald-900 to-green-950' },
        { id: 4, title: '', subtitle: '', description: '', image: '', color: 'from-purple-900 to-indigo-950' }
    ]);
    const [bannerImageFiles, setBannerImageFiles] = useState<{ [key: number]: File }>({});

    // Testimonials State
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
    const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', content: '', imageUrl: '', rating: 5, institute: '' });

    // Features State
    const [features, setFeatures] = useState<any[]>([]);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<any | null>(null);
    const [featureForm, setFeatureForm] = useState({ title: '', description: '', icon: '', color: '', order: 0 });

    // Courses and Timetable are managed in dedicated pages, not here

    // Free Resources State
    const [freeResources, setFreeResources] = useState<any[]>([]);
    const [isFreeResourceModalOpen, setIsFreeResourceModalOpen] = useState(false);
    const [editingFreeResource, setEditingFreeResource] = useState<any | null>(null);
    const [freeResourceForm, setFreeResourceForm] = useState({ title: '', type: 'VIDEO', url: '', description: '' });

    // Preview Modal State
    const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; type: 'hero' | 'about' | 'features' | 'testimonials' | 'freeLessons' | 'contact' | null }>({
        isOpen: false,
        type: null
    });

    // Alert State
    const [alert, setAlert] = useState<{ isOpen: boolean; title: string; description: string; type: 'success' | 'error' | 'confirm'; onConfirm?: () => void }>({
        isOpen: false,
        title: '',
        description: '',
        type: 'success'
    });


    const [freeLessonsContent, setFreeLessonsContent] = useState({
        subtitle: '', title: '', description: '',
        ctaText: '', ctaNote: '',
        categories: [
            { title: 'Video Lessons', count: '15+ Free Videos', description: 'Watch comprehensive introductory lessons' },
            { title: 'Past Papers', count: '50+ Papers', description: 'Access previous A/L Economics papers' },
            { title: 'Study Materials', count: '30+ PDFs', description: 'Download structured notes and summaries' },
            { title: 'Practice Quizzes', count: '20+ Quizzes', description: 'Test your knowledge with interactive quizzes' }
        ],
        featuredVideo: { title: 'Introduction to Microeconomics', duration: '45 min', views: '2.5k views' },
        featuredDoc: { title: '2023 A/L Past Paper', subtitle: 'With marking scheme' },
        featuredQuiz: { title: 'Supply & Demand Quiz', duration: '20 min', questionCount: '15 Questions' }
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const [landingData, testimonialData, featureData, freeResourceData] = await Promise.all([
                getLandingPageContent(),
                getTestimonials(),
                getModernFeatures(),
                getFreeResources()
            ]);

            if (landingData.success && landingData.data) {
                const data = landingData.data as any;
                if (data.hero) setHeroContent(data.hero);
                if (data.about) setAboutContent(data.about);
                if (data.freeLessons) setFreeLessonsContent(data.freeLessons);
                if (data.contact) setContactContent(data.contact);
                if (data.footer) setFooterContent(data.footer);
                if (data.banners && Array.isArray(data.banners)) setBannerContent(data.banners);
            }

            if (testimonialData.success) setTestimonials(testimonialData.data || []);
            if (featureData.success) setFeatures(featureData.data || []);
            if (freeResourceData.success) setFreeResources(freeResourceData.data || []);
        } catch (error) {
            console.error('Error fetching content:', error);
            setAlert({ isOpen: true, title: 'Error', description: 'Failed to fetch content', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        try {
            let teacherImageUrl = heroContent.teacherImage;

            if (teacherImageFile) {
                const formData = new FormData();
                formData.append('file', teacherImageFile);
                formData.append('customName', 'teacher-hero-image'); // Enforce fixed filename
                const uploadResult = await uploadImage(formData);
                if (uploadResult.success && uploadResult.url) {
                    teacherImageUrl = uploadResult.url;
                } else {
                    throw new Error(uploadResult.error || 'Failed to upload image');
                }
            }

            let videoUrl = aboutContent.videoUrl;

            // Handle Video Upload
            if (videoFile) {
                const formData = new FormData();
                formData.append('file', videoFile);
                formData.append('customName', 'about-trailer-video'); // Fixed name for simplicity, or timestamped
                // For video, we might want to keep the original extension or assume mp4
                // The uploadImage action handles extension preservation if customName is provided without one?
                // Actually uploadImage expects customName to NOT have extension if we want it to auto-append?
                // Let's re-read upload.ts logic.
                // upload.ts: if customName, it uses customName + original extension.
                // So 'about-trailer-video' is safe.

                // Use a timestamp to avoid caching issues with the same filename if updated
                formData.append('customName', `about-trailer-${new Date().getTime()}`);

                const vidResult = await uploadImage(formData);
                if (vidResult.success && vidResult.url) {
                    videoUrl = vidResult.url;
                }
            }

            const result = await updateAllLandingPageContent({
                hero: { ...heroContent, teacherImage: teacherImageUrl },
                about: { ...aboutContent, videoUrl },
                freeLessons: freeLessonsContent,
                contact: contactContent,
                footer: footerContent
            });

            if (result.success) {
                setAlert({ isOpen: true, title: 'Success', description: 'General content updated successfully', type: 'success' });
                // Clear the file selection after successful save
                setTeacherImageFile(null);
                setVideoFile(null);
                // Update local state with the new URL AND timestamp to force refresh preview
                setHeroContent(prev => ({ ...prev, teacherImage: `${teacherImageUrl}?t=${new Date().getTime()}` }));
                setAboutContent(prev => ({ ...prev, videoUrl }));
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(error);
            setAlert({ isOpen: true, title: 'Error', description: 'Failed to update content', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Store file for upload on save
            setTeacherImageFile(file);

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroContent(prev => ({ ...prev, teacherImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            // Create object URL for preview
            const previewUrl = URL.createObjectURL(file);
            setAboutContent(prev => ({ ...prev, videoUrl: previewUrl }));
        }
    };

    // --- Testimonial Handlers ---

    // ... (rest of the file) ...

    // In the UI Render part (needs separate chunk or manual merge logic, better to do separate replace call for UI)
    // Actually, I can use multi_replace for this. Let's start with just the handler update in this tool call?
    // No, I should do multi_replace if I want to touch multiple parts.
    // The user asked to remove 'Section Subtitle', 'Section Title'.
    // And add video upload input.
    // I will cancel this and use multi_replace.

    const handleSaveBanners = async () => {
        setIsSaving(true);
        try {
            const updatedBanners = [...bannerContent];

            // Process image uploads for each banner
            for (let i = 0; i < updatedBanners.length; i++) {
                const file = bannerImageFiles[i];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    // Unique name for banner images
                    formData.append('customName', `banner-slide-${i + 1}-${new Date().getTime()}`);

                    const uploadResult = await uploadImage(formData);
                    if (uploadResult.success && uploadResult.url) {
                        // Clean URL (remove old query params if any)
                        let url = uploadResult.url;
                        if (url.startsWith('/uploads/')) {
                            url = url.split('?')[0];
                        }
                        updatedBanners[i].image = url;
                    }
                }
            }

            const result = await updateLandingPageContent('banners', updatedBanners);

            if (result.success) {
                setAlert({ isOpen: true, title: 'Success', description: 'Banners updated successfully', type: 'success' });
                // Clear the file selections
                setBannerImageFiles({});
                // Force refresh local state with timestamp to bust cache if needed
                setBannerContent(updatedBanners.map(b => ({ ...b, image: b.image.includes('?') ? b.image : `${b.image}?t=${new Date().getTime()}` })));
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(error);
            setAlert({ isOpen: true, title: 'Error', description: 'Failed to update banners', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleBannerImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            // Store file for upload
            setBannerImageFiles(prev => ({ ...prev, [index]: file }));

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const newBanners = [...bannerContent];
                newBanners[index] = { ...newBanners[index], image: reader.result as string };
                setBannerContent(newBanners);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFreeResourceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const result = editingFreeResource
                ? await updateFreeResource(editingFreeResource.id, freeResourceForm as any)
                : await createFreeResource(freeResourceForm as any);

            if (result.success) {
                setAlert({ isOpen: true, title: 'Success', description: `Resource ${editingFreeResource ? 'updated' : 'added'} successfully`, type: 'success' });
                setIsFreeResourceModalOpen(false);
                fetchContent();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setAlert({ isOpen: true, title: 'Error', description: 'Failed to save resource', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteFreeResource = async (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Confirm Delete',
            description: 'Are you sure you want to delete this resource?',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    const result = await deleteFreeResource(id);
                    if (result.success) {
                        setAlert({ isOpen: true, title: 'Success', description: 'Resource deleted successfully', type: 'success' });
                        fetchContent();
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    setAlert({ isOpen: true, title: 'Error', description: 'Failed to delete resource', type: 'error' });
                }
            }
        });
    };
    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = editingTestimonial
            ? await updateTestimonial(editingTestimonial.id, testimonialForm)
            : await createTestimonial(testimonialForm);

        if (result.success) {
            await fetchContent();
            setIsTestimonialModalOpen(false);
            setEditingTestimonial(null);
            setTestimonialForm({ name: '', role: '', content: '', imageUrl: '', rating: 5, institute: '' });
            showAlert('Success', 'Testimonial saved successfully', 'success');
        } else {
            showAlert('Error', 'Failed to save testimonial', 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteTestimonial = (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Delete Testimonial',
            description: 'Are you sure you want to delete this testimonial?',
            type: 'confirm',
            onConfirm: async () => {
                const result = await deleteTestimonial(id);
                if (result.success) {
                    await fetchContent();
                    showAlert('Success', 'Testimonial deleted successfully', 'success');
                } else {
                    showAlert('Error', 'Failed to delete testimonial', 'error');
                }
            }
        });
    };

    // --- Feature Handlers ---

    const handleFeatureSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = editingFeature
            ? await updateModernFeature(editingFeature.id, featureForm)
            : await createModernFeature(featureForm);

        if (result.success) {
            await fetchContent();
            setIsFeatureModalOpen(false);
            setEditingFeature(null);
            setFeatureForm({ title: '', description: '', icon: '', color: '', order: 0 });
            showAlert('Success', 'Feature saved successfully', 'success');
        } else {
            showAlert('Error', 'Failed to save feature', 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteFeature = (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Delete Feature',
            description: 'Are you sure you want to delete this feature?',
            type: 'confirm',
            onConfirm: async () => {
                const result = await deleteModernFeature(id);
                if (result.success) {
                    await fetchContent();
                    showAlert('Success', 'Feature deleted successfully', 'success');
                } else {
                    showAlert('Error', 'Failed to delete feature', 'error');
                }
            }
        });
    };

    // Course and Timetable handlers removed - managed in dedicated pages

    const showAlert = (title: string, description: string, type: 'success' | 'error' | 'confirm') => {
        setAlert(prev => ({ ...prev, isOpen: true, title, description, type }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading content...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                            <Layers className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Site Content</h1>
                            <p className="text-gray-400 text-lg">Manage landing page content</p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm h-14">
                    <TabsTrigger value="general" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <Layers className="w-4 h-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="free-lessons" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <BookOpen className="w-4 h-4" /> Free Lessons
                    </TabsTrigger>
                    <TabsTrigger value="banners" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <ImageIcon className="w-4 h-4" /> Banners
                    </TabsTrigger>
                    <TabsTrigger value="features" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <Zap className="w-4 h-4" /> Features
                    </TabsTrigger>
                    <TabsTrigger value="testimonials" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <MessageSquare className="w-4 h-4" /> Testimonials
                    </TabsTrigger>
                    <TabsTrigger value="contact" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <Mail className="w-4 h-4" /> Contact
                    </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                    {/* Hero Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setPreviewModal({ isOpen: true, type: 'hero' })}
                                    variant="outline"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> Preview
                                </Button>
                                <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Titles removed as per request */}
                            <div className="space-y-2">
                                <Label className="text-gray-800">Description</Label>
                                <Textarea className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.description} onChange={e => setHeroContent({ ...heroContent, description: e.target.value })} rows={3} placeholder="දිවයිනේ ප්‍රථම ශ්‍රේණිගත කරුවන්..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Student Count</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.studentCount} onChange={e => setHeroContent({ ...heroContent, studentCount: e.target.value })} placeholder="500+" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Rank Count</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.rankCount} onChange={e => setHeroContent({ ...heroContent, rankCount: e.target.value })} placeholder="50+" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Experience Count</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.expCount} onChange={e => setHeroContent({ ...heroContent, expCount: e.target.value })} placeholder="10+" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Teacher Name</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.teacherName} onChange={e => setHeroContent({ ...heroContent, teacherName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Teacher Title</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={heroContent.teacherTitle} onChange={e => setHeroContent({ ...heroContent, teacherTitle: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Teacher Image</Label>
                                    <div className="flex items-center gap-4">
                                        {heroContent.teacherImage && (
                                            <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                                                <img src={heroContent.teacherImage} alt="Teacher" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <Input
                                                id="teacher-image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-2 file:text-sm hover:file:bg-gray-200 cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Select an image to upload</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">About Section</h2>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setPreviewModal({ isOpen: true, type: 'about' })}
                                    variant="outline"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> Preview
                                </Button>
                                <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Secondary Subtitle</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={aboutContent.secondarySubtitle} onChange={e => setAboutContent({ ...aboutContent, secondarySubtitle: e.target.value })} placeholder="සංකීර්ණතාවය සරල බවට..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Trailer Video</Label>
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                            className="bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-2 file:text-sm hover:file:bg-gray-200 cursor-pointer"
                                        />
                                        {aboutContent.videoUrl && (
                                            <p className="text-xs text-green-600 truncate">
                                                Current: {aboutContent.videoUrl.split('/').pop()}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-yellow-500"></span>
                                            Max size: 50MB. Supports MP4, WebM.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-800">Description</Label>
                                <Textarea className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={aboutContent.description} onChange={e => setAboutContent({ ...aboutContent, description: e.target.value })} rows={4} placeholder="දශකයකට වැඩි ගුරු අත්දැකීම්..." />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-800">Features List</Label>
                                    <Button
                                        type="button"
                                        onClick={() => setAboutContent({ ...aboutContent, features: [...aboutContent.features, ''] })}
                                        className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F] h-8 px-3 text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Feature
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {aboutContent.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] flex-1"
                                                value={feature}
                                                onChange={e => {
                                                    const newFeatures = [...aboutContent.features];
                                                    newFeatures[index] = e.target.value;
                                                    setAboutContent({ ...aboutContent, features: newFeatures });
                                                }}
                                                placeholder={`Feature ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const newFeatures = aboutContent.features.filter((_, i) => i !== index);
                                                    setAboutContent({ ...aboutContent, features: newFeatures });
                                                }}
                                                className="h-10 px-3 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {aboutContent.features.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">Click &quot;Add Feature&quot; to add features</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Quote</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={aboutContent.quote} onChange={e => setAboutContent({ ...aboutContent, quote: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Quote Author</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={aboutContent.quoteAuthor} onChange={e => setAboutContent({ ...aboutContent, quoteAuthor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">

                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Banners Tab */}
                <TabsContent value="banners" className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Banner Management</h2>
                            <Button onClick={() => handleSaveBanners()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bannerContent.map((banner, index) => (
                                <div key={banner.id} className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-700">Slide {index + 1}</h3>
                                        <div className={`h-6 w-6 rounded-full bg-linear-to-br ${banner.color}`} title="Background Gradient Preview" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Title</Label>
                                        <Input
                                            className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                            value={banner.title}
                                            onChange={e => {
                                                const newBanners = [...bannerContent];
                                                newBanners[index].title = e.target.value;
                                                setBannerContent(newBanners);
                                            }}
                                            placeholder="Slide Title"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Subtitle</Label>
                                        <Input
                                            className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                            value={banner.subtitle}
                                            onChange={e => {
                                                const newBanners = [...bannerContent];
                                                newBanners[index].subtitle = e.target.value;
                                                setBannerContent(newBanners);
                                            }}
                                            placeholder="Slide Subtitle"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Description</Label>
                                        <Textarea
                                            className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                            value={banner.description}
                                            onChange={e => {
                                                const newBanners = [...bannerContent];
                                                newBanners[index].description = e.target.value;
                                                setBannerContent(newBanners);
                                            }}
                                            rows={2}
                                            placeholder="Slide Description"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Background Image</Label>
                                        <div className="space-y-3">
                                            {banner.image && (
                                                <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={banner.image} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleBannerImageUpload(e, index)}
                                                className="bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md file:px-2 file:text-sm hover:file:bg-gray-200 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Free Lessons Tab */}
                <TabsContent value="free-lessons" className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setPreviewModal({ isOpen: true, type: 'freeLessons' })}
                                    variant="outline"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> Preview Section
                                </Button>
                                <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Subtitle</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.subtitle} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, subtitle: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Title</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, title: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-800">Description</Label>
                                <Textarea className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.description} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">CTA Text</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.ctaText} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, ctaText: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">CTA Note</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.ctaNote} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, ctaNote: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Resource Categories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {freeLessonsContent.categories.map((cat, idx) => (
                                <div key={idx} className="p-4 border border-gray-200 rounded-xl space-y-3">
                                    <h3 className="font-semibold text-gray-700">{cat.title} Card</h3>
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Title</Label>
                                        <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={cat.title} onChange={e => {
                                            const newCats = [...freeLessonsContent.categories];
                                            newCats[idx].title = e.target.value;
                                            setFreeLessonsContent({ ...freeLessonsContent, categories: newCats });
                                        }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Count Text</Label>
                                        <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={cat.count} onChange={e => {
                                            const newCats = [...freeLessonsContent.categories];
                                            newCats[idx].count = e.target.value;
                                            setFreeLessonsContent({ ...freeLessonsContent, categories: newCats });
                                        }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Description</Label>
                                        <Textarea className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={cat.description} onChange={e => {
                                            const newCats = [...freeLessonsContent.categories];
                                            newCats[idx].description = e.target.value;
                                            setFreeLessonsContent({ ...freeLessonsContent, categories: newCats });
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Featured Previews */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Previews</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Video */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Video Preview</h3>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredVideo.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredVideo.duration} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, duration: e.target.value } })} placeholder="Duration" />
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredVideo.views} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, views: e.target.value } })} placeholder="Views" />
                            </div>
                            {/* Doc */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Document Preview</h3>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredDoc.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredDoc: { ...freeLessonsContent.featuredDoc, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredDoc.subtitle} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredDoc: { ...freeLessonsContent.featuredDoc, subtitle: e.target.value } })} placeholder="Subtitle" />
                            </div>
                            {/* Quiz */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Quiz Preview</h3>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredQuiz.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredQuiz.duration} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, duration: e.target.value } })} placeholder="Duration" />
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeLessonsContent.featuredQuiz.questionCount} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, questionCount: e.target.value } })} placeholder="Questions" />
                            </div>
                        </div>
                    </div>

                    {/* Resource Library */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Resource Library</h2>
                            <Button onClick={() => { setEditingFreeResource(null); setFreeResourceForm({ title: '', type: 'VIDEO', url: '', description: '' }); setIsFreeResourceModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                <Plus className="w-4 h-4 mr-2" /> Add Resource
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {freeResources.map((resource) => (
                                <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                                            {resource.type === 'VIDEO' && <Play className="w-5 h-5 text-red-500" />}
                                            {resource.type === 'PDF' && <FileText className="w-5 h-5 text-blue-500" />}
                                            {resource.type === 'PAST_PAPER' && <BookOpen className="w-5 h-5 text-green-500" />}
                                            {resource.type === 'QUIZ' && <ClipboardCheck className="w-5 h-5 text-purple-500" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{resource.title}</h3>
                                            <p className="text-xs text-gray-500">{resource.type} • {resource.url}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingFreeResource(resource); setFreeResourceForm(resource); setIsFreeResourceModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteFreeResource(resource.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>


                {/* Features Tab */}
                <TabsContent value="features" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button
                            onClick={() => setPreviewModal({ isOpen: true, type: 'features' })}
                            variant="outline"
                            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                        >
                            <Eye className="w-4 h-4 mr-2" /> Preview Section
                        </Button>
                        <Button onClick={() => { setEditingFeature(null); setFeatureForm({ title: '', description: '', icon: '', color: '', order: features.length }); setIsFeatureModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                            <Plus className="w-4 h-4 mr-2" /> Add Feature
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div key={feature.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${feature.color || 'from-gray-500 to-gray-600'}`}>
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingFeature(feature); setFeatureForm(feature); setIsFeatureModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteFeature(feature.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button
                            onClick={() => setPreviewModal({ isOpen: true, type: 'testimonials' })}
                            variant="outline"
                            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                        >
                            <Eye className="w-4 h-4 mr-2" /> Preview Section
                        </Button>
                        <Button onClick={() => { setEditingTestimonial(null); setTestimonialForm({ name: '', role: '', content: '', imageUrl: '', rating: 5, institute: '' }); setIsTestimonialModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                            {testimonial.imageUrl && <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingTestimonial(testimonial); setTestimonialForm(testimonial); setIsTestimonialModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteTestimonial(testimonial.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-2 flex text-yellow-500 text-xs">
                                    {'★'.repeat(testimonial.rating || 5)}
                                </div>
                                <p className="text-gray-600 text-sm italic mb-2">&quot;{testimonial.content}&quot;</p>
                                {testimonial.institute && <p className="text-xs text-gray-400 text-right">- {testimonial.institute}</p>}
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setPreviewModal({ isOpen: true, type: 'contact' })}
                                    variant="outline"
                                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> Preview Section
                                </Button>
                                <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-800">Form Title</Label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.formTitle} onChange={e => setContactContent({ ...contactContent, formTitle: e.target.value })} placeholder="Start Your AL Economics Journey Today" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-800">Map URL</Label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.mapUrl} onChange={e => setContactContent({ ...contactContent, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Email Address</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.email} onChange={e => setContactContent({ ...contactContent, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Phone Number</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.phone} onChange={e => setContactContent({ ...contactContent, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Address</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.address} onChange={e => setContactContent({ ...contactContent, address: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-800">Office Hours Title</Label>
                                <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.officeHours.title} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, title: e.target.value } })} placeholder="Office Hours" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Weekdays Hours</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.officeHours.weekdays} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, weekdays: e.target.value } })} placeholder="Monday - Friday: 9:00 AM - 6:00 PM" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Weekends Hours</Label>
                                    <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={contactContent.officeHours.weekends} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, weekends: e.target.value } })} placeholder="Saturday: 9:00 AM - 4:00 PM" />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Testimonial Modal */}
            <AnimatePresence>
                {isTestimonialModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Student Name</Label>
                                    <Input required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Role/Achievement</Label>
                                        <Input required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="District Rank 1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Institute</Label>
                                        <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.institute} onChange={e => setTestimonialForm({ ...testimonialForm, institute: e.target.value })} placeholder="Colombo" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Testimonial Content</Label>
                                    <Textarea required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.content} onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })} rows={4} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Image URL</Label>
                                        <Input className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.imageUrl} onChange={e => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Rating (1-5)</Label>
                                        <Input type="number" min="1" max="5" required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsTestimonialModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Feature Modal */}
            <AnimatePresence>
                {isFeatureModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-gray-900">{editingFeature ? 'Edit Feature' : 'Add Feature'}</h2>
                                <button onClick={() => setIsFeatureModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleFeatureSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Feature Title</Label>
                                    <Input required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={featureForm.title} onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Description</Label>
                                    <Textarea required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={featureForm.description} onChange={e => setFeatureForm({ ...featureForm, description: e.target.value })} rows={3} />
                                </div>

                                {/* Icon Picker */}
                                <div className="space-y-3">
                                    <Label className="text-gray-800">Select Icon</Label>
                                    <div className="grid grid-cols-7 gap-2">
                                        {FEATURE_ICONS.map((iconItem) => {
                                            const IconComponent = iconItem.icon;
                                            const isSelected = featureForm.icon === iconItem.name;
                                            return (
                                                <button
                                                    key={iconItem.name}
                                                    type="button"
                                                    onClick={() => setFeatureForm({ ...featureForm, icon: iconItem.name })}
                                                    className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${isSelected
                                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg'
                                                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                                                        }`}
                                                    title={iconItem.label}
                                                >
                                                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {featureForm.icon && (
                                        <p className="text-sm text-gray-600">Selected: {FEATURE_ICONS.find(i => i.name === featureForm.icon)?.label}</p>
                                    )}
                                </div>

                                {/* Color Picker */}
                                <div className="space-y-3">
                                    <Label className="text-gray-800">Select Gradient Color</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {GRADIENT_COLORS.map((colorItem) => {
                                            const isSelected = featureForm.color === colorItem.value;
                                            return (
                                                <button
                                                    key={colorItem.value}
                                                    type="button"
                                                    onClick={() => setFeatureForm({ ...featureForm, color: colorItem.value })}
                                                    className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${isSelected
                                                        ? 'border-[#D4AF37] shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className={`h-12 rounded-lg ${colorItem.preview}`} />
                                                    <p className="text-xs font-medium text-gray-700 mt-2 text-center">{colorItem.name}</p>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 bg-[#D4AF37] rounded-full p-1">
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Preview */}
                                {featureForm.icon && featureForm.color && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-800">Preview</Label>
                                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl bg-gradient-to-r ${featureForm.color}`}>
                                                    {(() => {
                                                        const IconComponent = FEATURE_ICONS.find(i => i.name === featureForm.icon)?.icon;
                                                        return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900">{featureForm.title || 'Feature Title'}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{featureForm.description || 'Feature description'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-gray-800">Order</Label>
                                    <Input type="number" required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={featureForm.order} onChange={e => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <Button type="button" variant="outline" onClick={() => setIsFeatureModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : (editingFeature ? 'Update Feature' : 'Add Feature')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Course, Institute, and Timetable modals removed - managed in dedicated pages */}

            {/* Free Resource Modal */}
            <AnimatePresence>
                {isFreeResourceModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{editingFreeResource ? 'Edit Resource' : 'Add Resource'}</h2>
                                <button onClick={() => setIsFreeResourceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleFreeResourceSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Title</Label>
                                    <Input required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeResourceForm.title} onChange={e => setFreeResourceForm({ ...freeResourceForm, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Type</Label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                        value={freeResourceForm.type}
                                        onChange={(e) => setFreeResourceForm({ ...freeResourceForm, type: e.target.value as 'VIDEO' | 'PDF' | 'PAST_PAPER' | 'QUIZ' })}
                                    >
                                        <option value="VIDEO">Video</option>
                                        <option value="PDF">PDF</option>
                                        <option value="PAST_PAPER">Past Paper</option>
                                        <option value="QUIZ">Quiz</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">URL</Label>
                                    <Input required className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeResourceForm.url} onChange={e => setFreeResourceForm({ ...freeResourceForm, url: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-800">Description</Label>
                                    <Textarea className="bg-white border-gray-300 text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]" value={freeResourceForm.description} onChange={e => setFreeResourceForm({ ...freeResourceForm, description: e.target.value })} rows={3} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsFreeResourceModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : (editingFreeResource ? 'Update Resource' : 'Add Resource')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Alert Dialog */}
            <AnimatePresence>
                {alert.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                            <div className="p-6 text-center space-y-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${alert.type === 'success' ? 'bg-green-100 text-green-600' : alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {alert.type === 'success' ? <Zap className="w-6 h-6" /> : alert.type === 'error' ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{alert.title}</h3>
                                    <p className="text-gray-500 mt-2">{alert.description}</p>
                                </div>
                                <div className="flex gap-3 justify-center pt-2">
                                    {alert.type === 'confirm' ? (
                                        <>
                                            <Button variant="outline" onClick={() => setAlert(prev => ({ ...prev, isOpen: false }))}>Cancel</Button>
                                            <Button onClick={() => { alert.onConfirm?.(); setAlert(prev => ({ ...prev, isOpen: false })); }} className="bg-red-600 text-white hover:bg-red-700">Confirm</Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => setAlert(prev => ({ ...prev, isOpen: false }))} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">Close</Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Modals */}
            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'hero'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="Hero Section"
            >
                <HeroPreview data={heroContent} />
            </PreviewModal>

            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'about'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="About Section"
            >
                <AboutPreview data={aboutContent} />
            </PreviewModal>

            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'features'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="Modern Features Section"
            >
                <ModernFeaturesPreview data={features} />
            </PreviewModal>

            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'testimonials'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="Testimonials Section"
            >
                <TestimonialsPreview data={testimonials} />
            </PreviewModal>

            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'freeLessons'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="Free Lessons Section"
            >
                <FreeLessonsPreview data={freeLessonsContent} freeResources={freeResources} />
            </PreviewModal>

            <PreviewModal
                isOpen={previewModal.isOpen && previewModal.type === 'contact'}
                onClose={() => setPreviewModal({ isOpen: false, type: null })}
                title="Contact Section"
            >
                <ContactPreview data={contactContent} />
            </PreviewModal>
        </div>
    );
}
