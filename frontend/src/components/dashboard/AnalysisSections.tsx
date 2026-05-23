"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardAnalysis } from "@/lib/analysis";
import type { ParsedResume } from "@/lib/types";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

interface AnalysisSectionsProps {
  analysis: DashboardAnalysis | null;
  resume: ParsedResume | null;
  loading?: boolean;
}

export function AnalysisSections({
  analysis,
  resume,
  loading,
}: AnalysisSectionsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (!analysis || !resume) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyCard
          title="Top Strengths"
          icon={CheckCircle2}
          message="Upload and analyze your resume to see strengths."
        />
        <EmptyCard
          title="Missing Keywords"
          icon={Tag}
          message="Paste a job description to surface keyword gaps."
        />
        <EmptyCard
          title="Areas To Improve"
          icon={AlertTriangle}
          message="Recruiter-style suggestions appear after analysis."
        />
        <EmptyCard
          title="Resume Analysis Summary"
          icon={FileCheck}
          message="Your parsed sections and counts will show here."
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <motion.div variants={fade}>
        <Card className="glass-panel-hover h-full border-emerald-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              Top Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fade}>
        <Card className="glass-panel-hover h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <Tag className="h-5 w-5" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.missingKeywords.length === 0 ? (
              <p className="text-sm text-slate-400">
                No major gaps detected — or add a job description for deeper matching.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw) => (
                  <Badge
                    key={kw}
                    variant="cyan"
                    className="shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Only add keywords you can honestly support with real experience.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fade}>
        <Card className="glass-panel-hover h-full border-amber-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Areas To Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.improvements.map((s, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-slate-300"
                >
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fade}>
        <Card className="glass-panel-hover h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-400" />
              Resume Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <FileCheck className="h-8 w-8 text-blue-400" />
              <div>
                <p className="font-medium text-white">{resume.file_name}</p>
                <p className="text-xs text-slate-500">
                  {resume.file_type.toUpperCase()} · {resume.word_count} words · Parsed
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Experience", count: analysis.sectionCounts.experience },
                { label: "Skills", count: analysis.sectionCounts.skills },
                { label: "Projects", count: analysis.sectionCounts.projects },
                { label: "Education", count: analysis.sectionCounts.education },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/[0.04] p-3 text-center"
                >
                  <p className="text-2xl font-bold text-gradient">{s.count}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function EmptyCard({
  title,
  icon: Icon,
  message,
}: {
  title: string;
  icon: React.ElementType;
  message: string;
}) {
  return (
    <Card className="opacity-70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-400">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">{message}</p>
      </CardContent>
    </Card>
  );
}
