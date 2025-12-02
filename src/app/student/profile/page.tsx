import { getCurrentUser } from '@/lib/actions/auth';
import { getStudentProfile } from '@/lib/actions/studentData';
import { redirect } from 'next/navigation';
import { User, Mail, School, Calendar, GraduationCap, BookOpen } from 'lucide-react';

export default async function StudentProfilePage() {
    const session = await getCurrentUser();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const result = await getStudentProfile(session.userId);
    const profile = result.success ? result.data : null;

    if (!profile) {
        return <div className="p-8">Error loading profile</div>;
    }

    const assignmentsByYear = profile.classAssignments.reduce((acc: any, assignment: any) => {
        const yearId = assignment.classType.year.id;
        if (!acc[yearId]) {
            acc[yearId] = {
                year: assignment.classType.year,
                classTypes: [],
            };
        }
        acc[yearId].classTypes.push(assignment.classType);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-8 shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                            <User className="w-10 h-10 text-[#1a1a1a]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                            <p className="text-gray-400 text-lg">View your account information and assigned classes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Full Name</div>
                                <div className="font-medium text-gray-900">{profile.name}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Email Address</div>
                                <div className="font-medium text-gray-900">{profile.email}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <School className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">School</div>
                                <div className="font-medium text-gray-900">{profile.school}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Date of Birth</div>
                                <div className="font-medium text-gray-900">
                                    {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Account Status</h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-green-700">Active Account</span>
                            </div>
                            <p className="text-xs text-green-600">Your account is active and in good standing</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-sm text-gray-500 mb-1">Member Since</div>
                            <div className="font-medium text-gray-900">
                                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                })}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-sm text-gray-500 mb-1">Total Classes</div>
                            <div className="font-medium text-gray-900">{profile.classAssignments.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assigned Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Assigned Classes</h2>

                {Object.keys(assignmentsByYear).length > 0 ? (
                    <div className="space-y-6">
                        {Object.values(assignmentsByYear).map((yearGroup: any) => (
                            <div key={yearGroup.year.id}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B5952F] flex items-center justify-center shadow-sm">
                                        <GraduationCap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900">{yearGroup.year.year}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-13">
                                    {yearGroup.classTypes.map((classType: any) => (
                                        <div
                                            key={classType.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                                        >
                                            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                                            <span className="text-sm font-medium text-gray-900">{classType.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No classes assigned yet</p>
                )}
            </div>
        </div>
    );
}
