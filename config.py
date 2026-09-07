"""
Production configuration module for Resume Analyzer backend.
"""

import os

class Config:
    PORT = int(os.environ.get("PORT", 5000))
    DEBUG = os.environ.get("FLASK_ENV") == "development"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload limit
    ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

def is_allowed_file(filename: str) -> bool:
    """Verifies that the uploaded file has a permissible extension."""
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS
