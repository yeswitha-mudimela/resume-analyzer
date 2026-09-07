"""
Analyzer module providing backward-compatible entry points
delegating to the robust ATS Scoring Engine in services.ats_engine.
"""

import re
from typing import Dict, List, Any
from services.ats_engine import (
    safe_keyword_search,
    detect_sections,
    audit_formatting_and_layout,
    calculate_comprehensive_ats_score,
    audit_action_verbs_and_impact,
    extract_contact_info
)
from services.taxonomy import SECTION_ALIASES, POWER_ACTION_VERBS, WEAK_PASSIVE_PHRASES


def analyser(inp: str, wordlist: List[str]) -> Dict[str, bool]:
    """
    Safely searches for keyword presence in resume text,
    avoiding regex crashes on special characters like C++, C#, .NET.
    """
    result = {}
    for keyword in wordlist:
        result[keyword] = safe_keyword_search(keyword, inp)
    return result


def scorecalculator(result: Dict[str, bool]) -> float:
    """
    Calculates 0-10 score based on keyword match ratio.
    Safely handles empty keyword list.
    """
    if not result:
        return 0.0
    add = sum(1 for v in result.values() if v)
    score = (add / len(result)) * 10
    return round(score, 1)


def section_checker_v2(text: str, section_aliases: Dict[str, List[str]] = None) -> Dict[str, bool]:
    """
    Heading-aware section detection across resume text.
    """
    return detect_sections(text)


def suggestor(result: Dict[str, bool]) -> List[str]:
    """
    Generates actionable skill suggestions for missing keywords.
    """
    suggestions = []
    for keyword, found in result.items():
        if not found:
            suggestions.append(f"Add '{keyword}' to your skills or project descriptions")
    return suggestions


def section_checker(missing_section: Dict[str, bool], user_type: str = "fresher") -> List[str]:
    """
    Generates contextual section suggestions based on user career stage.
    """
    suggestions = []
    for section, found in missing_section.items():
        if not found:
            if section == "experience":
                if user_type == "fresher":
                    suggestion = "No experience section found. As a student/fresher, highlight substantial academic or personal projects."
                else:
                    suggestion = "No experience section found. Experienced professionals must include a clear employment history."
            elif section == "projects":
                if user_type == "fresher":
                    suggestion = "No projects section found. This is critical for freshers — add at least 2-3 detailed technical projects."
                else:
                    suggestion = "Consider adding a projects or portfolio section to showcase recent work."
            elif section == "education":
                suggestion = "No education section found. Include your degree, institution, and graduation year."
            elif section == "skills":
                suggestion = "No technical skills section found. Group your competencies under clear categories."
            else:
                suggestion = f"Missing {section.title()} section. Consider adding it to pass ATS section indexing."
            suggestions.append(suggestion)
    return suggestions


def formatting_checker(text: str) -> List[str]:
    """
    Inspects document text for ATS formatting issues.
    """
    word_count = len(text.split())
    metadata = {
        "word_count": word_count,
        "page_count": max(1, round(word_count / 350)),
        "is_scanned": word_count < 25
    }
    _, suggestions = audit_formatting_and_layout(metadata, text)
    return suggestions