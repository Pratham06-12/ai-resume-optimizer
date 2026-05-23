"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import type { AtsScores } from "@/lib/analysis";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

interface ScoreCardsProps {
  scores: AtsScores | null;
  loading?: boolean;
}

const CARDS: {
  key: keyof AtsScores;
  label: string;
  gradient: "purple" | "blue" | "cyan" | "pink";
}[] = [
  { key: "atsMatch", label: "ATS Match Score", gradient: "purple" },
  { key: "skillsMatch", label: "Skills Match", gradient: "cyan" },
  { key: "experienceMatch", label: "Experience Match", gradient: "blue" },
  { key: "keywordMatch", label: "Keyword Match", gradient: "pink" },
];

export function ScoreCards({ scores, loading }: ScoreCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="mx-auto h-[100px] w-[100px] rounded-full" />
            <Skeleton className="mx-auto mt-4 h-4 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => (
          <Card
            key={c.key}
            className="glass-panel-hover flex flex-col items-center p-6 opacity-60"
          >
            <ProgressRing value={0} size={100} label={c.label} gradient={c.gradient} />
            <p className="mt-2 text-xs text-slate-500">Run analysis</p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {CARDS.map((c) => (
        <motion.div key={c.key} variants={item}>
          <Card className="glass-panel-hover group overflow-hidden bg-card-glow">
            <CardContent className="flex flex-col items-center p-6">
              <div className="mb-2 flex w-full items-center justify-between">
                <TrendingUp className="h-4 w-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Live
                </span>
              </div>
              <ProgressRing
                value={scores[c.key]}
                size={100}
                label={c.label}
                gradient={c.gradient}
              />
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${scores[c.key]}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
