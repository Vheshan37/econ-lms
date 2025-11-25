import { Resource } from "@/types";
import { FileText, Video, HelpCircle, Download } from "lucide-react";
import { Button } from "./ui/button";

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const getIcon = () => {
        switch (resource.type) {
            case 'pdf': return <FileText className="h-10 w-10 text-red-500" />;
            case 'video': return <Video className="h-10 w-10 text-blue-500" />;
            case 'quiz': return <HelpCircle className="h-10 w-10 text-green-500" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{resource.type} • {resource.subject || 'General'}</p>
                    </div>
                </div>
                {resource.isFree && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Free
                    </span>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                    {new Date(resource.createdAt).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        View
                    </a>
                </Button>
            </div>
        </div>
    );
}
