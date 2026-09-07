"""
Production Flask application for ATS Resume Analyzer.
Provides high-throughput endpoints for resume parsing, ATS scoring,
industry role taxonomies, and AI-assisted bullet rewrites.
"""

import os
import io
import time
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import Config, is_allowed_file
from services.parser import parse_resume_document, ParseError
from services.taxonomy import get_all_roles
from services.ats_engine import calculate_comprehensive_ats_score
from services.ai_service import generate_ai_critique, is_ai_available

# Initialize Flask application
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend clients
CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})

START_TIME = time.time()


# ==========================================
# Error Handlers
# ==========================================

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({
        "success": False,
        "error": {
            "code": 413,
            "message": "File is too large. Maximum allowed file size is 16 MB."
        }
    }), 413


@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "error": {
            "code": 400,
            "message": getattr(error, "description", "Bad request.")
        }
    }), 400


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "success": False,
        "error": {
            "code": 500,
            "message": "Internal server error occurred while processing the resume."
        }
    }), 500


# ==========================================
# Health & Discovery Endpoints
# ==========================================

@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health_check():
    uptime_seconds = int(time.time() - START_TIME)
    return jsonify({
        "status": "healthy",
        "service": "ATS Resume Analyzer API",
        "version": "2.0.0",
        "uptime_seconds": uptime_seconds,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ai_enabled": is_ai_available(),
        "supported_formats": list(Config.ALLOWED_EXTENSIONS)
    })


@app.route("/api/roles", methods=["GET"])
def get_roles():
    """Returns all available career tracks and their associated skills."""
    return jsonify({
        "success": True,
        "roles": get_all_roles()
    })


# ==========================================
# Main Resume Analysis Endpoint
# ==========================================

@app.route("/analyze", methods=["POST"])
@app.route("/api/analyze", methods=["POST"])
def analyze_resume():
    """
    Analyzes an uploaded resume against a target role, user level,
    and optional job description.
    """
    if "resume" not in request.files:
        return jsonify({
            "success": False,
            "error": {"code": 400, "message": "No 'resume' file provided in request."}
        }), 400

    file = request.files["resume"]
    if not file or file.filename == "":
        return jsonify({
            "success": False,
            "error": {"code": 400, "message": "Selected resume file is empty or missing a name."}
        }), 400

    filename = secure_filename(file.filename)
    if not is_allowed_file(filename):
        return jsonify({
            "success": False,
            "error": {
                "code": 400,
                "message": f"Unsupported file type. Permitted extensions: {', '.join(Config.ALLOWED_EXTENSIONS)}"
            }
        }), 400

    # Extract optional form parameters
    role = request.form.get("role", "general").strip().lower()
    user_type = request.form.get("user_type", "fresher").strip().lower()
    jd_text = request.form.get("job_description", "").strip()

    # Read binary stream and parse document
    try:
        file_bytes = io.BytesIO(file.read())
        metadata = parse_resume_document(file_bytes, filename)
    except ParseError as pe:
        return jsonify({
            "success": False,
            "error": {"code": 422, "message": str(pe)}
        }), 422
    except Exception as exc:
        return jsonify({
            "success": False,
            "error": {"code": 500, "message": f"Unexpected parsing failure: {str(exc)}"}
        }), 500

    resume_text = metadata.get("text", "")
    if not resume_text.strip():
        return jsonify({
            "success": False,
            "error": {
                "code": 422,
                "message": "Could not extract any readable text from the document. "
                           "The file may be image-based, encrypted, or corrupted."
            }
        }), 422

    # Execute ATS evaluation pipeline
    analysis = calculate_comprehensive_ats_score(
        text=resume_text,
        metadata=metadata,
        role=role,
        user_type=user_type,
        job_description=jd_text
    )

    response_payload = {
        "success": True,
        "metadata": {
            "filename": filename,
            "file_type": metadata["file_type"],
            "page_count": metadata["page_count"],
            "word_count": metadata["word_count"],
            "char_count": metadata["char_count"],
            "reading_time_minutes": metadata["reading_time_minutes"],
            "is_scanned": metadata["is_scanned"]
        },
        "target_role": role,
        "user_type": user_type,
        **analysis
    }

    return jsonify(response_payload)


# ==========================================
# AI Resume Coaching Endpoint
# ==========================================

@app.route("/api/ai/critique", methods=["POST"])
def ai_critique():
    """
    Generates tailored STAR-method bullet-point rewrites and
    executive summary for the candidate.
    """
    data = request.get_json(silent=True) or {}
    resume_text = data.get("resume_text", "")
    role = data.get("role", "general")
    user_type = data.get("user_type", "fresher")
    job_description = data.get("job_description", "")

    if not resume_text.strip():
        return jsonify({
            "success": False,
            "error": {"code": 400, "message": "Field 'resume_text' is required for AI critique."}
        }), 400

    critique = generate_ai_critique(
        resume_text=resume_text,
        role=role,
        user_type=user_type,
        job_description=job_description
    )

    return jsonify({
        "success": True,
        "critique": critique
    })


if __name__ == "__main__":
    port = Config.PORT
    debug = Config.DEBUG
    print(f"Starting ATS Resume Analyzer server on port {port} (debug={debug})...")
    app.run(host="0.0.0.0", port=port, debug=debug)