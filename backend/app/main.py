"""
FastAPI application entry point.

Run locally:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.api.routes import health
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="AI Resume Optimization Agent — Backend API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS: allow frontend (Next.js) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health at root for load balancers / uptime checks
app.include_router(health.router, tags=["Health"])

# Versioned API
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root() -> dict:
    """Root redirect info for developers."""
    return {
        "message": "Resume Optimizer API",
        "docs": "/docs",
        "health": "/health",
    }
