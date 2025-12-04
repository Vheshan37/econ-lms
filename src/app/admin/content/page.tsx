'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, Layers, MessageSquare, Zap, Mail, X, Calendar, BookOpen, Clock, MapPin, FileText, Play, ClipboardCheck } from 'lucide-react';
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
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getInstitutes,
    createInstitute,
    updateInstitute,
    deleteInstitute,
    createTimetable,
    deleteTimetable,
    getFreeResources,
    createFreeResource,
    updateFreeResource,
    deleteFreeResource
} from '@/lib/actions/content';

export default function ContentManagementPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // General Content State
    const [heroContent, setHeroContent] = useState({
        title: '', subtitle: '', ctaText: '',
        badge: '', studentCount: '', rankCount: '', expCount: '',
        teacherName: '', teacherTitle: '', teacherImage: ''
    });
    const [aboutContent, setAboutContent] = useState({
        title: '', description: '',
        subtitle: '', features: '', quote: '', quoteAuthor: '', videoPlaceholder: ''
    });
    const [contactContent, setContactContent] = useState({
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

    // Courses State
    const [courses, setCourses] = useState<any[]>([]);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [courseForm, setCourseForm] = useState({ year: '', title: '', status: '', description: '', schedule: '', color: '', order: 0 });

    // Institutes & Timetable State
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [isInstituteModalOpen, setIsInstituteModalOpen] = useState(false);
    const [editingInstitute, setEditingInstitute] = useState<any | null>(null);
    const [instituteForm, setInstituteForm] = useState({ name: '', location: '' });

    // Timetable Modal (Add Class)
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
    const [timetableForm, setTimetableForm] = useState({ instituteId: '', day: '', startTime: '', endTime: '', academicYear: '' });

    // Free Resources State
    const [freeResources, setFreeResources] = useState<any[]>([]);
    const [isFreeResourceModalOpen, setIsFreeResourceModalOpen] = useState(false);
    const [editingFreeResource, setEditingFreeResource] = useState<any | null>(null);
    const [freeResourceForm, setFreeResourceForm] = useState({ title: '', type: 'VIDEO', url: '', description: '' });

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
            const [landingData, testimonialData, featureData, courseData, instituteData, freeResourceData] = await Promise.all([
                getLandingPageContent(),
                getTestimonials(),
                getModernFeatures(),
                getCourses(),
                getInstitutes(),
                getFreeResources()
            ]);

            if (landingData.success && landingData.data) {
                const data = landingData.data as any;
                if (data.hero) setHeroContent(data.hero);
                if (data.about) setAboutContent(data.about);
                if (data.freeLessons) setFreeLessonsContent(data.freeLessons);
                if (data.contact) setContactContent(data.contact);
                if (data.footer) setFooterContent(data.footer);
            }

            if (testimonialData.success) setTestimonials(testimonialData.data || []);
            if (featureData.success) setFeatures(featureData.data || []);
            if (courseData.success) setCourses(courseData.data || []);
            if (instituteData.success) setInstitutes(instituteData.data || []);
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
            const result = await updateAllLandingPageContent({
                hero: heroContent,
                about: aboutContent,
                freeLessons: freeLessonsContent,
                contact: contactContent,
                footer: footerContent
            });

            if (result.success) {
                setAlert({ isOpen: true, title: 'Success', description: 'General content updated successfully', type: 'success' });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setAlert({ isOpen: true, title: 'Error', description: 'Failed to update content', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // --- Testimonial Handlers ---

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

    // --- Course Handlers ---

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = editingCourse
            ? await updateCourse(editingCourse.id, courseForm)
            : await createCourse(courseForm);

        if (result.success) {
            await fetchContent();
            setIsCourseModalOpen(false);
            setEditingCourse(null);
            setCourseForm({ year: '', title: '', status: '', description: '', schedule: '', color: '', order: 0 });
            showAlert('Success', 'Course saved successfully', 'success');
        } else {
            showAlert('Error', 'Failed to save course', 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteCourse = (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Delete Course',
            description: 'Are you sure you want to delete this course?',
            type: 'confirm',
            onConfirm: async () => {
                const result = await deleteCourse(id);
                if (result.success) {
                    await fetchContent();
                    showAlert('Success', 'Course deleted successfully', 'success');
                } else {
                    showAlert('Error', 'Failed to delete course', 'error');
                }
            }
        });
    };

    // --- Institute & Timetable Handlers ---

    const handleInstituteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = editingInstitute
            ? await updateInstitute(editingInstitute.id, instituteForm)
            : await createInstitute(instituteForm);

        if (result.success) {
            await fetchContent();
            setIsInstituteModalOpen(false);
            setEditingInstitute(null);
            setInstituteForm({ name: '', location: '' });
            showAlert('Success', 'Institute saved successfully', 'success');
        } else {
            showAlert('Error', 'Failed to save institute', 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteInstitute = (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Delete Institute',
            description: 'Are you sure you want to delete this institute? This will delete all associated timetables.',
            type: 'confirm',
            onConfirm: async () => {
                const result = await deleteInstitute(id);
                if (result.success) {
                    await fetchContent();
                    showAlert('Success', 'Institute deleted successfully', 'success');
                } else {
                    showAlert('Error', 'Failed to delete institute', 'error');
                }
            }
        });
    };

    const handleTimetableSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await createTimetable(timetableForm);

        if (result.success) {
            await fetchContent();
            setIsTimetableModalOpen(false);
            setTimetableForm({ instituteId: '', day: '', startTime: '', endTime: '', academicYear: '' });
            showAlert('Success', 'Class added successfully', 'success');
        } else {
            showAlert('Error', 'Failed to add class', 'error');
        }
        setIsSaving(false);
    };

    const handleDeleteTimetable = (id: string) => {
        setAlert({
            isOpen: true,
            title: 'Delete Class',
            description: 'Are you sure you want to delete this class?',
            type: 'confirm',
            onConfirm: async () => {
                const result = await deleteTimetable(id);
                if (result.success) {
                    await fetchContent();
                    showAlert('Success', 'Class deleted successfully', 'success');
                } else {
                    showAlert('Error', 'Failed to delete class', 'error');
                }
            }
        });
    };

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
                    <TabsTrigger value="courses" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <BookOpen className="w-4 h-4" /> Courses
                    </TabsTrigger>
                    <TabsTrigger value="timetable" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <Calendar className="w-4 h-4" /> Timetable
                    </TabsTrigger>
                    <TabsTrigger value="free-lessons" className="h-12 rounded-lg data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#1a1a1a] px-6 gap-2">
                        <BookOpen className="w-4 h-4" /> Free Lessons
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
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
                            <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Badge Text</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.badge} onChange={e => setHeroContent({ ...heroContent, badge: e.target.value })} placeholder="#1 Economics Class..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Title</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.title} onChange={e => setHeroContent({ ...heroContent, title: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Subtitle (Description)</Label>
                                <Textarea className="bg-white border-black text-black" value={heroContent.subtitle} onChange={e => setHeroContent({ ...heroContent, subtitle: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">CTA Text</Label>
                                <Input className="bg-white border-black text-black" value={heroContent.ctaText} onChange={e => setHeroContent({ ...heroContent, ctaText: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Student Count</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.studentCount} onChange={e => setHeroContent({ ...heroContent, studentCount: e.target.value })} placeholder="5000+" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Rank Count</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.rankCount} onChange={e => setHeroContent({ ...heroContent, rankCount: e.target.value })} placeholder="100+" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Experience Count</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.expCount} onChange={e => setHeroContent({ ...heroContent, expCount: e.target.value })} placeholder="10+" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Teacher Name</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.teacherName} onChange={e => setHeroContent({ ...heroContent, teacherName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Teacher Title</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.teacherTitle} onChange={e => setHeroContent({ ...heroContent, teacherTitle: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Teacher Image URL</Label>
                                    <Input className="bg-white border-black text-black" value={heroContent.teacherImage} onChange={e => setHeroContent({ ...heroContent, teacherImage: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">About Section</h2>
                            <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Section Subtitle</Label>
                                    <Input className="bg-white border-black text-black" value={aboutContent.subtitle} onChange={e => setAboutContent({ ...aboutContent, subtitle: e.target.value })} placeholder="About The Mentor" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Main Title</Label>
                                    <Input className="bg-white border-black text-black" value={aboutContent.title} onChange={e => setAboutContent({ ...aboutContent, title: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Description</Label>
                                <Textarea className="bg-white border-black text-black" value={aboutContent.description} onChange={e => setAboutContent({ ...aboutContent, description: e.target.value })} rows={5} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Features List (One per line)</Label>
                                <Textarea className="bg-white border-black text-black" value={aboutContent.features} onChange={e => setAboutContent({ ...aboutContent, features: e.target.value })} rows={4} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Quote</Label>
                                    <Input className="bg-white border-black text-black" value={aboutContent.quote} onChange={e => setAboutContent({ ...aboutContent, quote: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Quote Author</Label>
                                    <Input className="bg-white border-black text-black" value={aboutContent.quoteAuthor} onChange={e => setAboutContent({ ...aboutContent, quoteAuthor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Video/Image Placeholder URL</Label>
                                <Input className="bg-white border-black text-black" value={aboutContent.videoPlaceholder} onChange={e => setAboutContent({ ...aboutContent, videoPlaceholder: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingCourse(null); setCourseForm({ year: '', title: '', status: '', description: '', schedule: '', color: '', order: courses.length }); setIsCourseModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                            <Plus className="w-4 h-4 mr-2" /> Add Course
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-2xl text-black">{course.year}</h3>
                                            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">{course.title}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingCourse(course); setCourseForm(course); setIsCourseModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="inline-block px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                            {course.status}
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                                            <Calendar className="h-3 w-3" />
                                            {course.schedule}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Timetable Tab */}
                <TabsContent value="timetable" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingInstitute(null); setInstituteForm({ name: '', location: '' }); setIsInstituteModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                            <Plus className="w-4 h-4 mr-2" /> Add Institute
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {institutes.map((institute) => (
                            <div key={institute.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                        <div>
                                            <h3 className="font-bold text-lg text-black">{institute.name}</h3>
                                            <p className="text-xs text-gray-500">{institute.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingInstitute(institute); setInstituteForm(institute); setIsInstituteModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteInstitute(institute.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {institute.timetables && institute.timetables.map((cls: any) => (
                                        <div key={cls.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 relative group">
                                            <button onClick={() => handleDeleteTimetable(cls.id)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-sm text-gray-900">{cls.day}</span>
                                                <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded-full">{cls.academicYear}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {cls.startTime} - {cls.endTime}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" size="sm" className="w-full border-dashed border-gray-300 text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]" onClick={() => { setTimetableForm({ ...timetableForm, instituteId: institute.id }); setIsTimetableModalOpen(true); }}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Class
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Free Lessons Tab */}
                <TabsContent value="free-lessons" className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                            <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Subtitle</Label>
                                    <Input className="bg-white border-black text-black" value={freeLessonsContent.subtitle} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, subtitle: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Title</Label>
                                    <Input className="bg-white border-black text-black" value={freeLessonsContent.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, title: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Description</Label>
                                <Textarea className="bg-white border-black text-black" value={freeLessonsContent.description} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">CTA Text</Label>
                                    <Input className="bg-white border-black text-black" value={freeLessonsContent.ctaText} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, ctaText: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">CTA Note</Label>
                                    <Input className="bg-white border-black text-black" value={freeLessonsContent.ctaNote} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, ctaNote: e.target.value })} />
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
                                        <Label className="text-black">Title</Label>
                                        <Input className="bg-white border-black text-black" value={cat.title} onChange={e => {
                                            const newCats = [...freeLessonsContent.categories];
                                            newCats[idx].title = e.target.value;
                                            setFreeLessonsContent({ ...freeLessonsContent, categories: newCats });
                                        }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Count Text</Label>
                                        <Input className="bg-white border-black text-black" value={cat.count} onChange={e => {
                                            const newCats = [...freeLessonsContent.categories];
                                            newCats[idx].count = e.target.value;
                                            setFreeLessonsContent({ ...freeLessonsContent, categories: newCats });
                                        }} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Description</Label>
                                        <Textarea className="bg-white border-black text-black" value={cat.description} onChange={e => {
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
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredVideo.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredVideo.duration} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, duration: e.target.value } })} placeholder="Duration" />
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredVideo.views} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredVideo: { ...freeLessonsContent.featuredVideo, views: e.target.value } })} placeholder="Views" />
                            </div>
                            {/* Doc */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Document Preview</h3>
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredDoc.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredDoc: { ...freeLessonsContent.featuredDoc, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredDoc.subtitle} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredDoc: { ...freeLessonsContent.featuredDoc, subtitle: e.target.value } })} placeholder="Subtitle" />
                            </div>
                            {/* Quiz */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">Quiz Preview</h3>
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredQuiz.title} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, title: e.target.value } })} placeholder="Title" />
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredQuiz.duration} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, duration: e.target.value } })} placeholder="Duration" />
                                <Input className="bg-white border-black text-black" value={freeLessonsContent.featuredQuiz.questionCount} onChange={e => setFreeLessonsContent({ ...freeLessonsContent, featuredQuiz: { ...freeLessonsContent.featuredQuiz, questionCount: e.target.value } })} placeholder="Questions" />
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
                    <div className="flex justify-end">
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
                                <h3 className="font-bold text-lg mb-2 text-black">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-6">
                    <div className="flex justify-end">
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
                                <p className="text-gray-600 text-sm italic mb-2">"{testimonial.content}"</p>
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
                            <Button onClick={() => handleSaveGeneral()} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-black">Form Title</Label>
                                <Input className="bg-white border-black text-black" value={contactContent.formTitle} onChange={e => setContactContent({ ...contactContent, formTitle: e.target.value })} placeholder="Start Your AL Economics Journey Today" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Map URL</Label>
                                <Input className="bg-white border-black text-black" value={contactContent.mapUrl} onChange={e => setContactContent({ ...contactContent, mapUrl: e.target.value })} placeholder="https://maps.google.com/..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Email Address</Label>
                                    <Input className="bg-white border-black text-black" value={contactContent.email} onChange={e => setContactContent({ ...contactContent, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Phone Number</Label>
                                    <Input className="bg-white border-black text-black" value={contactContent.phone} onChange={e => setContactContent({ ...contactContent, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Address</Label>
                                    <Input className="bg-white border-black text-black" value={contactContent.address} onChange={e => setContactContent({ ...contactContent, address: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Office Hours Title</Label>
                                <Input className="bg-white border-black text-black" value={contactContent.officeHours.title} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, title: e.target.value } })} placeholder="Office Hours" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Weekdays Hours</Label>
                                    <Input className="bg-white border-black text-black" value={contactContent.officeHours.weekdays} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, weekdays: e.target.value } })} placeholder="Monday - Friday: 9:00 AM - 6:00 PM" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Weekends Hours</Label>
                                    <Input className="bg-white border-black text-black" value={contactContent.officeHours.weekends} onChange={e => setContactContent({ ...contactContent, officeHours: { ...contactContent.officeHours, weekends: e.target.value } })} placeholder="Saturday: 9:00 AM - 4:00 PM" />
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
                                    <Label className="text-black">Student Name</Label>
                                    <Input required className="bg-white border-black text-black" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Role/Achievement</Label>
                                        <Input required className="bg-white border-black text-black" value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="District Rank 1" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Institute</Label>
                                        <Input className="bg-white border-black text-black" value={testimonialForm.institute} onChange={e => setTestimonialForm({ ...testimonialForm, institute: e.target.value })} placeholder="Colombo" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Testimonial Content</Label>
                                    <Textarea required className="bg-white border-black text-black" value={testimonialForm.content} onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })} rows={4} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Image URL</Label>
                                        <Input className="bg-white border-black text-black" value={testimonialForm.imageUrl} onChange={e => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Rating (1-5)</Label>
                                        <Input type="number" min="1" max="5" required className="bg-white border-black text-black" value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })} />
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{editingFeature ? 'Edit Feature' : 'Add Feature'}</h2>
                                <button onClick={() => setIsFeatureModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleFeatureSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Feature Title</Label>
                                    <Input required className="bg-white border-black text-black" value={featureForm.title} onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Description</Label>
                                    <Textarea required className="bg-white border-black text-black" value={featureForm.description} onChange={e => setFeatureForm({ ...featureForm, description: e.target.value })} rows={3} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Icon Name (Lucide)</Label>
                                        <Input required className="bg-white border-black text-black" value={featureForm.icon} onChange={e => setFeatureForm({ ...featureForm, icon: e.target.value })} placeholder="Zap" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Color (Tailwind Gradient)</Label>
                                        <Input className="bg-white border-black text-black" value={featureForm.color} onChange={e => setFeatureForm({ ...featureForm, color: e.target.value })} placeholder="from-blue-500 to-cyan-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Order</Label>
                                    <Input type="number" required className="bg-white border-black text-black" value={featureForm.order} onChange={e => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
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

            {/* Course Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
                                <button onClick={() => setIsCourseModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Year</Label>
                                        <Input required className="bg-white border-black text-black" value={courseForm.year} onChange={e => setCourseForm({ ...courseForm, year: e.target.value })} placeholder="2025" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Title</Label>
                                        <Input required className="bg-white border-black text-black" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Advanced Level" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Status/Tag</Label>
                                    <Input required className="bg-white border-black text-black" value={courseForm.status} onChange={e => setCourseForm({ ...courseForm, status: e.target.value })} placeholder="Revision & Paper Class" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Description</Label>
                                    <Textarea required className="bg-white border-black text-black" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Schedule</Label>
                                    <Input required className="bg-white border-black text-black" value={courseForm.schedule} onChange={e => setCourseForm({ ...courseForm, schedule: e.target.value })} placeholder="Saturday 8:00 AM" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Color (Tailwind Gradient)</Label>
                                        <Input required className="bg-white border-black text-black" value={courseForm.color} onChange={e => setCourseForm({ ...courseForm, color: e.target.value })} placeholder="from-yellow-400 to-yellow-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">Order</Label>
                                        <Input type="number" required className="bg-white border-black text-black" value={courseForm.order} onChange={e => setCourseForm({ ...courseForm, order: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : (editingCourse ? 'Update Course' : 'Add Course')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Institute Modal */}
            <AnimatePresence>
                {isInstituteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{editingInstitute ? 'Edit Institute' : 'Add Institute'}</h2>
                                <button onClick={() => setIsInstituteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleInstituteSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Institute Name</Label>
                                    <Input required className="bg-white border-black text-black" value={instituteForm.name} onChange={e => setInstituteForm({ ...instituteForm, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Location</Label>
                                    <Input required className="bg-white border-black text-black" value={instituteForm.location} onChange={e => setInstituteForm({ ...instituteForm, location: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsInstituteModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : (editingInstitute ? 'Update Institute' : 'Add Institute')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Timetable (Class) Modal */}
            <AnimatePresence>
                {isTimetableModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Add Class</h2>
                                <button onClick={() => setIsTimetableModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleTimetableSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Academic Year</Label>
                                    <Input required className="bg-white border-black text-black" value={timetableForm.academicYear} onChange={e => setTimetableForm({ ...timetableForm, academicYear: e.target.value })} placeholder="2025 A/L" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Day</Label>
                                    <Input required className="bg-white border-black text-black" value={timetableForm.day} onChange={e => setTimetableForm({ ...timetableForm, day: e.target.value })} placeholder="Saturday" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-black">Start Time</Label>
                                        <Input required className="bg-white border-black text-black" value={timetableForm.startTime} onChange={e => setTimetableForm({ ...timetableForm, startTime: e.target.value })} placeholder="08:00 AM" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black">End Time</Label>
                                        <Input required className="bg-white border-black text-black" value={timetableForm.endTime} onChange={e => setTimetableForm({ ...timetableForm, endTime: e.target.value })} placeholder="12:00 PM" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsTimetableModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                                        {isSaving ? 'Saving...' : 'Add Class'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                    <Label className="text-black">Title</Label>
                                    <Input required className="bg-white border-black text-black" value={freeResourceForm.title} onChange={e => setFreeResourceForm({ ...freeResourceForm, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Type</Label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 bg-white border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                                    <Label className="text-black">URL</Label>
                                    <Input required className="bg-white border-black text-black" value={freeResourceForm.url} onChange={e => setFreeResourceForm({ ...freeResourceForm, url: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Description</Label>
                                    <Textarea className="bg-white border-black text-black" value={freeResourceForm.description} onChange={e => setFreeResourceForm({ ...freeResourceForm, description: e.target.value })} rows={3} />
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
        </div>
    );
}
