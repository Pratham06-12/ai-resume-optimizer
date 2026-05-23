"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { checkHealth, extractResume } from "@/lib/api";
import { analyzeResume, type DashboardAnalysis } from "@/lib/analysis";
import type { ParsedResume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Sidebar, type NavId } from "@/components/dashboard/Sidebar";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { ScoreCards } from "@/components/dashboard/ScoreCards";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { JobDescriptionSection } from "@/components/dashboard/JobDescriptionSection";
import { AnalysisSections } from "@/components/dashboard/AnalysisSections";
import { BeforeAfterSection } from "@/components/dashboard/BeforeAfterSection";
import { NextStepsSection } from "@/components/dashboard/NextStepsSection";
import { ErrorBanner } from "@/components/dashboard/ErrorBanner";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [analysis, setAnalysis] = useState<DashboardAnalysis | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [activeNav, setActiveNav] = useState<NavId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkHealth().then(setApiOnline);
  }, []);

  const scrollTo = useCallback((id: NavId) => {
    setActiveNav(id);
    const map: Partial<Record<NavId, string>> = {
      dashboard: "#dashboard",
      analyze: "#analyze",
      improver: "#improver",
      guide: "#guide",
    };
    const el = document.querySelector(map[id] ?? "#dashboard");
    el?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const runAnalysis = useCallback(async () => {
    setError(null);

    if (!file) {
      setError("Please upload a resume (PDF or DOCX).");
      return;
    }

    setLoading(true);
    setUploadProgress(15);

    const progressTimer = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 12, 90));
    }, 200);

    try {
      const result = await extractResume(file, jobDescription);
      setUploadProgress(100);
      setParsed(result.data);
      const a = analyzeResume(result.data, jobDescription);
      setAnalysis(a);
      setActiveNav("dashboard");
      setTimeout(() => {
        document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setParsed(null);
      setAnalysis(null);
    } finally {
      clearInterval(progressTimer);
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 800);
    }
  }, [file, jobDescription]);

  const hasResults = Boolean(parsed && analysis);

  const pageVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.3 } },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#060912]">
      <Sidebar
        activeId={activeNav}
        onNavigate={scrollTo}
        apiOnline={apiOnline}
        mobileOpen={mobileOpen}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <MobileNav onOpen={() => setMobileOpen(true)} />

      <main
        className={cn(
          "min-h-screen transition-[margin] duration-300",
          "pl-[72px] lg:pl-64",
          "pt-14 lg:pt-0"
        )}
      >
        <motion.div
          className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10 space-y-10"
          variants={pageVariants}
          initial="hidden"
          animate="show"
        >
          <HeroSection
            atsScore={analysis?.scores.atsMatch}
            hasAnalysis={hasResults}
          />

          <ScoreCards scores={analysis?.scores ?? null} loading={loading} />

          <section id="analyze" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Analyze Resume</h2>
              <p className="text-sm text-slate-400">
                Upload your resume and paste the job description
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAnalysis();
              }}
              className="space-y-6"
            >
              <UploadSection
                file={file}
                onFileChange={setFile}
                disabled={loading}
                progress={uploadProgress}
              />
              <JobDescriptionSection
                value={jobDescription}
                onChange={setJobDescription}
                disabled={loading}
              />

              <ErrorBanner message={error} onDismiss={() => setError(null)} />

              <Button
                type="submit"
                size="lg"
                disabled={loading || !file}
                className="w-full sm:w-auto"
              >
                <Zap className="h-4 w-4" />
                {loading ? "Analyzing…" : "Run AI Analysis"}
              </Button>
            </form>
          </section>

          <AnalysisSections
            analysis={analysis}
            resume={parsed}
            loading={loading}
          />

          <BeforeAfterSection
            suggestions={analysis?.suggestions ?? []}
            loading={loading}
          />

          <section id="guide" className="scroll-mt-24">
            <NextStepsSection
              hasResults={hasResults}
              onAnalyze={() => {
                document.querySelector("#analyze")?.scrollIntoView({ behavior: "smooth" });
                if (file) runAnalysis();
              }}
            />
          </section>

          <footer className="border-t border-white/10 pt-8 pb-12 text-center text-xs text-slate-600">
            ResumeAI Optimizer · Phase 1 extract + client-side insights · Phase 2
            adds backend semantic scoring
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
