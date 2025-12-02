import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentTopics } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function StudentTopicsPage({ params }: { params: { yearId: string; typeId: string } }) {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const result = await getStudentTopics(params.typeId);
    const topics = result.success ? result.data : [];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <Link href={`/student/classes/${params.yearId}`}>
                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/5 mb-4 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Class Types
                        </Button>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <BookOpen className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Topics</h1>
                            <p className="text-gray-400 text-lg">
                                {topics.length} {topics.length === 1 ? 'topic' : 'topics'} available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Topics List */}
            {topics.length > 0 ? (
                <div className="space-y-4">
                    {topics.map((topic: any) => (
                        <Link
                            key={topic.id}
                            href={`/student/classes/${params.yearId}/${params.typeId}/${topic.id}`}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden block"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm shrink-0">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{topic.title}</h3>
                                            {topic.description && (
                                                <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 ml-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-[#D4AF37]">{topic._count.resources}</div>
                                            <div className="text-xs text-gray-500">Resources</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all shrink-0" />
                                    </div>
                                </div>
                            </div>

                            <div className="h-1 bg-gray-100">
                                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B5952F] w-0 group-hover:w-full transition-all duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl font-medium">No topics found</p>
                    <p className="text-gray-400 text-sm mt-2">This class type doesn't have any topics yet</p>
                </div>
            )}
        </div>
    );
}
