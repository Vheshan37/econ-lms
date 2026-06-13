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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#fdf021]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="text-[#fdf021] font-semibold text-sm uppercase tracking-wider mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Modern Teaching Features
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6" />
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            අති නවීන තාක්ෂණය සහ ඔප්පු වූ ගුරු ක්‍රමවේද සමඟ උ.පෙ. ආර්ථික විද්‍යා
            අධ්‍යාපනයට විප්ලවවාදී ප්‍රවේශයක් අත්විඳින්න.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedFeatures.map((feature, idx) => {
            // Get the icon component dynamically
            const IconComponent =
              (LucideIcons as any)[feature.icon] || LucideIcons.Zap;

            return (
              <div
                key={feature.id || idx}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)] hover:-translate-y-2"
              >
                {/* Icon with Gradient Background */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {sortedFeatures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No features added yet. Add features from the Features tab.
            </p>
          </div>
        )}

        {/* Student Benefits Section */}
        <div className="mt-20 bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-transparent rounded-3xl p-12 border border-[#fdf021]/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Student Benefits
              </h3>
              <p className="text-gray-300 mb-6">
                Our comprehensive learning platform is designed to give you
                every advantage in your A/L Economics journey.
              </p>
              <ul className="space-y-3">
                {[
                  "Flexible learning schedule that fits your lifestyle",
                  "Access to a vast library of educational resources",
                  "Personalized learning paths based on your progress",
                  "Direct communication with experienced teachers",
                  "Competitive environment that motivates excellence",
                ].map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="min-w-[24px] min-h-[24px] rounded-full bg-[#fdf021] flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-yellow-500/20 to-purple-500/20 backdrop-blur-sm border border-gray-700 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-4">92%</div>
                  <div className="text-xl text-gray-300 mb-2">Success Rate</div>
                  <div className="text-sm text-gray-400">
                    Our students achieve A grades
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#fdf021]/20 rounded-full blur-2xl animate-pulse" />
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
