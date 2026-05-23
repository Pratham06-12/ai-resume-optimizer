/**
 * API client — all HTTP calls to FastAPI go through here.
 * Single place to change base URL, error handling, and auth later.
 */

import type { ResumeExtractResponse } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function extractResume(
  file: File,
  jobDescription: string
): Promise<ResumeExtractResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const res = await fetch(`${API_BASE}/api/v1/resume/extract`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      if (typeof err.detail === "string") {
        message = err.detail;
      } else if (Array.isArray(err.detail)) {
        message = err.detail.map((d: { msg?: string }) => d.msg).join(", ");
      }
    } catch {
      /* use default message */
    }
    throw new Error(message);
  }

  return res.json() as Promise<ResumeExtractResponse>;
}
