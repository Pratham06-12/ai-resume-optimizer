"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BulletSuggestion } from "@/lib/analysis";

interface BeforeAfterSectionProps {
  suggestions: BulletSuggestion[];
  loading?: boolean;
}

const impactVariant = {
  weak: "warning" as const,
  moderate: "default" as const,
  strong: "success" as const,
};

export function BeforeAfterSection({
  suggestions,
  loading,
}: BeforeAfterSectionProps) {
  return (
    <section id="improver" className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Resume Improver</h2>
          <p className="text-sm text-slate-400">
            Before / after bullet comparisons with recruiter reasoning
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <Card className="border-dashed border-white/15 p-12 text-center">
          <p className="text-slate-400">
            Analyze your resume to generate improvement suggestions.
          </p>
        </Card>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="space-y-8">
          {suggestions.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-slate-900/50">
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <CardTitle className="text-base text-slate-300">
                    {s.section} · Suggestion {index + 1}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={impactVariant[s.impact]}>
                      {s.impact} impact
                    </Badge>
                    <Badge variant="cyan">{s.confidence}% confidence</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
                    <div className="glass-panel rounded-xl border-red-500/20 p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-300/80">
                        Original
                      </p>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {s.original}
                      </p>
                    </div>

                    <div className="hidden lg:flex flex-col items-center justify-center px-2">
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/40"
                      >
                        <ArrowRight className="h-6 w-6 text-purple-300" />
                      </motion.div>
                    </div>

                    <div className="glass-panel glow-border rounded-xl border-emerald-500/20 p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                        AI Improved
                      </p>
                      <p className="text-sm leading-relaxed text-white">
                        {s.improved}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-medium text-purple-300 mb-1">
                      Recruiter insight
                    </p>
                    <p className="text-sm text-slate-400">{s.reason}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
