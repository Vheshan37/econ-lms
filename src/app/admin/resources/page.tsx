"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, FileText, Video, HelpCircle } from "lucide-react";
import { Resource } from "@/types";

export default function ResourcesPage() {
    const { resources, years, addResource } = useStore();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [type, setType] = useState<Resource['type']>('pdf');
    const [yearId, setYearId] = useState(years[0]?.id || "");
    const [subject, setSubject] = useState("");
    const [isFree, setIsFree] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newResource: Resource = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            type,
            yearId,
            subject,
            isFree,
            url: '#', // Mock URL
            createdAt: new Date().toISOString(),
        };
        addResource(newResource);
        setIsAdding(false);
        // Reset form
        setTitle("");
        setSubject("");
        setIsFree(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
                    <p className="text-gray-500 mt-2">Manage study materials, recordings, and quizzes.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Resource
                        </>
                    )}
                </Button>
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Resource</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Market Structures Note" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject/Topic</Label>
                                <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="e.g. Microeconomics" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={type}
                                    onChange={e => setType(e.target.value as Resource['type'])}
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="video">Video Recording</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Class Year</Label>
                                <select
                                    id="year"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={yearId}
                                    onChange={e => setYearId(e.target.value)}
                                >
                                    {years.map(y => (
                                        <option key={y.id} value={y.id}>{y.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isFree"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={isFree}
                                onChange={e => setIsFree(e.target.checked)}
                            />
                            <Label htmlFor="isFree">Make this resource free (Public)</Label>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full md:w-auto">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Resource
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div key={resource.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${resource.type === 'pdf' ? 'bg-red-50 text-red-600' :
                                        resource.type === 'video' ? 'bg-blue-50 text-blue-600' :
                                            'bg-green-50 text-green-600'
                                    }`}>
                                    {resource.type === 'pdf' ? <FileText className="h-6 w-6" /> :
                                        resource.type === 'video' ? <Video className="h-6 w-6" /> :
                                            <HelpCircle className="h-6 w-6" />}
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {years.find(y => y.id === resource.yearId)?.name}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{resource.subject}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${resource.isFree ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {resource.isFree ? 'Free' : 'Premium'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(resource.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
