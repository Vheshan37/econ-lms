import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentClassTypes } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Layers, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function StudentClassTypesPage({ params }: { params: { yearId: string } }) {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const result = await getStudentClassTypes(session.userId, params.yearId);
    const classTypes = result.success ? result.data : [];
    const yearName = classTypes.length > 0 ? classTypes[0].year.year : '';

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <Link href="/student/classes">
                        <Button
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-white/5 mb-4 gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Classes
                        </Button>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <Layers className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{yearName}</h1>
                            <p className="text-gray-400 text-lg">
                                {classTypes.length} {classTypes.length === 1 ? 'class type' : 'class types'} available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class Types Grid */}
            {classTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classTypes.map((classType: any) => (
                        <Link
                            key={classType.id}
                            href={`/student/classes/${params.yearId}/${classType.id}`}
                            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                        >
                            <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#B5952F] to-[#D4AF37]" />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900">{classType.name}</h3>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-[#D4AF37]">{classType._count.topics}</span>
                                        <span className="text-sm text-gray-500">
                                            {classType._count.topics === 1 ? 'Topic' : 'Topics'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm group-hover:gap-3 transition-all">
                                        View Topics
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <Layers className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl font-medium">No class types found</p>
                    <p className="text-gray-400 text-sm mt-2">This academic year doesn't have any class types yet</p>
                </div>
            )}
        </div>
    );
}
