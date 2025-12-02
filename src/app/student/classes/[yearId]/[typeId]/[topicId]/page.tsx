import { getCurrentUser } from '@/lib/actions/auth';
import { getTopicResources } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, FileText, File, ClipboardList, Play, ExternalLink, Download, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RESOURCE_CONFIG = {
    'VIDEO': { icon: Video, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Videos' },
    'PDF': { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500', label: 'PDFs' },
    'PAST_PAPER': { icon: File, color: 'text-purple-500', bgColor: 'bg-purple-500', label: 'Past Papers' },
    'QUIZ': { icon: ClipboardList, color: 'text-green-500', bgColor: 'bg-green-500', label: 'Quizzes' },
};

export default async function StudentTopicResourcesPage({ params }: { params: { yearId: string; typeId: string; topicId: string } }) {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const result = await getTopicResources(params.topicId);
    const resources = result.success ? result.data : [];

    // Group resources by type
    const resourcesByType = Object.keys(RESOURCE_CONFIG).map(type => ({
        type,
        // @ts-ignore
        config: RESOURCE_CONFIG[type],
        items: resources.filter((r: any) => r.type === type)
    })).filter(group => group.items.length > 0);

    return (
        <div className="space-y-8">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href={`/student/classes/${params.yearId}/${params.typeId}`}>
                                <Button
                                    variant="ghost"
                                    className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <span className="text-[#D4AF37] font-medium">Resources</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white">
                                    Topic Materials
                                </h1>
                                <p className="text-gray-400 mt-2 max-w-xl">
                                    Access videos, notes, and quizzes for this topic.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resources List */}
                <div className="space-y-8">
                    {resourcesByType.length > 0 ? (
                        resourcesByType.map((group) => {
                            const Icon = group.config.icon;
                            return (
                                <div key={group.type} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${group.config.bgColor}/10`}>
                                            <Icon className={`w-5 h-5 ${group.config.color}`} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">{group.config.label}</h2>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {group.items.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {group.items.map((resource: any) => (
                                            <a
                                                key={resource.id}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all border border-gray-100 cursor-pointer block"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#D4AF37] transition-colors">
                                                                {resource.title}
                                                            </h3>
                                                            {resource.type === 'VIDEO' && (
                                                                <div className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                    <Play className="w-3 h-3 text-red-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        {resource.description && (
                                                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                                {resource.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center gap-2 text-xs font-medium">
                                                            {resource.type === 'VIDEO' ? (
                                                                <span className="text-red-500 flex items-center gap-1">
                                                                    <Play className="w-3 h-3" /> Watch Now
                                                                </span>
                                                            ) : (
                                                                <span className="text-[#D4AF37] flex items-center gap-1">
                                                                    <Download className="w-3 h-3" /> Download
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No resources found</p>
                            <p className="text-gray-400 text-sm mt-2">This topic doesn't have any resources yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
