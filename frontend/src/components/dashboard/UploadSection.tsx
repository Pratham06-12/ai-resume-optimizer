"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UploadSectionProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  progress?: number;
}

export function UploadSection({
  file,
  onFileChange,
  disabled,
  progress = 0,
}: UploadSectionProps) {
  const validate = (f: File | null) => {
    if (!f) {
      onFileChange(null);
      return;
    }
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
    if (![".pdf", ".docx"].includes(ext)) return;
    if (f.size > 10 * 1024 * 1024) return;
    onFileChange(f);
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
        "border-purple-500/30 bg-purple-500/5 upload-glow",
        disabled && "pointer-events-none opacity-50"
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!disabled) validate(e.dataTransfer.files[0] ?? null);
      }}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled}
        onChange={(e) => validate(e.target.files?.[0] ?? null)}
      />

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/40 to-cyan-500/30 border border-white/10"
            >
              <Upload className="h-8 w-8 text-purple-300" />
            </motion.div>
            <p className="text-lg font-semibold text-white">
              Drop your resume here
            </p>
            <p className="mt-1 text-sm text-slate-400">
              or click to browse — PDF & DOCX up to 10MB
            </p>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline">PDF</Badge>
              <Badge variant="outline">DOCX</Badge>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
              <FileText className="h-7 w-7 text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-white">{file.name}</p>
              <p className="text-sm text-slate-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              {progress > 0 && progress < 100 && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
