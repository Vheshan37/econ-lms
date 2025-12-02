'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, Clock, Calendar, Building2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog } from '@/components/ui/alert-dialog';
import {
    getInstitutes,
    createInstitute,
    updateInstitute,
    deleteInstitute,
    createTimetable,
    updateTimetable,
    deleteTimetable
} from '@/lib/actions/timetable';

interface Timetable {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    academicYear: string;
}

interface Institute {
    id: string;
    name: string;
    location: string;
    timetables: Timetable[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetablePage() {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInstitutes, setExpandedInstitutes] = useState<Set<string>>(new Set());

    // Institute Modal State
    const [isInstituteModalOpen, setIsInstituteModalOpen] = useState(false);
    const [editingInstitute, setEditingInstitute] = useState<Institute | null>(null);
    const [instituteName, setInstituteName] = useState('');
    const [instituteLocation, setInstituteLocation] = useState('');

    // Timetable Modal State
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
    const [selectedInstituteId, setSelectedInstituteId] = useState<string>('');
    const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [academicYear, setAcademicYear] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert Dialog State
    const [deleteInstituteAlert, setDeleteInstituteAlert] = useState<{ isOpen: boolean; instituteId: string | null; instituteName: string }>({
        isOpen: false,
        instituteId: null,
        instituteName: ''
    });
    const [deleteTimetableAlert, setDeleteTimetableAlert] = useState<{ isOpen: boolean; timetableId: string | null }>({
        isOpen: false,
        timetableId: null
    });
    const [errorAlert, setErrorAlert] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    const fetchInstitutes = async () => {
        setIsLoading(true);
        const result = await getInstitutes();
        if (result.success && result.data) {
            setInstitutes(result.data);
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to fetch institutes' });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const toggleInstitute = (instituteId: string) => {
        setExpandedInstitutes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(instituteId)) {
                newSet.delete(instituteId);
            } else {
                newSet.add(instituteId);
            }
            return newSet;
        });
    };

    // Institute Handlers
    const handleEditInstitute = (institute: Institute) => {
        setEditingInstitute(institute);
        setInstituteName(institute.name);
        setInstituteLocation(institute.location);
        setIsInstituteModalOpen(true);
    };

    const handleSubmitInstitute = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = editingInstitute
            ? await updateInstitute(editingInstitute.id, { name: instituteName, location: instituteLocation })
            : await createInstitute({ name: instituteName, location: instituteLocation });

        if (result.success) {
            await fetchInstitutes();
            closeInstituteModal();
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to save institute' });
        }
        setIsSubmitting(false);
    };

    const handleDeleteInstituteClick = (id: string, name: string) => {
        setDeleteInstituteAlert({ isOpen: true, instituteId: id, instituteName: name });
    };

    const handleDeleteInstituteConfirm = async () => {
        if (!deleteInstituteAlert.instituteId) return;

        const result = await deleteInstitute(deleteInstituteAlert.instituteId);
        if (result.success) {
            await fetchInstitutes();
            setDeleteInstituteAlert({ isOpen: false, instituteId: null, instituteName: '' });
        } else {
            setErrorAlert({ isOpen: true, message: 'Failed to delete institute' });
        }
    };

    const closeInstituteModal = () => {
        setIsInstituteModalOpen(false);
        setEditingInstitute(null);
        setInstituteName('');
        setInstituteLocation('');
    };

    // Timetable Handlers
    const handleAddTimetable = (instituteId: string) => {
        setSelectedInstituteId(instituteId);
        setIsTimetableModalOpen(true);
    };

    const handleEditTimetable = (timetable: Timetable, instituteId: string) => {
        setEditingTimetable(timetable);
        setSelectedInstituteId(instituteId);
        setDay(timetable.day);
        setStartTime(timetable.startTime);
        setEndTime(timetable.endTime);
        setAcademicYear(timetable.academicYear);
        setIsTimetableModalOpen(true);
    };

    const handleSubmitTimetable = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = editingTimetable
            ? await updateTimetable(editingTimetable.id, { day, startTime, endTime, academicYear })
            : await createTimetable({ instituteId: selectedInstituteId, day, startTime, endTime, academicYear });

        if (result.success) {
            await fetchInstitutes();
            closeTimetableModal();
        } else {
            setErrorAlert({ isOpen: true, message: result.error || 'Failed to save timetable' });
        }
        setIsSubmitting(false);
    };

    const handleDeleteTimetableClick = (id: string) => {
        setDeleteTimetableAlert({ isOpen: true, timetableId: id });
    };

    const handleDeleteTimetableConfirm = async () => {
        if (!deleteTimetableAlert.timetableId) return;

        const result = await deleteTimetable(deleteTimetableAlert.timetableId);
        if (result.success) {
            await fetchInstitutes();
            setDeleteTimetableAlert({ isOpen: false, timetableId: null });
        } else {
            setErrorAlert({ isOpen: true, message: 'Failed to delete timetable' });
        }
    };

    const closeTimetableModal = () => {
        setIsTimetableModalOpen(false);
        setEditingTimetable(null);
        setSelectedInstituteId('');
        setDay('');
        setStartTime('');
        setEndTime('');
        setAcademicYear('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading...</div>
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
                            <Clock className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Timetable Management</h1>
                            <p className="text-gray-400 text-lg">
                                Manage your teaching schedule across institutes
                                <span className="ml-3 text-[#D4AF37] font-medium">
                                    {institutes.length} {institutes.length === 1 ? 'Institute' : 'Institutes'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsInstituteModalOpen(true)}
                        className="bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] gap-2 h-12 px-6 font-bold shadow-lg shadow-[#D4AF37]/30"
                    >
                        <Plus className="w-5 h-5" />
                        Add Institute
                    </Button>
                </div>
            </div>

            {/* Institutes List */}
            <div className="space-y-4">
                {institutes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl font-medium">No institutes added yet</p>
                        <p className="text-gray-400 text-sm mt-2">Add your first institute to start managing timetables</p>
                    </div>
                ) : (
                    institutes.map((institute) => (
                        <motion.div
                            key={institute.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Institute Header */}
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-gray-900">{institute.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{institute.location}</span>
                                                <span className="mx-2">•</span>
                                                <span className="text-[#D4AF37] font-medium">
                                                    {institute.timetables.length} {institute.timetables.length === 1 ? 'class' : 'classes'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddTimetable(institute.id)}
                                            className="gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Class
                                        </Button>
                                        <button
                                            onClick={() => handleEditInstitute(institute)}
                                            className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteInstituteClick(institute.id, institute.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => toggleInstitute(institute.id)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                                        >
                                            {expandedInstitutes.has(institute.id) ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Timetable List */}
                            <AnimatePresence>
                                {expandedInstitutes.has(institute.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 space-y-3">
                                            {institute.timetables.length === 0 ? (
                                                <div className="text-center py-8 text-gray-400">
                                                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                    <p className="text-sm">No classes scheduled yet</p>
                                                </div>
                                            ) : (
                                                institute.timetables.map((timetable) => (
                                                    <div
                                                        key={timetable.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-6 flex-1">
                                                            <div className="flex items-center gap-2 min-w-[120px]">
                                                                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                                                <span className="font-medium text-gray-900">{timetable.day}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 min-w-[140px]">
                                                                <Clock className="w-4 h-4 text-[#D4AF37]" />
                                                                <span className="text-gray-600">{timetable.startTime} - {timetable.endTime}</span>
                                                            </div>
                                                            <div className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium">
                                                                {timetable.academicYear}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditTimetable(timetable, institute.id)}
                                                                className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-white rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTimetableClick(timetable.id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Institute Modal */}
            <AnimatePresence>
                {isInstituteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeInstituteModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-[#1a1a1a]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingInstitute ? 'Edit Institute' : 'Add Institute'}
                                    </h2>
                                </div>
                                <button onClick={closeInstituteModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitInstitute} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-gray-300 ml-1">Institute Name</Label>
                                    <Input
                                        placeholder="e.g. Royal Institute"
                                        value={instituteName}
                                        onChange={e => setInstituteName(e.target.value)}
                                        required
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300 ml-1">Location</Label>
                                    <Input
                                        placeholder="e.g. Colombo"
                                        value={instituteLocation}
                                        onChange={e => setInstituteLocation(e.target.value)}
                                        required
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" className="flex-1 text-gray-400 hover:text-white" onClick={closeInstituteModal}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] font-bold" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : editingInstitute ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Timetable Modal */}
            <AnimatePresence>
                {isTimetableModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeTimetableModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#1a1a1a] border border-[#D4AF37]/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-[#1a1a1a]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingTimetable ? 'Edit Class' : 'Add Class'}
                                    </h2>
                                </div>
                                <button onClick={closeTimetableModal} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitTimetable} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-gray-300 ml-1">Day</Label>
                                    <select
                                        value={day}
                                        onChange={e => setDay(e.target.value)}
                                        required
                                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    >
                                        <option value="" className="bg-[#1a1a1a]">Select a day</option>
                                        {DAYS.map(d => (
                                            <option key={d} value={d} className="bg-[#1a1a1a]">{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300 ml-1">Start Time</Label>
                                        <Input
                                            type="time"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                            required
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-300 ml-1">End Time</Label>
                                        <Input
                                            type="time"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                            required
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300 ml-1">Academic Year</Label>
                                    <Input
                                        placeholder="e.g. 2025 A/L"
                                        value={academicYear}
                                        onChange={e => setAcademicYear(e.target.value)}
                                        required
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" className="flex-1 text-gray-400 hover:text-white" onClick={closeTimetableModal}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-[#1a1a1a] font-bold" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : editingTimetable ? 'Update' : 'Add Class'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Dialogs */}
            <AlertDialog
                isOpen={deleteInstituteAlert.isOpen}
                onClose={() => setDeleteInstituteAlert({ isOpen: false, instituteId: null, instituteName: '' })}
                onConfirm={handleDeleteInstituteConfirm}
                title="Delete Institute"
                description={`Are you sure you want to delete "${deleteInstituteAlert.instituteName}"? This will also delete all associated timetables.`}
                type="error"
                confirmText="Delete"
                cancelText="Cancel"
            />

            <AlertDialog
                isOpen={deleteTimetableAlert.isOpen}
                onClose={() => setDeleteTimetableAlert({ isOpen: false, timetableId: null })}
                onConfirm={handleDeleteTimetableConfirm}
                title="Delete Class"
                description="Are you sure you want to delete this class from the timetable?"
                type="error"
                confirmText="Delete"
                cancelText="Cancel"
            />

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
