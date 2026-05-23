"use client";

import { motion } from "framer-motion";
import { AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDescriptionSectionProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function JobDescriptionSection({
  value,
  onChange,
  disabled,
}: JobDescriptionSectionProps) {
  const charCount = value.length;
  const maxRecommended = 8000;

  return (
    <div className="glass-panel glow-border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlignLeft className="h-5 w-5 text-cyan-400" />
          <label htmlFor="jd" className="text-sm font-semibold text-white">
            Job Description
          </label>
        </div>
        <span
          className={cn(
            "font-mono text-xs",
            charCount > maxRecommended ? "text-amber-400" : "text-slate-500"
          )}
        >
          {charCount.toLocaleString()} chars
        </span>
      </div>

      <div className="relative">
        {!value && (
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.7 }}
            className="pointer-events-none absolute left-4 top-4 text-sm text-slate-500"
          >
            Paste the full job posting — responsibilities, requirements, and
            preferred qualifications…
          </motion.p>
        )}
        <textarea
          id="jd"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={8}
          className={cn(
            "w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-4",
            "font-mono text-sm leading-relaxed text-slate-200",
            "placeholder-transparent focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
            "disabled:opacity-50"
          )}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Used for semantic keyword gaps and match scoring (client-side until Phase 2 API).
      </p>
    </div>
  );
}
