from fastapi import APIRouter

from app.api.routes import resume

api_router = APIRouter()
api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])
