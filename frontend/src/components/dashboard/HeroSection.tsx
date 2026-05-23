"use client";

import { motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ParticleBackground } from "./ParticleBackground";

interface HeroSectionProps {
  atsScore?: number;
  hasAnalysis: boolean;
}

export function HeroSection({ atsScore = 0, hasAnalysis }: HeroSectionProps) {
  return (
    <section
      id="dashboard"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-blue-950/30 p-8 md:p-10"
    >
      <ParticleBackground />
      <div className="absolute inset-0 bg-hero-glow" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered ATS Optimization
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            AI Resume{" "}
            <span className="text-gradient">Optimizer</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-400">
            Get your resume ATS-ready and job-winning with AI-driven semantic
            matching and recruiter-grade feedback.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
              Semantic matching
            </span>
            <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
              Human-like rewrites
            </span>
            <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
              Recruiter insights
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-2xl animate-pulse-glow" />
            <div className="glass-panel glow-border flex flex-col items-center gap-4 p-6">
              <Target className="h-6 w-6 text-cyan-400" />
              {hasAnalysis ? (
                <ProgressRing
                  value={atsScore}
                  size={140}
                  label="ATS Match"
                  sublabel="Live estimate"
                  gradient="cyan"
                />
              ) : (
                <div className="flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full border border-dashed border-white/20 text-center">
                  <span className="text-3xl font-bold text-slate-600">—</span>
                  <span className="mt-1 text-xs text-slate-500">
                    Analyze to score
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
