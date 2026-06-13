// "use client";

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { ArrowRight, BookOpen, FileText, Brain, Download, Sparkles, GraduationCap, Trophy, Play, ChevronRight, Search, File, ClipboardList } from 'lucide-react';
// import Link from 'next/link';
// import { Navbar } from '@/components/Navbar';
// import { VideoPlayer } from '@/components/VideoPlayer';
// import { FooterSection } from '@/components/landing/FooterSection';
// import { getFreeResources } from '@/lib/actions/freeResource';
// import { ResourceType } from '@prisma/client';

// interface OLSubject {
//     id: string;
//     name: string;
//     _count?: {
//         resources: number;
//     }
// }

// interface Resource {
//     id: string;
//     title: string;
//     type: ResourceType;
//     url: string;
//     description: string | null;
//     createdAt: Date;
//     level: string;
// }

// interface OLStudentsClientProps {
//     isHallOfFameEnabled: boolean;
//     initialSubjects: OLSubject[];
//     pageSettings: any;
// }

// const iconMap: Record<string, any> = {
//     Trophy,
//     Brain,
//     GraduationCap,
//     File,
//     FileText,
//     BookOpen,
//     ClipboardList,
//     Download,
//     Sparkles,
//     Play
// };

// export default function OLStudentsClient({ isHallOfFameEnabled, initialSubjects, pageSettings }: OLStudentsClientProps) {
//     const container = {
//         hidden: { opacity: 0 },
//         show: {
//             opacity: 1,
//             transition: { staggerChildren: 0.1 }
//         }
//     };

//     const item = {
//         hidden: { opacity: 0, y: 20 },
//         show: { opacity: 1, y: 0 }
//     };

//     const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
//     const [resources, setResources] = useState<Resource[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [activeTab, setActiveTab] = useState<ResourceType>('VIDEO');
//     const [cards, setCards] = useState<any[]>([]);

//     // Video Player State
//     const [videoPlayer, setVideoPlayer] = useState<{ isOpen: boolean; url: string; title: string }>({
//         isOpen: false,
//         url: '',
//         title: ''
//     });

//     const handleResourceClick = (resource: Resource) => {
//         if (resource.type === 'VIDEO') {
//             setVideoPlayer({ isOpen: true, url: resource.url, title: resource.title });
//         } else {
//             window.open(resource.url, '_blank');
//         }
//     };

//     useEffect(() => {
//         if (pageSettings?.categoryCards && Array.isArray(pageSettings.categoryCards)) {
//             // Check for missing Video card in existing settings
//             if (pageSettings.categoryCards.length === 3 && !pageSettings.categoryCards.find((c: any) => c.title === 'Video Lessons')) {
//                 const videoCard = {
//                     icon: 'Play',
//                     title: "Video Lessons",
//                     desc: "Watch expert video tutorials to master every concept visually."
//                 };
//                 setCards([videoCard, ...pageSettings.categoryCards]);
//             } else {
//                 setCards(pageSettings.categoryCards);
//             }
//         } else {
//             // Default content if no settings
//             setCards([
//                 {
//                     icon: 'Play',
//                     title: "Video Lessons",
//                     desc: "Watch expert video tutorials to master every concept visually."
//                 },
//                 {
//                     icon: 'Trophy',
//                     title: "Competitive Edge",
//                     desc: "Stay ahead of 80% of students who start late. Secure your 'A' grade foundation."
//                 },
//                 {
//                     icon: 'Brain',
//                     title: "Master Concepts",
//                     desc: "Absorb complex economic theories at your own pace without the pressure of A/L exams."
//                 },
//                 {
//                     icon: 'GraduationCap',
//                     title: "University Dream",
//                     desc: "Early preparation is the secret weapon of every Island Ranker we've produced."
//                 }
//             ]);
//         }
//     }, [pageSettings]);

//     useEffect(() => {
//         const fetchResources = async () => {
//             if (!selectedSubject) {
//                 setResources([]);
//                 return;
//             }

//             setIsLoading(true);
//             try {
//                 const result = await getFreeResources("Ordinary Level", selectedSubject);
//                 if (result.success && result.data) {
//                     setResources(result.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching resources:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchResources();
//     }, [selectedSubject]);

//     const TABS = [
//         { id: 'VIDEO', label: 'Video Lessons', icon: Play, color: 'text-red-500', bgColor: 'bg-red-500/10', border: 'border-red-500/20' },
//         { id: 'PDF', label: 'PDFs', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10', border: 'border-blue-500/20' },
//         { id: 'PAST_PAPER', label: 'Past Papers', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-500/10', border: 'border-purple-500/20' },
//         { id: 'QUIZ', label: 'Quizzes', icon: Brain, color: 'text-green-500', bgColor: 'bg-green-500/10', border: 'border-green-500/20' },
//     ];

//     const filteredResources = resources.filter(r => r.type === activeTab);

//     const scrollToResources = () => {
//         const element = document.getElementById('resources-section');
//         if (element) {
//             element.scrollIntoView({ behavior: 'smooth' });
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#050505] text-white selection:bg-[#fdf021] selection:text-black">
//             {/* Header / Navbar */}
//             <div className="absolute top-0 left-0 right-0 z-50">
//                 <Navbar isHallOfFameEnabled={isHallOfFameEnabled} />
//             </div>

//             {/* Hero Section */}
//             <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
//                 <div className="absolute top-0 left-0 w-full h-full">
//                     <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
//                     <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
//                 </div>

//                 <div className="container mx-auto px-4 relative z-10 text-center">
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.8 }}
//                         className="max-w-4xl mx-auto space-y-8"
//                     >
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf021]/10 border border-[#fdf021]/20 rounded-full text-[#fdf021] text-sm font-medium">
//                             <Sparkles className="w-4 h-4" />
//                             <span>{pageSettings?.hero?.badge || "Calling all O/L Students"}</span>
//                         </div>

//                         <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
//                             {pageSettings?.hero?.title ? (
//                                 <span dangerouslySetInnerHTML={{ __html: pageSettings.hero.title.replace('Econ', '<span class="text-[#fdf021]">Econ</span>') }} />
//                             ) : (
//                                 <>
//                                     Start Your <span className="text-[#fdf021]">A/L Econ</span><br />
//                                     Journey Today
//                                 </>
//                             )}
//                         </h1>

//                         <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
//                             {pageSettings?.cta?.message?.replace('{year}', pageSettings?.cta?.year || '2027') || "Don't wait until after O/Ls. Build your foundation now with our exclusive free resources designed for smart achievers."}
//                         </p>

//                         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
//                             <Button
//                                 size="lg"
//                                 onClick={() => {
//                                     const element = document.getElementById('subjects-section');
//                                     element?.scrollIntoView({ behavior: 'smooth' });
//                                 }}
//                                 className="h-16 px-10 text-xl bg-[#fdf021] hover:bg-[#f0e51f] text-black font-bold rounded-full shadow-lg shadow-yellow-500/20"
//                             >
//                                 Start Learning Free
//                                 <ArrowRight className="ml-2 h-6 w-6" />
//                             </Button>
//                         </div>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Info Cards Section */}
//             <section className="py-24 relative z-10">
//                 <div className="container mx-auto px-4">
//                     <motion.div
//                         variants={container}
//                         initial="hidden"
//                         whileInView="show"
//                         viewport={{ once: true }}
//                         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//                     >
//                         {cards.map((card, idx) => {
//                             const Icon = iconMap[card.icon] || BookOpen;
//                             const CardContent = (
//                                 <motion.div
//                                     variants={item}
//                                     className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#fdf021]/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
//                                 >
//                                     <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                                         <Icon className="w-7 h-7 text-black" />
//                                     </div>
//                                     <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
//                                     <p className="text-gray-400 leading-relaxed">
//                                         {card.description || card.desc}
//                                     </p>
//                                 </motion.div>
//                             );

//                             return (
//                                 <div key={idx} className="h-full">
//                                     {card.link ? (
//                                         <Link href={card.link} className="block h-full">
//                                             {CardContent}
//                                         </Link>
//                                     ) : (
//                                         CardContent
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Subjects Selection Section */}
//             <section id="subjects-section" className="py-24 relative z-10">
//                 <div className="container mx-auto px-4">
//                     <div className="text-center mb-16 space-y-4">
//                         <h2 className="text-4xl md:text-5xl font-bold">Choose Your <span className="text-[#fdf021]">Subject</span></h2>
//                         <p className="text-gray-400">Select a subject to access free resources</p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
//                         {initialSubjects.map((subject) => (
//                             <motion.div
//                                 key={subject.id}
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 onClick={() => {
//                                     setSelectedSubject(subject.id);
//                                     // Small delay to allow state update before scrolling
//                                     setTimeout(scrollToResources, 100);
//                                 }}
//                                 className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 ${selectedSubject === subject.id
//                                     ? 'bg-[#fdf021]/10 border-[#fdf021] shadow-lg shadow-yellow-500/10'
//                                     : 'bg-[#111] border-gray-800 hover:border-[#fdf021]/50 hover:bg-gray-900'
//                                     }`}
//                             >
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className={`p-4 rounded-2xl ${selectedSubject === subject.id ? 'bg-[#fdf021] text-black' : 'bg-gray-800 text-gray-400 group-hover:bg-[#fdf021] group-hover:text-black'
//                                         } transition-colors`}>
//                                         <BookOpen className="w-6 h-6" />
//                                     </div>
//                                     <div className={`p-2 rounded-full ${selectedSubject === subject.id ? 'bg-[#fdf021]/20 text-[#fdf021]' : 'bg-gray-800 text-gray-500 group-hover:bg-[#fdf021]/20 group-hover:text-[#fdf021]'
//                                         }`}>
//                                         <ChevronRight className="w-5 h-5" />
//                                     </div>
//                                 </div>
//                                 <h3 className={`text-2xl font-bold mb-2 ${selectedSubject === subject.id ? 'text-[#fdf021]' : 'text-white group-hover:text-[#fdf021]'
//                                     }`}>
//                                     {subject.name}
//                                 </h3>
//                                 <p className="text-gray-500 group-hover:text-gray-400">
//                                     {subject._count?.resources || 0} Resources Available
//                                 </p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Dynamic Resources Section */}
//             <AnimatePresence>
//                 {selectedSubject && (
//                     <motion.section
//                         id="resources-section"
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="py-12 bg-[#0a0a0a] relative border-t border-white/5"
//                     >
//                         <div className="container mx-auto px-4">
//                             <div className="max-w-6xl mx-auto">
//                                 <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
//                                     <h3 className="text-3xl font-bold">
//                                         Resources for <span className="text-[#fdf021]">{initialSubjects.find(s => s.id === selectedSubject)?.name}</span>
//                                     </h3>

//                                     {/* Tabs */}
//                                     <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
//                                         {TABS.map((tab) => {
//                                             const Icon = tab.icon;
//                                             const isActive = activeTab === tab.id;
//                                             return (
//                                                 <button
//                                                     key={tab.id}
//                                                     onClick={() => setActiveTab(tab.id as ResourceType)}
//                                                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
//                                                         ? 'bg-white text-black shadow-lg'
//                                                         : 'text-gray-400 hover:text-white hover:bg-white/5'
//                                                         }`}
//                                                 >
//                                                     <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
//                                                     {tab.label}
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>

//                                 {isLoading ? (
//                                     <div className="flex flex-col items-center justify-center py-24 text-gray-500">
//                                         <div className="w-8 h-8 border-2 border-[#fdf021] border-t-transparent rounded-full animate-spin mb-4" />
//                                         <p>Loading resources...</p>
//                                     </div>
//                                 ) : filteredResources.length === 0 ? (
//                                     <div className="text-center py-24 bg-[#111] rounded-3xl border border-dashed border-gray-800">
//                                         <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-6">
//                                             <Search className="w-8 h-8 text-gray-600" />
//                                         </div>
//                                         <h4 className="text-xl font-bold text-white mb-2">No Resources Found</h4>
//                                         <p className="text-gray-500">
//                                             We haven't added any {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} for this subject yet.
//                                         </p>
//                                     </div>
//                                 ) : (
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                         {filteredResources.map((resource, index) => {
//                                             const tabInfo = TABS.find(t => t.id === resource.type);
//                                             const Icon = tabInfo?.icon || FileText;
//                                             return (
//                                                 <motion.div
//                                                     onClick={() => handleResourceClick(resource)}
//                                                     key={resource.id}
//                                                     initial={{ opacity: 0, y: 20 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     transition={{ delay: index * 0.05 }}
//                                                     className={`group block p-6 rounded-2xl bg-[#111] border border-gray-800 hover:border-[#fdf021]/30 transition-all hover:-translate-y-1 cursor-pointer`}
//                                                 >
//                                                     <div className="flex items-start justify-between mb-6">
//                                                         <div className={`p-3 rounded-xl ${tabInfo?.bgColor} relative`}>
//                                                             <Icon className={`w-6 h-6 ${tabInfo?.color}`} />
//                                                             {resource.type === 'VIDEO' && (
//                                                                 <div className="absolute inset-0 flex items-center justify-center">
//                                                                     <div className="bg-black/10 rounded-full p-1">
//                                                                         <Play className="w-3 h-3 text-current opacity-50" />
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                         <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
//                                                             {tabInfo?.label}
//                                                         </div>
//                                                     </div>

//                                                     <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#fdf021] transition-colors">
//                                                         {resource.title}
//                                                     </h4>

//                                                     {resource.description && (
//                                                         <p className="text-sm text-gray-500 line-clamp-2 mb-6">
//                                                             {resource.description}
//                                                         </p>
//                                                     )}

//                                                     <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors mt-auto">
//                                                         {resource.type === 'VIDEO' ? 'Watch Video' : 'View Resource'}
//                                                         <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                                                     </div>
//                                                 </motion.div>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.section>
//                 )}
//             </AnimatePresence>

//             <VideoPlayer
//                 isOpen={videoPlayer.isOpen}
//                 onClose={() => setVideoPlayer({ isOpen: false, url: '', title: '' })}
//                 videoUrl={videoPlayer.url}
//                 title={videoPlayer.title}
//                 showWarning={false}
//             />

//             <FooterSection />
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Brain,
  Download,
  Sparkles,
  GraduationCap,
  Trophy,
  Play,
  ChevronRight,
  Search,
  File,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { FooterSection } from "@/components/landing/FooterSection";
import { getFreeResources } from "@/lib/actions/freeResource";
import { ResourceType } from "@prisma/client";

interface OLSubject {
  id: string;
  name: string;
  _count?: {
    resources: number;
  };
}

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  description: string | null;
  createdAt: Date;
  level: string;
}

interface OLStudentsClientProps {
  isHallOfFameEnabled: boolean;
  initialSubjects: OLSubject[];
  pageSettings: any;
}

const iconMap: Record<string, any> = {
  Trophy,
  Brain,
  GraduationCap,
  File,
  FileText,
  BookOpen,
  ClipboardList,
  Download,
  Sparkles,
  Play,
};

// Helper function to get contrasting text color (black or white) based on background color
const getContrastColor = (hexColor: string): string => {
  // Remove the # if present
  const color = hexColor.replace("#", "");

  // Parse the hex color to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Helper function to lighten/darken color for hover effect
const adjustColor = (hexColor: string, percent: number): string => {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const adjustedR = Math.min(255, Math.max(0, r + (r * percent) / 100));
  const adjustedG = Math.min(255, Math.max(0, g + (g * percent) / 100));
  const adjustedB = Math.min(255, Math.max(0, b + (b * percent) / 100));

  return `#${Math.round(adjustedR).toString(16).padStart(2, "0")}${Math.round(adjustedG).toString(16).padStart(2, "0")}${Math.round(adjustedB).toString(16).padStart(2, "0")}`;
};

export default function OLStudentsClient({
  isHallOfFameEnabled,
  initialSubjects,
  pageSettings,
}: OLStudentsClientProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ResourceType>("VIDEO");
  const [cards, setCards] = useState<any[]>([]);

  // Video Player State
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
  });

  const handleResourceClick = (resource: Resource) => {
    if (resource.type === "VIDEO") {
      setVideoPlayer({
        isOpen: true,
        url: resource.url,
        title: resource.title,
      });
    } else {
      window.open(resource.url, "_blank");
    }
  };

  useEffect(() => {
    if (
      pageSettings?.categoryCards &&
      Array.isArray(pageSettings.categoryCards)
    ) {
      // Use exactly the cards from database (4 cards with their custom colors)
      setCards(pageSettings.categoryCards);
    } else {
      // Default content if no settings (with default colors)
      setCards([
        {
          icon: "Play",
          title: "Video Lessons",
          description:
            "Watch expert video tutorials to master every concept visually.",
          "card-color": "#ab1c1c",
        },
        {
          icon: "Trophy",
          title: "Competitive Edge",
          description:
            "Stay ahead of 80% of students who start late. Secure your 'A' grade foundation.",
          "card-color": "#8b680a",
        },
        {
          icon: "Brain",
          title: "Master Concepts",
          description:
            "Absorb complex economic theories at your own pace without the pressure of A/L exams.",
          "card-color": "#1e8a99",
        },
        {
          icon: "GraduationCap",
          title: "University Dream",
          description:
            "Early preparation is the secret weapon of every Island Ranker we've produced.",
          "card-color": "#6c2294",
        },
      ]);
    }
  }, [pageSettings]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedSubject) {
        setResources([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getFreeResources(
          "Ordinary Level",
          selectedSubject,
        );
        if (result.success && result.data) {
          setResources(result.data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [selectedSubject]);

  const TABS = [
    {
      id: "VIDEO",
      label: "Video Lessons",
      icon: Play,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      id: "PDF",
      label: "PDFs",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "PAST_PAPER",
      label: "Past Papers",
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      id: "QUIZ",
      label: "Quizzes",
      icon: Brain,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  const filteredResources = resources.filter((r) => r.type === activeTab);

  const scrollToResources = () => {
    const element = document.getElementById("resources-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#fdf021] selection:text-black">
      {/* Header / Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar isHallOfFameEnabled={isHallOfFameEnabled} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fdf021]/10 border border-[#fdf021]/20 rounded-full text-[#fdf021] text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>
                {pageSettings?.hero?.badge || "Calling all O/L Students"}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
              {pageSettings?.hero?.title ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: pageSettings.hero.title.replace(
                      "Econ",
                      '<span class="text-[#fdf021]">Econ</span>',
                    ),
                  }}
                />
              ) : (
                <>
                  Start Your <span className="text-[#fdf021]">A/L Econ</span>
                  <br />
                  Journey Today
                </>
              )}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {pageSettings?.cta?.message?.replace(
                "{year}",
                pageSettings?.cta?.year || "2027",
              ) ||
                "Don't wait until after O/Ls. Build your foundation now with our exclusive free resources designed for smart achievers."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => {
                  const element = document.getElementById("subjects-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-16 px-10 text-xl bg-[#fdf021] hover:bg-[#f0e51f] text-black font-bold rounded-full shadow-lg shadow-yellow-500/20"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {cards.map((card, idx) => {
              const Icon = iconMap[card.icon] || BookOpen;
              const cardColor = card["card-color"] || "#ab1c1c";
              const textColor = getContrastColor(cardColor);
              const hoverColor = adjustColor(cardColor, -15); // Darken by 15% for hover

              const CardContent = (
                <motion.div
                  variants={item}
                  className="h-full p-8 rounded-3xl bg-white/5 border-2 transition-all duration-300 group cursor-pointer hover:-translate-y-2"
                  style={{
                    borderColor: cardColor,
                    backgroundColor: `${cardColor}08`, // 3% opacity background
                    boxShadow: `0 0 20px ${cardColor}20`,
                  }}
                  whileHover={{
                    backgroundColor: `${cardColor}15`, // 8% opacity on hover
                    borderColor: cardColor,
                  }}
                >
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${cardColor}, ${hoverColor})`,
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: textColor }} />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4 transition-colors group-hover:text-white"
                    style={{ color: "#ffffff" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {card.description || card.desc}
                  </p>
                </motion.div>
              );

              return (
                <div key={idx} className="h-full">
                  {card.link ? (
                    <Link href={card.link} className="block h-full">
                      {CardContent}
                    </Link>
                  ) : (
                    CardContent
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Subjects Selection Section */}
      <section id="subjects-section" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Choose Your <span className="text-[#fdf021]">Subject</span>
            </h2>
            <p className="text-gray-400">
              Select a subject to access free resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {initialSubjects.map((subject) => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedSubject(subject.id);
                  setTimeout(scrollToResources, 100);
                }}
                className={`cursor-pointer group relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                  selectedSubject === subject.id
                    ? "bg-[#fdf021]/10 border-[#fdf021] shadow-lg shadow-yellow-500/10"
                    : "bg-[#111] border-gray-800 hover:border-[#fdf021]/50 hover:bg-gray-900"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-4 rounded-2xl ${
                      selectedSubject === subject.id
                        ? "bg-[#fdf021] text-black"
                        : "bg-gray-800 text-gray-400 group-hover:bg-[#fdf021] group-hover:text-black"
                    } transition-colors`}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      selectedSubject === subject.id
                        ? "bg-[#fdf021]/20 text-[#fdf021]"
                        : "bg-gray-800 text-gray-500 group-hover:bg-[#fdf021]/20 group-hover:text-[#fdf021]"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    selectedSubject === subject.id
                      ? "text-[#fdf021]"
                      : "text-white group-hover:text-[#fdf021]"
                  }`}
                >
                  {subject.name}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-400">
                  {subject._count?.resources || 0} Resources Available
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Resources Section */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.section
            id="resources-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12 bg-[#0a0a0a] relative border-t border-white/5"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                  <h3 className="text-3xl font-bold">
                    Resources for{" "}
                    <span className="text-[#fdf021]">
                      {
                        initialSubjects.find((s) => s.id === selectedSubject)
                          ?.name
                      }
                    </span>
                  </h3>

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as ResourceType)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-white text-black shadow-lg"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${isActive ? tab.color : ""}`}
                          />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                    <div className="w-8 h-8 border-2 border-[#fdf021] border-t-transparent rounded-full animate-spin mb-4" />
                    <p>Loading resources...</p>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="text-center py-24 bg-[#111] rounded-3xl border border-dashed border-gray-800">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-6">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      No Resources Found
                    </h4>
                    <p className="text-gray-500">
                      We haven't added any{" "}
                      {TABS.find(
                        (t) => t.id === activeTab,
                      )?.label.toLowerCase()}{" "}
                      for this subject yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource, index) => {
                      const tabInfo = TABS.find((t) => t.id === resource.type);
                      const Icon = tabInfo?.icon || FileText;
                      return (
                        <motion.div
                          onClick={() => handleResourceClick(resource)}
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group block p-6 rounded-2xl bg-[#111] border border-gray-800 hover:border-[#fdf021]/30 transition-all hover:-translate-y-1 cursor-pointer`}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div
                              className={`p-3 rounded-xl ${tabInfo?.bgColor} relative`}
                            >
                              <Icon className={`w-6 h-6 ${tabInfo?.color}`} />
                              {resource.type === "VIDEO" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/10 rounded-full p-1">
                                    <Play className="w-3 h-3 text-current opacity-50" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                              {tabInfo?.label}
                            </div>
                          </div>

                          <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#fdf021] transition-colors">
                            {resource.title}
                          </h4>

                          {resource.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                              {resource.description}
                            </p>
                          )}

                          <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white transition-colors mt-auto">
                            {resource.type === "VIDEO"
                              ? "Watch Video"
                              : "View Resource"}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <VideoPlayer
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, url: "", title: "" })}
        videoUrl={videoPlayer.url}
        title={videoPlayer.title}
        showWarning={false}
      />

      <FooterSection />
    </div>
  );
}
