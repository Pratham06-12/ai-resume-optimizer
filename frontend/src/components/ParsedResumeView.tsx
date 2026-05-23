"use client";

import type { ParsedResume, ResumeSection } from "@/lib/types";

function SectionCard({ section }: { section: ResumeSection }) {
  if (!section.content && section.items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        {section.title}
      </h3>
      {section.items.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {section.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
          {section.content}
        </p>
      )}
    </div>
  );
}

interface ParsedResumeViewProps {
  data: ParsedResume;
}

export function ParsedResumeView({ data }: ParsedResumeViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {data.file_name}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {data.file_type.toUpperCase()}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {data.word_count} words
        </span>
      </div>

      <SectionCard section={data.experience} />
      <SectionCard section={data.skills} />
      <SectionCard section={data.projects} />
      <SectionCard section={data.education} />

      {data.other_sections.map((sec, i) => (
        <SectionCard key={i} section={sec} />
      ))}

      <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-600">
          View full raw text
        </summary>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-slate-600">
          {data.raw_text}
        </pre>
      </details>
    </div>
  );
}
