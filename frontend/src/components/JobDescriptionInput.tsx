"use client";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function JobDescriptionInput({
  value,
  onChange,
  disabled = false,
}: JobDescriptionInputProps) {
  return (
    <div>
      <label
        htmlFor="jd"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Job Description
      </label>
      <textarea
        id="jd"
        rows={10}
        placeholder="Paste the full job description here..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <p className="mt-1 text-xs text-slate-500">
        Phase 1 saves a preview only. Full JD analysis starts in Phase 2.
      </p>
    </div>
  );
}
