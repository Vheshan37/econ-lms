"use client";

import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ExamResultsTeaser() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_70%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-6">
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Check Your <span className="text-yellow-500">Exam Results</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Stay updated with your latest test scores and track your academic
            progress in real time.
          </p>
          <Link href="/exam-results">
            <button className="group inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-yellow-500/20">
              View Results
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}