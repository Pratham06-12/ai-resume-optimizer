# Phase 1 — Detailed Setup Guide

This guide walks through **every** step for Phase 1. Do not skip steps.

---

## What Phase 1 Delivers

| Feature | Status |
|---------|--------|
| Monorepo folder structure | Done |
| FastAPI backend | Done |
| Next.js + Tailwind frontend | Done |
| PDF text extraction (PyMuPDF) | Done |
| DOCX text extraction (python-docx) | Done |
| Section parsing (skills, experience, education, projects) | Done |
| File upload API | Done |
| JD paste (stored as preview) | Done |
| ATS scoring | Phase 2 |
| AI rewrites | Phase 3 |

---

## System Flow (Phase 1)

```
User selects PDF/DOCX
        │
        ▼
Frontend validates type + size
        │
        ▼
POST /api/v1/resume/extract  (multipart: file + job_description)
        │
        ▼
Backend saves copy to uploads/ (for future version tracking)
        │
        ▼
ResumeParserService
   ├─ PDF  → PyMuPDF page text
   └─ DOCX → python-docx paragraphs + tables
        │
        ▼
Normalize whitespace
        │
        ▼
Detect section headers (Experience, Skills, …)
        │
        ▼
Split bullets per section
        │
        ▼
JSON response → Frontend displays sections
```

---

## Folder Map

```
backend/app/main.py              → Starts FastAPI, CORS, routes
backend/app/config.py            → .env settings
backend/app/api/routes/resume.py → Upload endpoint
backend/app/services/resume_parser.py → Core parsing logic
backend/app/models/schemas.py    → API JSON shapes

frontend/src/app/page.tsx        → Main UI
frontend/src/lib/api.ts          → Calls backend
frontend/src/components/*        → Upload, JD, results
```

---

## Why These Decisions?

1. **Monorepo** — One Git repo; frontend and backend deploy separately but share docs.
2. **Heuristic section parsing** — Free, fast, no training data. Phase 2 adds embeddings on top.
3. **Pydantic schemas** — Contract between teams; auto validation and OpenAPI docs.
4. **Separate `services/`** — Phase 2–4 add files without bloating routes.
5. **Local `uploads/`** — Supabase storage in Phase 4; local folder works on day one.

---

## GitHub Setup (Optional Now)

```powershell
cd "c:\Users\prath\Desktop\my file\agent"
git init
git add .
git commit -m "Phase 1: project scaffold, resume extraction API, Next.js UI"
```

Create a repo on GitHub, then:

```powershell
git remote add origin https://github.com/YOUR_USER/resume-optimizer.git
git branch -M main
git push -u origin main
```

Never commit `.env` or real resumes in `uploads/`.

---

## Confirm Phase 1 Before Phase 2

Checklist:

- [ ] `GET http://localhost:8000/health` returns `{"status":"ok",...}`
- [ ] Swagger at http://localhost:8000/docs shows extract endpoint
- [ ] Frontend at http://localhost:3000 shows "API connected"
- [ ] PDF resume extracts with Experience / Skills visible
- [ ] DOCX resume works the same way
- [ ] Error shown for wrong file type

Reply **"Phase 1 done"** to continue to Phase 2.
