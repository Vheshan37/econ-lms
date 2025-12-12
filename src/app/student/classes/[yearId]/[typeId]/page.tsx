import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentTopics } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Layers, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function StudentTopicsPage({ params }: { params: Promise<{ yearId: string; typeId: string }> }) {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const { yearId, typeId } = await params;
    const result = await getStudentTopics(typeId);
    const topics = (result.success && result.data) ? result.data : [];

    return (
        <div className="space-y-8">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link href={`/student/classes/${yearId}`}>
                                <Button
                                    variant="ghost"
                                    className="h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 p-0"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                    <span className="text-[#D4AF37] font-medium">Topics</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white">
                                    Course Topics
                                </h1>
                                <p className="text-gray-400 mt-2 max-w-xl">
                                    Select a topic to access learning resources.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics List */}
                <div className="grid gap-4">
                    {topics.length > 0 ? (
                        topics.map((topic: any) => (
                            <Link
                                key={topic.id}
                                href={`/student/classes/${yearId}/${typeId}/${topic.id}`}
                                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#D4AF37]/30 transition-all cursor-pointer relative overflow-hidden block"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-[#B5952F] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1 transition-colors text-gray-900 group-hover:text-[#D4AF37]">
                                            {topic.title}
                                        </h3>
                                        {topic.description && (
                                            <p className="text-gray-500 text-sm mb-3">{topic.description}</p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                                <FileText className="w-3 h-3 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-600">
                                                    {topic._count.resources} resources
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No topics available</p>
                            <p className="text-gray-400 text-sm mt-2">This class type doesn&apos;t have any topics yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
