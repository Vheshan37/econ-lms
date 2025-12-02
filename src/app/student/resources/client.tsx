'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Filter, Video, FileText, FileQuestion, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Resource {
    id: string;
    title: string;
    type: 'VIDEO' | 'PDF' | 'PAST_PAPER' | 'QUIZ';
    url: string;
    description: string | null;
    topicTitle: string;
    classTypeName: string;
    yearName: string;
    yearId: string;
    classTypeId: string;
    topicId: string;
}

export default function ResourcesClient({ resources }: { resources: Resource[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    const uniqueYears = Array.from(new Set(resources.map(r => r.yearId))).map(id => {
        const resource = resources.find(r => r.yearId === id);
        return { id, name: resource?.yearName || '' };
    });

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.topicTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || resource.type === selectedType;
        const matchesYear = selectedYear === 'all' || resource.yearId === selectedYear;
        return matchesSearch && matchesType && matchesYear;
    });

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return Video;
            case 'PDF': return FileText;
            case 'PAST_PAPER': return FileQuestion;
            case 'QUIZ': return FileQuestion;
            default: return FileText;
        }
    };

    const getResourceColor = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'text-red-600 bg-red-100';
            case 'PDF': return 'text-orange-600 bg-orange-100';
            case 'PAST_PAPER': return 'text-purple-600 bg-purple-100';
            case 'QUIZ': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <BookOpen className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">All Resources</h1>
                            <p className="text-gray-400 text-lg">
                                {filteredResources.length} of {resources.length} resources
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="search"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="typeFilter" className="text-sm font-medium text-gray-700">Resource Type</Label>
                        <select
                            id="typeFilter"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="all">All Types</option>
                            <option value="VIDEO">Videos</option>
                            <option value="PDF">PDFs</option>
                            <option value="PAST_PAPER">Past Papers</option>
                            <option value="QUIZ">Quizzes</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="yearFilter" className="text-sm font-medium text-gray-700">Academic Year</Label>
                        <select
                            id="yearFilter"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="all">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year.id} value={year.id}>{year.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => {
                        const Icon = getResourceIcon(resource.type);
                        return (
                            <div
                                key={resource.id}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getResourceColor(resource.type)}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide">{resource.type.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    {resource.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                                    )}

                                    <div className="space-y-1 mb-4 text-xs text-gray-500">
                                        <div>📚 {resource.yearName}</div>
                                        <div>📖 {resource.classTypeName}</div>
                                        <div>📝 {resource.topicTitle}</div>
                                    </div>

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:from-[#B5952F] hover:to-[#D4AF37] text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
                                    >
                                        {resource.type === 'VIDEO' ? (
                                            <>
                                                <Video className="w-4 h-4" />
                                                Watch Video
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                {resource.type === 'QUIZ' ? 'Take Quiz' : 'Download'}
                                            </>
                                        )}
                                    </a>
                                </div>

                                <div className={`h-1 bg-gradient-to-r ${getResourceColor(resource.type).replace('text-', 'from-').replace('bg-', 'to-')}`} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <Filter className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl font-medium">No resources found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
}
