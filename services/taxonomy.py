"""
Role and skill taxonomy for the ATS Resume Analyzer.
Contains comprehensive mappings for technical and professional roles,
categorized skills, and common skill aliases/synonyms.
"""

# Common aliases and synonyms to normalize varied resume naming conventions
SKILL_SYNONYMS = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "golang": "go",
    "reactjs": "react",
    "react.js": "react",
    "vuejs": "vue",
    "vue.js": "vue",
    "angularjs": "angular",
    "nodejs": "node.js",
    "node": "node.js",
    "expressjs": "express",
    "express.js": "express",
    "nextjs": "next.js",
    "next": "next.js",
    "k8s": "kubernetes",
    "kube": "kubernetes",
    "docker containers": "docker",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "mssql": "sql server",
    "ms sql": "sql server",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    "microsoft azure": "azure",
    "ci cd": "ci/cd",
    "cicd": "ci/cd",
    "continuous integration": "ci/cd",
    "machine learning": "machine learning",
    "ml": "machine learning",
    "deep learning": "deep learning",
    "dl": "deep learning",
    "artificial intelligence": "ai",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "rest": "rest api",
    "restful": "rest api",
    "rest apis": "rest api",
    "graphql": "graphql",
    "html5": "html",
    "css3": "css",
    "sass": "scss",
    "tailwind": "tailwind css",
    "git version control": "git",
    "github": "git",
    "gitlab": "git",
    "tf": "tensorflow",
    "sklearn": "scikit-learn",
}

# Build inverted mapping for two-way synonym resolution
_INVERTED_SYNONYMS = {}
for _alias, _canonical in SKILL_SYNONYMS.items():
    _INVERTED_SYNONYMS.setdefault(_canonical, set()).add(_alias)

def get_skill_variants(keyword: str) -> set[str]:
    """Returns the set of all equivalent spellings, aliases, and abbreviations for a skill."""
    k = keyword.strip().lower()
    variants = {k}
    canonical = SKILL_SYNONYMS.get(k, k)
    variants.add(canonical)
    if canonical in _INVERTED_SYNONYMS:
        variants.update(_INVERTED_SYNONYMS[canonical])
    return variants

# 14+ Industry Roles with categorized skill requirements
ROLE_TAXONOMY = {
    "frontend developer": {
        "title": "Frontend Developer",
        "description": "Building modern, accessible, and responsive user interfaces.",
        "skills": {
            "core": ["javascript", "html", "css", "typescript"],
            "frameworks": ["react", "vue", "angular", "next.js"],
            "tools": ["git", "webpack", "vite", "npm", "tailwind css"],
            "concepts": ["responsive design", "web performance", "rest api", "accessibility", "state management"],
            "soft_skills": ["collaboration", "problem solving", "communication", "attention to detail"]
        }
    },
    "backend developer": {
        "title": "Backend Developer",
        "description": "Designing scalable server-side systems, databases, and APIs.",
        "skills": {
            "core": ["python", "java", "node.js", "go", "sql"],
            "frameworks": ["fastapi", "django", "flask", "spring boot", "express"],
            "databases": ["postgresql", "mysql", "mongodb", "redis"],
            "tools": ["docker", "git", "linux", "postman"],
            "concepts": ["rest api", "microservices", "system design", "orm", "authentication", "caching"],
            "soft_skills": ["problem solving", "debugging", "teamwork", "code review"]
        }
    },
    "full stack developer": {
        "title": "Full Stack Developer",
        "description": "End-to-end web application development from UI to persistence.",
        "skills": {
            "core": ["javascript", "typescript", "python", "html", "css", "sql"],
            "frontend": ["react", "next.js", "tailwind css"],
            "backend": ["node.js", "express", "django", "fastapi"],
            "databases": ["postgresql", "mongodb", "redis"],
            "cloud_tools": ["git", "docker", "aws", "ci/cd", "rest api"],
            "soft_skills": ["adaptability", "problem solving", "agile", "communication"]
        }
    },
    "python developer": {
        "title": "Python Developer",
        "description": "Specialized Python engineering for web services, automation, and data systems.",
        "skills": {
            "core": ["python", "sql", "git", "linux"],
            "frameworks": ["django", "flask", "fastapi", "sqlalchemy"],
            "databases": ["postgresql", "mysql", "redis", "sqlite"],
            "tools": ["celery", "pytest", "docker", "poetry"],
            "concepts": ["rest api", "oop", "asynchronous programming", "multithreading", "unit testing"],
            "soft_skills": ["clean code", "problem solving", "collaboration"]
        }
    },
    "data analyst": {
        "title": "Data Analyst",
        "description": "Extracting business insights, building dashboards, and statistical reporting.",
        "skills": {
            "core": ["sql", "python", "excel", "statistics"],
            "tools": ["tableau", "power bi", "pandas", "numpy", "jupyter"],
            "concepts": ["data visualization", "a/b testing", "data cleaning", "etl", "business intelligence"],
            "soft_skills": ["storytelling", "critical thinking", "business acumen", "communication"]
        }
    },
    "data scientist": {
        "title": "Data Scientist",
        "description": "Predictive modeling, statistical inference, and experimental analysis.",
        "skills": {
            "core": ["python", "r", "sql", "mathematics", "statistics"],
            "libraries": ["pandas", "numpy", "scikit-learn", "scipy", "statsmodels"],
            "visualization": ["matplotlib", "seaborn", "tableau"],
            "concepts": ["machine learning", "feature engineering", "hypothesis testing", "data mining"],
            "soft_skills": ["research", "analytical thinking", "presentation", "problem solving"]
        }
    },
    "machine learning engineer": {
        "title": "Machine Learning Engineer",
        "description": "Developing, deploying, and scaling AI/ML models in production.",
        "skills": {
            "core": ["python", "c++", "sql", "linear algebra"],
            "frameworks": ["tensorflow", "pytorch", "scikit-learn", "keras", "hugging face"],
            "deployment": ["docker", "kubernetes", "mlflow", "fastapi", "aws"],
            "concepts": ["deep learning", "nlp", "computer vision", "model optimization", "data pipelines"],
            "soft_skills": ["curiosity", "problem solving", "collaboration"]
        }
    },
    "devops engineer": {
        "title": "DevOps / Cloud Engineer",
        "description": "Automating infrastructure, CI/CD pipelines, and cloud reliability.",
        "skills": {
            "core": ["linux", "bash", "python", "networking"],
            "cloud": ["aws", "azure", "gcp"],
            "infrastructure": ["docker", "kubernetes", "terraform", "ansible"],
            "ci_cd": ["jenkins", "github actions", "gitlab ci", "ci/cd"],
            "concepts": ["monitoring", "prometheus", "grafana", "security", "infrastructure as code"],
            "soft_skills": ["incident management", "troubleshooting", "communication"]
        }
    },
    "mobile developer": {
        "title": "Mobile Developer",
        "description": "Native and cross-platform mobile apps for iOS and Android.",
        "skills": {
            "core": ["swift", "kotlin", "javascript", "dart"],
            "frameworks": ["react native", "flutter", "swiftui", "jetpack compose"],
            "tools": ["xcode", "android studio", "git", "cocoapods"],
            "concepts": ["mobile ui", "offline storage", "push notifications", "app store deployment", "rest api"],
            "soft_skills": ["user-centric mindset", "attention to detail", "teamwork"]
        }
    },
    "qa engineer": {
        "title": "QA / SDET Engineer",
        "description": "Test automation, quality assurance, and software reliability verification.",
        "skills": {
            "core": ["python", "javascript", "java", "sql"],
            "automation": ["selenium", "cypress", "playwright", "pytest", "postman"],
            "tools": ["jira", "git", "jenkins", "docker"],
            "concepts": ["unit testing", "integration testing", "e2e testing", "api testing", "ci/cd"],
            "soft_skills": ["meticulousness", "communication", "analytical skills"]
        }
    },
    "cybersecurity analyst": {
        "title": "Cybersecurity Analyst",
        "description": "Securing digital assets, vulnerability scanning, and threat monitoring.",
        "skills": {
            "core": ["networking", "linux", "python", "powershell"],
            "tools": ["wireshark", "nmap", "metasploit", "siem", "burp suite"],
            "concepts": ["penetration testing", "vulnerability assessment", "incident response", "cryptography", "owasp"],
            "soft_skills": ["ethical mindset", "critical thinking", "investigation"]
        }
    },
    "product manager": {
        "title": "Product Manager",
        "description": "Leading product vision, cross-functional roadmaps, and metric delivery.",
        "skills": {
            "core": ["product roadmap", "user research", "wireframing", "market analysis"],
            "tools": ["jira", "confluence", "figma", "mixpanel", "google analytics"],
            "methodologies": ["agile", "scrum", "kanban", "okrs", "user stories"],
            "concepts": ["product lifecycle", "a/b testing", "kpis", "customer discovery"],
            "soft_skills": ["leadership", "stakeholder management", "communication", "negotiation"]
        }
    },
    "ui ux designer": {
        "title": "UI / UX Designer",
        "description": "Designing intuitive user flows, design systems, and delightful interfaces.",
        "skills": {
            "core": ["user interface", "user experience", "wireframing", "prototyping"],
            "tools": ["figma", "adobe xd", "sketch", "illustrator"],
            "concepts": ["design systems", "usability testing", "information architecture", "responsive design", "accessibility"],
            "soft_skills": ["empathy", "creative thinking", "presentation", "collaboration"]
        }
    },
    "general": {
        "title": "General Professional",
        "description": "Foundational professional profile across modern knowledge industries.",
        "skills": {
            "core": ["python", "sql", "git", "excel"],
            "tools": ["jira", "slack", "notion", "google workspace"],
            "concepts": ["problem solving", "data analysis", "project management"],
            "soft_skills": ["communication", "collaboration", "leadership", "time management", "critical thinking"]
        }
    }
}

# Standard resume section aliases and header variations
SECTION_ALIASES = {
    "contact": [
        "contact", "contact information", "contact info", "contact details",
        "personal info", "personal information", "get in touch"
    ],
    "summary": [
        "summary", "professional summary", "about me", "objective",
        "career objective", "profile", "executive summary", "about"
    ],
    "experience": [
        "experience", "work experience", "professional experience",
        "employment history", "work history", "internships", "career history"
    ],
    "skills": [
        "skills", "technical skills", "core competencies", "competencies",
        "technologies", "tech stack", "tools & technologies", "skills & tools",
        "key skills"
    ],
    "education": [
        "education", "academic background", "qualifications",
        "educational background", "academic history", "degrees", "academics"
    ],
    "projects": [
        "projects", "personal projects", "academic projects",
        "key projects", "notable projects", "open source", "portfolio projects"
    ],
    "certifications": [
        "certifications", "licenses", "certificates", "credentials",
        "courses", "professional development", "training"
    ],
    "awards": [
        "awards", "honors", "achievements", "accomplishments", "recognition"
    ]
}

# Action verbs that indicate strong leadership, engineering, and quantifiable contributions
POWER_ACTION_VERBS = [
    "accelerated", "achieved", "administered", "analyzed", "architected",
    "automated", "built", "centralized", "championed", "collaborated",
    "conceived", "consolidated", "constructed", "coordinated", "created",
    "decreased", "delivered", "deployed", "designed", "developed",
    "directed", "eliminated", "engineered", "enhanced", "established",
    "evaluated", "executed", "expanded", "expedited", "formulated",
    "generated", "guided", "implemented", "improved", "increased",
    "initiated", "innovated", "installed", "instituted", "integrated",
    "introduced", "invented", "launched", "lead", "led", "managed",
    "maximized", "mentored", "minimized", "modernized", "negotiated",
    "optimized", "orchestrated", "organized", "overhauled", "oversaw",
    "pioneered", "planned", "produced", "programmed", "promoted",
    "reduced", "refactored", "resolved", "restructured", "revamped",
    "scaled", "simplified", "spearheaded", "standardized", "streamlined",
    "strengthened", "succeeded", "supervised", "transformed", "unified",
    "upgraded", "validated", "yielded"
]

# Weak, passive, or vague expressions to avoid on a high-impact resume
WEAK_PASSIVE_PHRASES = [
    "worked on", "responsible for", "helped with", "assisted in", "tasked with",
    "participated in", "handled", "involved in", "duties included", "familiar with"
]

def get_role_keywords(role_name: str) -> list[str]:
    """Flattens all categorized skills for a given role into a single list of unique keywords."""
    norm_role = role_name.strip().lower()
    role_info = ROLE_TAXONOMY.get(norm_role, ROLE_TAXONOMY["general"])
    
    all_skills = []
    for category, skills in role_info["skills"].items():
        all_skills.extend(skills)
    
    return sorted(list(set(all_skills)))

# Aggregate of all known technical and professional skills across the taxonomy
ALL_KNOWN_SKILLS = set()
for _r in ROLE_TAXONOMY.values():
    for _skill_list in _r["skills"].values():
        ALL_KNOWN_SKILLS.update(_s.lower() for _s in _skill_list)
ALL_KNOWN_SKILLS.update(SKILL_SYNONYMS.keys())
ALL_KNOWN_SKILLS.update(SKILL_SYNONYMS.values())

def get_all_roles() -> list[dict]:
    """Returns metadata for all available roles to populate frontend selectors."""
    roles_list = []
    for role_id, data in ROLE_TAXONOMY.items():
        roles_list.append({
            "id": role_id,
            "title": data["title"],
            "description": data["description"],
            "skill_count": len(get_role_keywords(role_id))
        })
    return roles_list
