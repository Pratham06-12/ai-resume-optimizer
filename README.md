# AI Resume Optimization Agent

Production-oriented resume analyzer: ATS scoring, semantic JD matching, recruiter-style feedback, and human-sounding bullet rewrites.

**Stack:** Next.js · Tailwind · FastAPI · Supabase · Gemini/Ollama · sentence-transformers

---

## Project Structure

```
agent/
├── docs/
│   └── ARCHITECTURE.md      # Full system design + diagrams
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── config.py          # Environment settings
│   │   ├── api/routes/        # HTTP endpoints
│   │   ├── models/schemas.py  # Request/response types
│   │   └── services/          # Business logic (parser, AI, etc.)
│   ├── uploads/               # Local file storage (dev)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/app/               # Next.js pages
│   ├── src/components/        # UI components
│   └── src/lib/               # API client, types
└── README.md
```

---

## Prerequisites

Install before starting:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.11+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| Git | any | https://git-scm.com/ |

Optional later: [Supabase](https://supabase.com), [Gemini API key](https://aistudio.google.com/apikey), or [Ollama](https://ollama.com)

---

## Phase 1 — Local Setup (Step by Step)

### Step 1: Open terminal in project root

```powershell
cd "c:\Users\prath\Desktop\my file\agent"
```

### Step 2: Backend virtual environment

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` if needed (defaults work for local dev).

### Step 3: Start backend

```powershell
# From backend/ with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected:** Browser opens http://localhost:8000/docs — Swagger UI with `GET /health` and `POST /api/v1/resume/extract`.

### Step 4: Frontend dependencies

Open a **second** terminal:

```powershell
cd "c:\Users\prath\Desktop\my file\agent\frontend"
npm install
copy .env.local.example .env.local
npm run dev
```

**Expected:** http://localhost:3000 — upload UI connected to backend.

### Step 5: Test Phase 1

1. Upload a PDF or DOCX resume on the frontend.
2. Paste any job description (optional in Phase 1 — stored for Phase 2).
3. Click **Extract Resume** — you should see parsed sections: skills, experience, education, projects.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | `development` or `production` | `development` |
| `CORS_ORIGINS` | Comma-separated frontend URLs | `http://localhost:3000` |
| `MAX_UPLOAD_MB` | Max resume file size | `10` |
| `UPLOAD_DIR` | Local upload folder | `./uploads` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | FastAPI base URL | `http://localhost:8000` |

---

## Common Errors

| Error | Fix |
|-------|-----|
| `Activate.ps1` cannot be loaded | Run: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `python` not found | Use `py -3.11` or reinstall Python with "Add to PATH" |
| CORS error in browser | Ensure backend runs on 8000 and `CORS_ORIGINS` includes `http://localhost:3000` |
| `pymupdf` install fails | Upgrade pip: `python -m pip install --upgrade pip` then retry |
| Frontend cannot reach API | Check `NEXT_PUBLIC_API_URL` in `.env.local` |

---

## API (Phase 1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/resume/extract` | Upload resume → structured JSON |

---

## Next Steps

After Phase 1 works locally, confirm with your mentor and proceed to **Phase 2**: JD analysis, embeddings, ATS scoring.

See `docs/ARCHITECTURE.md` for full design.
