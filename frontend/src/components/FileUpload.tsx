"use client";

import { useCallback, useState } from "react";

const ACCEPTED = ".pdf,.docx";
const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUpload({
  file,
  onFileChange,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const validateAndSet = useCallback(
    (f: File | null) => {
      if (!f) {
        onFileChange(null);
        return;
      }
      const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
      if (![".pdf", ".docx"].includes(ext)) {
        alert("Please upload a PDF or DOCX file.");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        alert("File must be under 10 MB.");
        return;
      }
      onFileChange(f);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSet(dropped);
    },
    [disabled, validateAndSet]
  );

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragActive
          ? "border-brand-500 bg-brand-50"
          : "border-slate-300 bg-white hover:border-brand-500"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept={ACCEPTED}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled}
        onChange={(e) => validateAndSet(e.target.files?.[0] ?? null)}
      />
      <div className="pointer-events-none">
        <p className="text-lg font-medium text-slate-800">
          Drop your resume here
        </p>
        <p className="mt-1 text-sm text-slate-500">PDF or DOCX — max 10 MB</p>
        {file && (
          <p className="mt-4 text-sm font-medium text-brand-700">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>
    </div>
  );
}
