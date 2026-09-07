import pytest
from services.ats_engine import (
    safe_keyword_search,
    extract_contact_info,
    detect_sections,
    audit_action_verbs_and_impact,
    audit_formatting_and_layout,
    calculate_comprehensive_ats_score
)

def test_safe_keyword_search_special_chars():
    sample_text = "Proficient in C++, C#, .NET framework, Node.js, and CI/CD pipelines."
    assert safe_keyword_search("c++", sample_text) is True
    assert safe_keyword_search("c#", sample_text) is True
    assert safe_keyword_search("node.js", sample_text) is True
    assert safe_keyword_search("ci/cd", sample_text) is True
    assert safe_keyword_search("ruby", sample_text) is False

def test_safe_keyword_search_synonyms():
    sample_text = "Experienced in ReactJS, Golang, and Postgres databases."
    assert safe_keyword_search("react", sample_text) is True
    assert safe_keyword_search("go", sample_text) is True
    assert safe_keyword_search("postgresql", sample_text) is True

def test_extract_contact_info():
    resume_text = """
    Jane Doe
    jane.doe@techuniversity.edu | (555) 123-4567
    https://linkedin.com/in/janedoe
    https://github.com/janedoe
    San Francisco, CA
    """
    contacts = extract_contact_info(resume_text)
    assert contacts["email"] == "jane.doe@techuniversity.edu"
    assert contacts["phone"] is not None
    assert "linkedin.com/in/janedoe" in contacts["linkedin"]
    assert "github.com/janedoe" in contacts["github"]
    assert contacts["completeness_score"] == 100

def test_detect_sections():
    resume_text = """
    PROFESSIONAL SUMMARY
    Motivated software developer.
    
    WORK EXPERIENCE
    Software Engineer at Acme Corp.
    
    EDUCATION
    BS in Computer Science.
    
    SKILLS
    Python, SQL, AWS, Docker.
    
    PROJECTS
    Built an automated trading bot.
    """
    sections = detect_sections(resume_text)
    assert sections["summary"] is True
    assert sections["experience"] is True
    assert sections["education"] is True
    assert sections["skills"] is True
    assert sections["projects"] is True

def test_audit_action_verbs_and_impact():
    resume_text = """
    - Architected scalable data pipeline processing 500,000 events daily, reducing latency by 45%.
    - Spearheaded cloud migration to AWS saving $120,000 annually.
    - Responsible for team meetings and worked on bug tickets.
    """
    audit = audit_action_verbs_and_impact(resume_text)
    assert "architected" in audit["found_power_verbs"]
    assert "spearheaded" in audit["found_power_verbs"]
    assert "worked on" in audit["found_weak_phrases"]
    assert audit["has_quantifiable_results"] is True
    assert audit["score"] >= 50

def test_calculate_comprehensive_ats_score():
    resume_text = """
    Sarah Connor
    sarah@cyberdyne.com | +1 555 987 6543 | linkedin.com/in/sarahconnor | github.com/sarahconnor
    
    Professional Summary
    Senior Python Developer with 6 years building microservices and cloud infrastructure.
    
    Technical Skills
    Python, Django, Flask, FastAPI, Docker, PostgreSQL, Redis, Celery, Pytest, Git, Linux, REST API.
    
    Work Experience
    Senior Engineer at Skynet Systems
    - Architected high-throughput REST API serving 2,000,000 daily requests with 99.99% uptime.
    - Automated deployment pipelines using Docker and Linux, slashing deploy times by 60%.
    - Mentored 4 junior engineers on clean architecture and unit testing with pytest.
    
    Education
    Bachelor of Science in Computer Science, Tech University
    
    Projects
    - Open-source distributed caching system built in Python and Redis.
    """
    metadata = {
        "word_count": 350,
        "page_count": 1,
        "is_scanned": False
    }
    
    result = calculate_comprehensive_ats_score(
        text=resume_text,
        metadata=metadata,
        role="python developer",
        user_type="professional",
        job_description="Looking for a Python Developer skilled in Django, PostgreSQL, Docker, and REST API."
    )
    
    assert result["score"] >= 75
    assert result["tier"] in ["ATS Optimized", "Competitive"]
    assert result["category_scores"]["skills"] > 60
    assert result["skills_breakdown"]["matched_count"] > 5
    assert result["contact_info"]["email"] == "sarah@cyberdyne.com"
