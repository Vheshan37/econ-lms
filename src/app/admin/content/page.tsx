'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, Layers, MessageSquare, Zap, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
    getLandingPageContent,
    updateLandingPageContent,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getModernFeatures,
    createModernFeature,
    updateModernFeature,
    deleteModernFeature
} from '@/lib/actions/content';

export default function ContentManagementPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // General Content State
    const [heroContent, setHeroContent] = useState({ title: '', subtitle: '', ctaText: '' });
    const [aboutContent, setAboutContent] = useState({ title: '', description: '' });
    const [contactContent, setContactContent] = useState({ email: '', phone: '', address: '' });

    // Testimonials State
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
    const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', content: '', imageUrl: '' });

    // Features State
    const [features, setFeatures] = useState<any[]>([]);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<any | null>(null);
    const [featureForm, setFeatureForm] = useState({ title: '', description: '', icon: '', order: 0 });

    // Alert State
    const [alert, setAlert] = useState<{ isOpen: boolean; title: string; description: string; type: 'success' | 'error' | 'confirm'; onConfirm?: () => void }>({
        isOpen: false,
        title: '',
        description: '',
        type: 'success'
    });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const [hero, about, contact, testimonialsData, featuresData] = await Promise.all([
                getLandingPageContent('hero'),
                getLandingPageContent('about'),
                getLandingPageContent('contact'),
                getTestimonials(),
                getModernFeatures()
            ]);

            if (hero.success && hero.data) setHeroContent(hero.data);
            if (about.success && about.data) setAboutContent(about.data);
            if (contact.success && contact.data) setContactContent(contact.data);
            if (testimonialsData.success && testimonialsData.data) setTestimonials(testimonialsData.data);
            if (featuresData.success && featuresData.data) setFeatures(featuresData.data);
        } catch (error) {
            console.error('Error fetching content:', error);
            showAlert('Error', 'Failed to load content', 'error');
        }
        setIsLoading(false);
    };

    const handleSaveGeneral = async (section: string, content: any) => {
        setIsSaving(true);
        const result = await updateLandingPageContent(section, content);
        setIsSaving(false);

        if (result.success) {
            showAlert('Success', `${section.charAt(0).toUpperCase() + section.slice(1)} content updated successfully`, 'success');
        } else {
            showAlert('Error', 'Failed to update content', 'error');
        }
    };

    // --- Testimonial Handlers ---

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
            setTestimonialForm({ name: '', role: '', content: '', imageUrl: '' });
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
            setFeatureForm({ title: '', description: '', icon: '', order: 0 });
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
                            <Button onClick={() => handleSaveGeneral('hero', heroContent)} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-black">Title</Label>
                                <Input className="bg-white border-black text-black" value={heroContent.title} onChange={e => setHeroContent({ ...heroContent, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Subtitle</Label>
                                <Textarea className="bg-white border-black text-black" value={heroContent.subtitle} onChange={e => setHeroContent({ ...heroContent, subtitle: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">CTA Text</Label>
                                <Input className="bg-white border-black text-black" value={heroContent.ctaText} onChange={e => setHeroContent({ ...heroContent, ctaText: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">About Section</h2>
                            <Button onClick={() => handleSaveGeneral('about', aboutContent)} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-black">Title</Label>
                                <Input className="bg-white border-black text-black" value={aboutContent.title} onChange={e => setAboutContent({ ...aboutContent, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-black">Description</Label>
                                <Textarea className="bg-white border-black text-black" value={aboutContent.description} onChange={e => setAboutContent({ ...aboutContent, description: e.target.value })} rows={5} />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingFeature(null); setFeatureForm({ title: '', description: '', icon: '', order: features.length }); setIsFeatureModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
                            <Plus className="w-4 h-4 mr-2" /> Add Feature
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div key={feature.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
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
                        <Button onClick={() => { setEditingTestimonial(null); setTestimonialForm({ name: '', role: '', content: '', imageUrl: '' }); setIsTestimonialModalOpen(true); }} className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]">
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
                                <p className="text-gray-600 text-sm italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                            <Button onClick={() => handleSaveGeneral('contact', contactContent)} disabled={isSaving} className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </Button>
                        </div>
                        <div className="space-y-4">
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
                                <Textarea className="bg-white border-black text-black" value={contactContent.address} onChange={e => setContactContent({ ...contactContent, address: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Feature Modal */}
            <AnimatePresence>
                {isFeatureModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFeatureModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-black">{editingFeature ? 'Edit Feature' : 'Add Feature'}</h2>
                                <button onClick={() => setIsFeatureModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleFeatureSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Title</Label>
                                    <Input className="bg-white border-black text-black" value={featureForm.title} onChange={e => setFeatureForm({ ...featureForm, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Description</Label>
                                    <Textarea className="bg-white border-black text-black" value={featureForm.description} onChange={e => setFeatureForm({ ...featureForm, description: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Icon Name (Lucide React)</Label>
                                    <Input className="bg-white border-black text-black" value={featureForm.icon} onChange={e => setFeatureForm({ ...featureForm, icon: e.target.value })} placeholder="e.g. Zap, Book, Users" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Order</Label>
                                    <Input className="bg-white border-black text-black" type="number" value={featureForm.order} onChange={e => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) })} />
                                </div>
                                <Button type="submit" className="w-full bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F] font-bold">
                                    {editingFeature ? 'Update Feature' : 'Add Feature'}
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Testimonial Modal */}
            <AnimatePresence>
                {isTestimonialModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsTestimonialModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-black">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                                <button onClick={() => setIsTestimonialModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-black">Name</Label>
                                    <Input className="bg-white border-black text-black" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Role</Label>
                                    <Input className="bg-white border-black text-black" value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="e.g. 2023 A/L Student" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Content</Label>
                                    <Textarea className="bg-white border-black text-black" value={testimonialForm.content} onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })} required rows={4} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-black">Image URL (Optional)</Label>
                                    <Input className="bg-white border-black text-black" value={testimonialForm.imageUrl} onChange={e => setTestimonialForm({ ...testimonialForm, imageUrl: e.target.value })} />
                                </div>
                                <Button type="submit" className="w-full bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F] font-bold">
                                    {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AlertDialog
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                onConfirm={alert.onConfirm}
                title={alert.title}
                description={alert.description}
                type={alert.type === 'confirm' ? 'warning' : alert.type}
                confirmText="Confirm"
                cancelText={alert.type === 'confirm' ? 'Cancel' : 'Close'}
            />
        </div>
    );
}
