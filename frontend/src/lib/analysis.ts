/**
 * Client-side analysis from parsed resume + job description.
 * Powers dashboard UI until Phase 2 backend scoring — no API changes.
 */

import type { ParsedResume } from "./types";

export interface AtsScores {
  atsMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  keywordMatch: number;
}

export interface BulletSuggestion {
  id: string;
  original: string;
  improved: string;
  reason: string;
  impact: "weak" | "moderate" | "strong";
  confidence: number;
  section: string;
}

export interface DashboardAnalysis {
  scores: AtsScores;
  strengths: string[];
  missingKeywords: string[];
  improvements: string[];
  suggestions: BulletSuggestion[];
  sectionCounts: {
    experience: number;
    skills: number;
    projects: number;
    education: number;
  };
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "this", "that", "from", "your", "will", "our",
  "are", "has", "have", "been", "were", "was", "can", "may", "all", "any",
  "job", "role", "team", "work", "using", "used", "ability", "required",
  "preferred", "including", "such", "other", "than", "into", "over", "also",
]);

const VAGUE_PATTERNS = [
  /worked on/i,
  /various/i,
  /helped with/i,
  /assisted/i,
  /responsible for/i,
  /involved in/i,
  /related to/i,
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function uniqueKeywords(tokens: string[]): string[] {
  const freq = new Map<string, number>();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 40);
}

function overlapPercent(jdWords: string[], resumeText: string): number {
  if (jdWords.length === 0) return 0;
  const resume = resumeText.toLowerCase();
  const found = jdWords.filter((w) => resume.includes(w)).length;
  return Math.round((found / jdWords.length) * 100);
}

function isWeakBullet(text: string): boolean {
  if (text.length < 45) return true;
  return VAGUE_PATTERNS.some((p) => p.test(text));
}

function improveBullet(bullet: string, jdKeywords: string[]): string {
  const matched = jdKeywords.filter((k) =>
    bullet.toLowerCase().includes(k)
  );
  const context =
    matched.length > 0
      ? matched.slice(0, 3).join(", ")
      : "relevant deliverables";

  let improved = bullet.trim();
  if (/^worked on/i.test(improved)) {
    improved = improved.replace(/^worked on/i, "Delivered");
  }
  if (/various/i.test(improved)) {
    improved = improved.replace(/various\s+/i, "");
  }
  if (improved.length < 80) {
    improved = `${improved.replace(/\.$/, "")}, applying ${context} to improve outcomes and stakeholder visibility.`;
  }
  if (!improved.endsWith(".")) improved += ".";
  return improved.charAt(0).toUpperCase() + improved.slice(1);
}

export function analyzeResume(
  resume: ParsedResume,
  jobDescription: string
): DashboardAnalysis {
  const jdTokens = tokenize(jobDescription);
  const jdKeywords = uniqueKeywords(jdTokens);
  const fullText = resume.raw_text;
  const skillsText = resume.skills.content + " " + resume.skills.items.join(" ");
  const expText =
    resume.experience.content + " " + resume.experience.items.join(" ");

  const keywordMatch = overlapPercent(jdKeywords, fullText);
  const skillsMatch = overlapPercent(jdKeywords, skillsText);
  const experienceMatch = overlapPercent(jdKeywords, expText);
  const atsMatch = Math.round(
    keywordMatch * 0.35 + skillsMatch * 0.3 + experienceMatch * 0.35
  );

  const scores: AtsScores = {
    atsMatch: Math.min(100, Math.max(0, atsMatch || 42)),
    skillsMatch: Math.min(100, Math.max(0, skillsMatch || 35)),
    experienceMatch: Math.min(100, Math.max(0, experienceMatch || 38)),
    keywordMatch: Math.min(100, Math.max(0, keywordMatch || 40)),
  };

  const strengths: string[] = [];
  if (resume.experience.items.length >= 2) {
    strengths.push("Multiple experience bullets give recruiters clear work history.");
  }
  if (resume.skills.items.length >= 4 || resume.skills.content.length > 30) {
    strengths.push("Skills section is present — helps ATS parsers categorize you.");
  }
  if (skillsMatch >= 50) {
    strengths.push("Strong overlap between your listed skills and the job description.");
  }
  if (resume.projects.items.length >= 1) {
    strengths.push("Projects section adds proof of hands-on work beyond job titles.");
  }
  if (strengths.length === 0) {
    strengths.push("Resume text extracted successfully — ready for targeted optimization.");
  }

  const resumeWords = new Set(tokenize(fullText));
  const missingKeywords = jdKeywords
    .filter((k) => !resumeWords.has(k) && fullText.toLowerCase().indexOf(k) === -1)
    .slice(0, 12);

  const improvements: string[] = [];
  if (!jobDescription.trim()) {
    improvements.push("Add a job description to unlock keyword gap analysis and match scores.");
  }
  if (missingKeywords.length > 4) {
    improvements.push(
      "Several JD terms are missing from your resume — weave them into real project or experience bullets."
    );
  }
  if (resume.experience.items.some(isWeakBullet)) {
    improvements.push(
      "Some bullets read task-oriented. Reframe them with ownership, scope, and technical outcome."
    );
  }
  if (resume.skills.items.length < 3 && resume.skills.content.length < 20) {
    improvements.push("Expand your skills section with tools explicitly mentioned in the JD.");
  }
  if (improvements.length === 0) {
    improvements.push("Fine-tune bullet impact language to align with senior recruiter expectations.");
  }

  const allBullets: { text: string; section: string }[] = [
    ...resume.experience.items.map((t) => ({ text: t, section: "Experience" })),
    ...resume.projects.items.map((t) => ({ text: t, section: "Projects" })),
  ];

  const suggestions: BulletSuggestion[] = allBullets
    .filter((b) => isWeakBullet(b.text))
    .slice(0, 4)
    .map((b, i) => ({
      id: `s-${i}`,
      original: b.text,
      improved: improveBullet(b.text, jdKeywords),
      reason:
        "This wording improves role relevance and replaces vague phrasing with outcome-oriented language.",
      impact: b.text.length < 40 ? "weak" : "moderate",
      confidence: 72 + Math.min(20, jdKeywords.length),
      section: b.section,
    }));

  if (suggestions.length === 0 && allBullets.length > 0) {
    const sample = allBullets[0];
    suggestions.push({
      id: "s-0",
      original: sample.text,
      improved: improveBullet(sample.text, jdKeywords),
      reason:
        "Even strong bullets can be tuned to mirror the language recruiters scan for in this JD.",
      impact: "strong",
      confidence: 85,
      section: sample.section,
    });
  }

  return {
    scores,
    strengths,
    missingKeywords,
    improvements,
    suggestions,
    sectionCounts: {
      experience: resume.experience.items.length,
      skills: resume.skills.items.length || (resume.skills.content ? 1 : 0),
      projects: resume.projects.items.length,
      education: resume.education.items.length || (resume.education.content ? 1 : 0),
    },
  };
}
