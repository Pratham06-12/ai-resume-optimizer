"""
Phase 1: Resume upload + extraction endpoint.

Accepts multipart form:
- file: PDF or DOCX
- job_description: optional text (stored in preview for Phase 2)
"""

import uuid
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import get_settings
from app.models.schemas import ResumeExtractResponse
from app.services.resume_parser import ResumeParserService

router = APIRouter()
parser = ResumeParserService()


@router.post("/extract", response_model=ResumeExtractResponse)
async def extract_resume(
    file: UploadFile = File(..., description="Resume PDF or DOCX"),
    job_description: str = Form(
        default="",
        description="Job description text (optional in Phase 1)",
    ),
) -> ResumeExtractResponse:
    """
    Upload a resume, extract structured sections, optionally accept JD.
    """
    settings = get_settings()

    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    try:
        ResumeParserService.validate_extension(file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size is {settings.max_upload_mb} MB.",
        )

    # Save locally for Phase 4 version tracking (optional dev copy)
    safe_name = f"{uuid.uuid4().hex}_{Path(file.filename).name}"
    save_path = settings.upload_path / safe_name
    save_path.write_bytes(content)

    try:
        parsed = parser.parse(content, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse resume: {type(e).__name__}",
        ) from e

    jd_preview = None
    if job_description and job_description.strip():
        jd_preview = job_description.strip()[:500]

    return ResumeExtractResponse(
        success=True,
        message="Resume extracted successfully",
        data=parsed,
        job_description_preview=jd_preview,
    )
