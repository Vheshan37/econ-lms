import { getCurrentUser } from '@/lib/actions/auth';
import { getTopicResources } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, FileText, FileQuestion, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TABS = [
    { id: 'VIDEO', label: 'Videos', icon: Video },
    { id: 'PDF', label: 'PDFs', icon: FileText },
    { id: 'PAST_PAPER', label: 'Past Papers', icon: FileQuestion },
    { id: 'QUIZ', label: 'Quizzes', icon: FileQuestion },
];

function getResourceIcon(type: string) {
    switch (type) {
        case 'VIDEO': return Video;
        case 'PDF': return FileText;
        case 'PAST_PAPER': return FileQuestion;
        case 'QUIZ': return FileQuestion;
        default: return FileText;
    }
}

function getResourceColor(type: string) {
    switch (type) {
        case 'VIDEO': return 'text-red-600 bg-red-100';
        case 'PDF': return 'text-orange-600 bg-orange-100';
        case 'PAST_PAPER': return 'text-purple-600 bg-purple-100';
        case 'QUIZ': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
    }
}

export default async function StudentTopicResourcesPage({ params }: { params: { yearId: string; typeId: string; topicId: string } }) {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const result = await getTopicResources(params.topicId);
    const resources = result.success ? result.data : [];

    // Group resources by type
    const resourcesByType = TABS.map(tab => ({
        ...tab,
        resources: resources.filter((r: any) => r.type === tab.id),
        count: resources.filter((r: any) => r.type === tab.id).length
    })).filter(tab => tab.count > 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <Link href={`/student/classes/${params.yearId}/${params.typeId}`}>
                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/5 mb-4 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Topics
                        </Button>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <FileText className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Resources</h1>
                            <p className="text-gray-400 text-lg">
                                {resources.length} {resources.length === 1 ? 'resource' : 'resources'} available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resources by Type */}
            {resourcesByType.length > 0 ? (
                <div className="space-y-8">
                    {resourcesByType.map((typeGroup) => {
                        const Icon = typeGroup.icon;
                        return (
                            <div key={typeGroup.id}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                                    <h2 className="text-2xl font-bold text-gray-900">{typeGroup.label}</h2>
                                    <span className="text-sm text-gray-500">({typeGroup.count})</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {typeGroup.resources.map((resource: any) => {
                                        const ResourceIcon = getResourceIcon(resource.type);
                                        return (
                                            <div
                                                key={resource.id}
                                                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getResourceColor(resource.type)}`}>
                                                            <ResourceIcon className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wide">{resource.type.replace('_', ' ')}</span>
                                                        </div>
                                                    </div>

                                                    {resource.description && (
                                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                                                    )}

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
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl font-medium">No resources found</p>
                    <p className="text-gray-400 text-sm mt-2">This topic doesn't have any resources yet</p>
                </div>
            )}
        </div>
    );
}
