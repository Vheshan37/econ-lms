"use client";

import * as LucideIcons from "lucide-react";

interface Feature {
    id?: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
}

interface ModernFeaturesPreviewProps {
    data: Feature[];
}

export function ModernFeaturesPreview({ data }: ModernFeaturesPreviewProps) {
    // Sort features by order
    const sortedFeatures = [...data].sort((a, b) => a.order - b.order);

    return (
        <section className="py-24 bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-4 block">
                            Why Choose Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Modern Teaching Features
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6" />
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            අපගේ නවීන ඉගෙනුම් වේදිකාව ඔබට A/L ආර්ථික විද්‍යාවේ විශිෂ්ටත්වය සඳහා අවශ්‍ය සියලු මෙවලම් සපයයි.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedFeatures.map((feature, index) => {
                        // Get the icon component dynamically
                        const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Zap;

                        return (
                            <div
                                key={feature.id || index}
                                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative Corner */}
                                <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-gray-800 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        );
                    })}
                </div>

                {sortedFeatures.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No features added yet. Add features from the Features tab.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
