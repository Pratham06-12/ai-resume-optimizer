"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  "Add missing keywords naturally into real experience bullets",
  "Improve bullet points using the AI suggestions above",
  "Re-upload your updated resume and analyze again",
];

interface NextStepsSectionProps {
  onAnalyze?: () => void;
  hasResults?: boolean;
}

export function NextStepsSection({
  onAnalyze,
  hasResults,
}: NextStepsSectionProps) {
  return (
    <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-blue-950/30">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <CardContent className="relative p-8">
        <h3 className="text-xl font-bold text-white">Next Steps</h3>
        <p className="mt-1 text-sm text-slate-400">
          Follow this flow to maximize your ATS match
        </p>
        <ol className="mt-6 space-y-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white shadow-neon">
                {i + 1}
              </span>
              <span className="pt-1 text-sm text-slate-300">{step}</span>
            </motion.li>
          ))}
        </ol>
        <Button
          className="mt-8 w-full sm:w-auto"
          size="lg"
          onClick={onAnalyze}
        >
          {hasResults ? "Re-analyze Resume" : "Start Analysis"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
