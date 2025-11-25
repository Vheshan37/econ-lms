"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ResourceCard } from "@/components/ResourceCard";
import { Label } from "@/components/ui/label";

export default function StudentResourcesPage() {
    const { currentUser, years, getStudentResources } = useStore();
    const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');

    if (!currentUser) return null;

    const allResources = getStudentResources(currentUser.id);
    const myYears = years.filter(y => currentUser.assignedYears?.includes(y.id));

    const filteredResources = selectedYearFilter === 'all'
        ? allResources
        : allResources.filter(r => r.yearId === selectedYearFilter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Resources</h1>
                    <p className="text-gray-500 mt-2">Access your study materials for {myYears.map(y => y.name).join(', ')}</p>
                </div>

                <div className="w-full md:w-64">
                    <Label htmlFor="yearFilter" className="sr-only">Filter by Year</Label>
                    <select
                        id="yearFilter"
                        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedYearFilter}
                        onChange={(e) => setSelectedYearFilter(e.target.value)}
                    >
                        <option value="all">All Classes</option>
                        {myYears.map(year => (
                            <option key={year.id} value={year.id}>{year.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No resources found for this selection.</p>
                </div>
            )}
        </div>
    );
}
