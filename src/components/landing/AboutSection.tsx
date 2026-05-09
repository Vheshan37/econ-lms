"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

export function AboutSection({ content }: { content?: any }) {
  const features =
    content?.features?.length > 0
      ? content.features
      : [
          "Comprehensive Theory Coverage",
          "Past Paper Analysis",
          "Real-world Economic Examples",
          "Personalized Attention",
        ];

  const [isPlaying, setIsPlaying] = useState(false);

  // Default Fallback Data if content is missing
  const data = {
    sectionSubtitle: content?.sectionSubtitle || "About The Mentor",
    sectionTitle: content?.sectionTitle || "Why Choose Quality Econ?",
    secondarySubtitle:
      content?.secondarySubtitle || "සංකීර්ණතාවය සරල බවට පරිවර්තනය කිරීම",
    description:
      content?.description ||
      "දශකයකට වැඩි ගුරු අත්දැකීම් සහිතව, අපි සංකීර්ණ ආර්ථික න්‍යායන් පහසුවෙන් තේරුම් ගත හැකි, සැබෑ ලෝක සංකල්ප බවට බිඳ දමන අද්විතීය ක්‍රමවේදයක් වර්ධනය කර ඇත. අපගේ අරමුණ ඔබට විභාගය සමත්වීමට උදව් කිරීම පමණක් නොව, විෂය කෙරෙහි ඇති ඇල්ම වර්ධනය කිරීමයි.",
    videoUrl: content?.videoUrl,
    videoPreviewImage: content?.videoPreviewImage,
    // For subtitle, split highlighting if needed, but for now assuming full string
  };

  return (
    <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-yellow-500 font-medium tracking-widest uppercase text-sm mb-4">
            {data.sectionSubtitle}
          </h2>
          <span className="text-4xl md:text-5xl text-white mb-6 font-impact">
            Why Choose Quality
            <span className="text-4xl md:text-6xl font-bold text-white mb-6 font-fm-gemunu">
              {" "}ම
            </span>{" "}
            Econ?
          </span>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl relative group cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              {isPlaying && data.videoUrl ? (
                <VideoPlayer
                  src={data.videoUrl}
                  className="w-full h-full"
                  autoPlay
                  muted
                />
              ) : isPlaying ? (
                // Fallback if no video URL but playing state is true (shouldn't happen typically with default checks but as a safeguard)
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1"
                  title="Quality Econ Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <>
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors z-10">
                    <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-10 border-t-transparent border-l-18 border-l-black border-b-10 border-b-transparent" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black to-transparent z-10">
                    <p className="font-bold text-lg">Classroom Experience</p>
                    <p className="text-sm text-gray-400">
                      Watch how we make Economics simple
                    </p>
                  </div>
                  {/* Thumbnail Image */}
                  {data.videoPreviewImage ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={data.videoPreviewImage}
                        alt="Video Preview"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-black" />
                  )}
                </>
              )}
            </div>

            {/* Decorative dots */}
            <div className="absolute -bottom-8 -left-8 grid grid-cols-6 gap-2 opacity-20">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-yellow-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h4 className="text-3xl font-bold text-white">
              {content?.secondarySubtitle ? (
                data.secondarySubtitle
              ) : (
                <>
                  සංකීර්ණතාවය <span className="text-yellow-500">සරල බවට</span>{" "}
                  පරිවර්තනය කිරීම
                </>
              )}
            </h4>
            <p className="text-gray-400 leading-relaxed text-lg">
              {data.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-yellow-500 h-5 w-5 shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <div className="p-6 bg-gray-900 rounded-xl border-l-4 border-yellow-500">
                <p className="italic text-gray-300">
                  <span>&quot;</span>ආර්ථික විද්‍යාව සෑම තැනකම පවතී, එය තේරුම්
                  ගැනීම ලෝකය තේරුම් ගැනීමයි<span>&quot;</span>
                </p>
                <p className="mt-4 font-bold text-yellow-500">
                  - Krishan Kasthuriarachchi
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
