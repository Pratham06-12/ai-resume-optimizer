"""
Pydantic models define the API contract between frontend and backend.
Every response shape is explicit — easier to debug and extend per phase.
"""

from typing import Optional

from pydantic import BaseModel, Field


class ResumeSection(BaseModel):
    """One logical block of the resume (experience bullet, skill line, etc.)."""

    title: str = Field(..., description="Section heading, e.g. Experience")
    content: str = Field(..., description="Raw text under that section")
    items: list[str] = Field(
        default_factory=list,
        description="Split bullets or lines for UI display",
    )


class ParsedResume(BaseModel):
    """Structured resume after PDF/DOCX extraction."""

    raw_text: str = Field(..., description="Full cleaned plain text")
    skills: ResumeSection
    experience: ResumeSection
    education: ResumeSection
    projects: ResumeSection
    other_sections: list[ResumeSection] = Field(default_factory=list)
    word_count: int = 0
    file_name: str = ""
    file_type: str = Field(..., description="pdf or docx")


class ResumeExtractResponse(BaseModel):
    """Response for Phase 1 extract endpoint."""

    success: bool = True
    message: str = "Resume extracted successfully"
    data: ParsedResume
    job_description_preview: Optional[str] = Field(
        None,
        description="First 500 chars of JD if sent with request (Phase 2 uses full JD)",
    )


class HealthResponse(BaseModel):
    status: str = "ok"
    app_name: str
    environment: str
