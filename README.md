# ResumeIQ Pro ⚡

[![CI Pipeline](https://github.com/yeswitha-mudimela/resume-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/yeswitha-mudimela/resume-analyzer/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-green.svg)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**ResumeIQ Pro** is a production-grade, privacy-first **Applicant Tracking System (ATS) Resume Analyzer** and career intelligence engine. It evaluates resumes against industry role taxonomies and job descriptions, providing multi-dimensional scoring (0–100), keyword gap matrices, structural section audits, action verb impact checks, and optional AI-powered STAR bullet rewrites.

---

## 🚀 Key Features

- **Multi-Format Document Parsing**: High-fidelity extraction from `.pdf` (via `pdfplumber` / `pypdfium2`), `.docx` (Word), and plain `.txt`.
- **Scanned Document Detection**: Flags image-based/rasterized PDFs that would fail ATS OCR indexing.
- **14+ Curated Career Tracks**: Rich taxonomy spanning Frontend, Backend, Full Stack, Data Analyst, Data Scientist, ML Engineer, DevOps, Mobile, QA/SDET, Cybersecurity, Product Management, UI/UX, and General Professional profiles.
- **Multi-Factor ATS Scoring (0–100)**:
  - **40% Skills & Keywords Match**: Two-way synonym mapping (e.g. `JS` ↔ `JavaScript`, `K8s` ↔ `Kubernetes`) and regex-safe symbol handling (`C++`, `C#`, `.NET`, `Node.js`).
  - **25% Section Completeness**: Heading-aware section detection (Contact, Summary, Experience, Education, Skills, Projects, Certifications).
  - **20% ATS Formatting & Layout**: Word count, page density, and special symbol inspection.
  - **15% Impact & Action Verbs**: Quantifiable metrics detection (%, $, counts) and active leadership power verb scoring.
- **Career Stage Tailoring**: Differentiates scoring between **Students / Freshers** (prioritizing coursework and projects) and **Experienced Professionals** (prioritizing employment history and business impact).
- **Intelligent Job Description Overlap**: Extracts technical keywords from job descriptions, stripping English stop words to ensure high-relevance match scoring.
- **Hybrid AI Engine**: 100% deterministic local heuristic scoring by default (no external API key required); seamlessly activates **Google Gemini 2.5 Flash** for STAR-method bullet rewriting when `GEMINI_API_KEY` is provided.
- **Modern Responsive Dashboard**: Interactive skill badges (matched vs missing), copy-to-clipboard tools, print-ready CSS export for PDF reports.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React + Vite Client                  │
│  (Drag-and-Drop, Radial Gauge, Interactive Skill Matrix)│
└───────────────────────────┬────────────────────────────┘
                            │ Multipart Form / REST
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Flask Backend API                    │
│      (Validation, CORS, Rate Limiting, WSGI Server)     │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│ Document     │    │ Core ATS     │     │ Optional AI  │
│ Parser       │    │ Engine       │     │ Coach        │
│ (PDF/DOCX/   │    │ (Taxonomy,   │     │ (Gemini 2.5  │
│  TXT)        │    │  Synonyms,   │     │  Flash STAR  │
│              │    │  Heuristics) │     │  Rewrites)   │
└──────────────┘    └──────────────┘     └──────────────┘
```

---

## 🛠️ Project Structure

```
resume_analyzer_project/
├── app.py                      # Production Flask application & REST routes
├── analyzer.py                 # Backward-compatible adapter module
├── config.py                   # Environment configuration & limits
├── requirements.txt            # Pinned backend dependencies
├── Dockerfile                  # Container definition for backend
├── docker-compose.yml          # Full-stack Docker Compose orchestration
├── Procfile                    # WSGI start script for Render / Railway
├── .env.example                # Backend environment configuration template
├── services/
│   ├── parser.py               # PDF, DOCX, TXT parser & scanned doc detector
│   ├── ats_engine.py           # Multi-factor scoring, contact & verb audit
│   ├── taxonomy.py             # 14+ industry tracks, skill synonyms & dictionaries
│   └── ai_service.py           # Gemini AI coach with offline heuristic fallback
├── tests/
│   ├── test_parser.py          # Unit tests for multi-format document parser
│   ├── test_ats_engine.py      # Unit tests for scoring, contact, and regex safety
│   └── test_api.py             # Integration tests for Flask API endpoints
├── frontend/
│   ├── package.json            # Frontend dependencies and scripts
│   ├── vite.config.js          # Vite configuration
│   ├── Dockerfile              # Container definition for frontend (Nginx)
│   ├── .env.example            # Frontend environment configuration template
│   └── src/
│       ├── App.jsx             # Main application orchestrator
│       ├── App.css             # Modern design system & printable styling
│       ├── index.css           # Global typography & layout reset
│       ├── services/
│       │   └── api.js          # Centralized Axios client with fallback
│       └── components/
│           ├── Navbar.jsx          # Header with live API connection indicator
│           ├── UploadSection.jsx   # Drag-and-drop, role picker, sample JD presets
│           ├── ScoreDashboard.jsx  # Radial score gauge, 4 sub-metrics, metadata
│           ├── SkillsMatrix.jsx    # Matched vs missing skill chips with copy
│           ├── SuggestionsList.jsx # Prioritized recommendations checklist
│           ├── ImpactAudit.jsx     # Action verbs, metrics & power verbs reference
│           └── AiCoachModal.jsx    # AI bullet rewriter & STAR elevator pitch
└── .github/
    └── workflows/
        └── ci.yml              # Automated GitHub Actions test & build pipeline
```

---

## 💻 Getting Started Locally

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & `npm`
- Git

### 1. Backend Setup

```bash
# Clone repository
git clone https://github.com/yeswitha-mudimela/resume-analyzer.git
cd resume-analyzer

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set environment variables
cp .env.example .env

# Run the Flask backend
python app.py
```
The backend starts at `http://localhost:5000`. Test health: `curl http://localhost:5000/health`.

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

### Backend Test Suite (Pytest)
```bash
python -m pytest tests/ -v
```
All 15 unit and integration tests cover:
- Text extraction across `.txt`, `.docx`, and `.pdf`
- Handling unsupported files and scanned image documents
- Safe search of special character skills (`C++`, `C#`, `.NET`, `Node.js`)
- Two-way synonym matching (`ReactJS` ↔ `React`, `Golang` ↔ `Go`)
- Contact information parsing (Email, Phone, LinkedIn, GitHub)
- Section detection and Career Stage weighting
- Action verb and quantifiable metric auditing
- Flask REST endpoints (`/health`, `/api/roles`, `/analyze`, `/api/ai/critique`)

### Frontend Linting & Build
```bash
cd frontend
npm run lint
npm run build
```

---

## 🐳 Docker Deployment

Run both the backend API and frontend client with a single command:

```bash
docker-compose up --build
```
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🌐 API Reference

### `GET /health`
Returns API service status, uptime, version, and AI availability.

### `GET /api/roles`
Returns the list of 14+ supported career tracks and skill counts.

### `POST /analyze` (or `POST /api/analyze`)
Main multipart form endpoint for ATS resume analysis.
- **Parameters**:
  - `resume`: File binary (`.pdf`, `.docx`, `.txt`) **[Required]**
  - `role`: Target career track ID (e.g. `frontend developer`, `python developer`)
  - `user_type`: Career stage (`fresher` or `professional`)
  - `job_description`: Optional job posting text for keyword overlap scoring
- **Response**:
  ```json
  {
    "success": true,
    "score": 85.5,
    "tier": "ATS Optimized",
    "tier_color": "#10b981",
    "category_scores": {
      "skills": 82.0,
      "sections": 100.0,
      "formatting": 100.0,
      "impact": 75.0
    },
    "contact_info": {
      "email": "candidate@example.com",
      "phone": "+1 555-0199",
      "linkedin": "https://linkedin.com/in/candidate",
      "github": "https://github.com/candidate"
    },
    "skills_breakdown": {
      "matched_count": 14,
      "missing_count": 4,
      "matched": ["python", "sql", "docker", "fastapi", "..."],
      "missing": ["kubernetes", "redis", "..."]
    },
    "suggestions": {
      "keywords": ["..."],
      "sections": ["..."],
      "formatting": ["..."],
      "contact": ["..."],
      "impact": ["..."]
    }
  }
  ```

### `POST /api/ai/critique`
Generates STAR bullet rewrites and tailored executive summaries.
- **Request Body**:
  ```json
  {
    "resume_text": "...",
    "role": "frontend developer",
    "user_type": "fresher",
    "job_description": "..."
  }
  ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
