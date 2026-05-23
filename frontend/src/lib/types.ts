/**
 * TypeScript types mirror backend Pydantic models.
 * Keep in sync with backend/app/models/schemas.py
 */

export interface ResumeSection {
  title: string;
  content: string;
  items: string[];
}

export interface ParsedResume {
  raw_text: string;
  skills: ResumeSection;
  experience: ResumeSection;
  education: ResumeSection;
  projects: ResumeSection;
  other_sections: ResumeSection[];
  word_count: number;
  file_name: string;
  file_type: string;
}

export interface ResumeExtractResponse {
  success: boolean;
  message: string;
  data: ParsedResume;
  job_description_preview?: string | null;
}

export interface ApiError {
  detail: string | { msg: string }[];
}
