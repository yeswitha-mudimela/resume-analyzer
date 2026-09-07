"""
Core ATS (Applicant Tracking System) Scoring and Intelligence Engine.
Evaluates resume text for keyword matches, contact information, section completeness,
ATS formatting readability, and quantifiable action-oriented impact.
"""

import re
from typing import Dict, List, Any, Set, Tuple
from services.taxonomy import (
    ROLE_TAXONOMY,
    SECTION_ALIASES,
    SKILL_SYNONYMS,
    POWER_ACTION_VERBS,
    WEAK_PASSIVE_PHRASES,
    get_role_keywords,
    get_skill_variants,
    ALL_KNOWN_SKILLS
)

# Standard English stop words to exclude from automated JD parsing
STOP_WORDS = {
    "about", "above", "across", "after", "again", "against", "all", "almost",
    "alone", "along", "already", "also", "although", "always", "among", "an",
    "and", "another", "any", "anybody", "anyone", "anything", "anywhere", "are",
    "area", "areas", "around", "ask", "asked", "asking", "asks", "at", "away",
    "back", "backed", "backing", "backs", "be", "became", "because", "become",
    "becomes", "becoming", "been", "before", "began", "behind", "being", "beings",
    "best", "better", "between", "big", "both", "but", "by", "came", "can",
    "cannot", "case", "cases", "certain", "certainly", "clear", "clearly", "come",
    "could", "did", "differ", "different", "differently", "do", "does", "done",
    "down", "downed", "downing", "downs", "during", "each", "early", "either",
    "end", "ended", "ending", "ends", "enough", "even", "evenly", "ever", "every",
    "everybody", "everyone", "everything", "everywhere", "face", "faces", "fact",
    "facts", "far", "felt", "few", "fewer", "find", "finds", "first", "for",
    "four", "from", "full", "fully", "further", "furthered", "furthering",
    "furthers", "gave", "general", "generally", "get", "gets", "give", "given",
    "gives", "go", "going", "goods", "got", "great", "greater", "greatest",
    "group", "grouped", "grouping", "groups", "had", "has", "have", "having",
    "he", "her", "here", "herself", "high", "higher", "highest", "him",
    "himself", "his", "how", "however", "if", "important", "important", "in",
    "interest", "interested", "interesting", "interests", "into", "is", "it",
    "its", "itself", "just", "keep", "keeps", "kind", "knew", "know", "known",
    "knows", "large", "largely", "last", "later", "latest", "least", "less",
    "let", "lets", "like", "likely", "long", "longer", "longest", "made", "make",
    "making", "man", "many", "may", "me", "member", "members", "men", "might",
    "more", "most", "mostly", "mr", "mrs", "much", "must", "my", "myself",
    "name", "necessary", "need", "needed", "needing", "needs", "never", "new",
    "newer", "newest", "next", "no", "nobody", "non", "noone", "not", "nothing",
    "now", "nowhere", "number", "numbers", "of", "off", "often", "old", "older",
    "oldest", "on", "once", "one", "only", "open", "opened", "opening", "opens",
    "or", "order", "ordered", "ordering", "orders", "other", "others", "our",
    "out", "over", "part", "parted", "parting", "parts", "per", "place",
    "places", "point", "pointed", "pointing", "points", "possible", "present",
    "presented", "presenting", "presents", "problem", "problems", "put", "puts",
    "quite", "rather", "really", "right", "room", "rooms", "said", "same", "saw",
    "say", "says", "second", "seconds", "see", "seem", "seemed", "seeming",
    "seems", "sees", "several", "shall", "she", "should", "show", "showed",
    "showing", "shows", "side", "sides", "since", "small", "smaller", "smallest",
    "so", "some", "somebody", "someone", "something", "somewhere", "state",
    "states", "still", "such", "sure", "take", "taken", "than", "that", "the",
    "their", "them", "then", "there", "therefore", "these", "they", "thing",
    "things", "think", "thinks", "this", "those", "though", "thought", "thoughts",
    "three", "through", "thus", "to", "today", "together", "too", "took", "toward",
    "turn", "turned", "turning", "turns", "two", "under", "until", "up", "upon",
    "us", "use", "used", "uses", "very", "want", "wanted", "wanting", "wants",
    "was", "way", "ways", "we", "well", "wells", "went", "were", "what", "when",
    "where", "whether", "which", "while", "who", "whole", "whom", "whose", "why",
    "will", "with", "within", "without", "work", "worked", "working", "works",
    "would", "year", "years", "yet", "you", "young", "younger", "youngest", "your",
    "yours", "responsibilities", "requirements", "qualifications", "preferred",
    "duties", "role", "overview", "team", "candidates", "applicant", "applicants"
}


def safe_keyword_search(keyword: str, text: str) -> bool:
    """
    Safely searches for a keyword or phrase in text across all its synonyms and variants,
    respecting word boundaries without crashing on special characters like C++, C#, .NET, or Node.js.
    """
    clean_kw = keyword.strip().lower()
    clean_text = text.lower()

    if not clean_kw:
        return False

    variants = get_skill_variants(clean_kw)
    for var in variants:
        escaped = re.escape(var)
        pattern = rf"(?<![a-zA-Z0-9_]){escaped}(?![a-zA-Z0-9_])"
        try:
            if bool(re.search(pattern, clean_text)):
                return True
        except re.error:
            pass

        if f" {var} " in f" {clean_text} ":
            return True

    return False


def extract_contact_info(text: str) -> Dict[str, Any]:
    """
    Extracts essential contact information and URLs from resume text.
    ATS algorithms heavily prioritize reachability.
    """
    # Email detection
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    email = email_match.group(0) if email_match else None

    # Phone detection (supports US, Indian, international formats)
    phone_match = re.search(
        r"(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}",
        text
    )
    phone = phone_match.group(0).strip() if phone_match and len(phone_match.group(0).strip()) >= 8 else None

    # LinkedIn detection
    linkedin_match = re.search(r"linkedin\.com/in/[\w\-]+", text, re.IGNORECASE)
    linkedin = f"https://{linkedin_match.group(0)}" if linkedin_match else None

    # GitHub detection
    github_match = re.search(r"github\.com/[\w\-]+", text, re.IGNORECASE)
    github = f"https://{github_match.group(0)}" if github_match else None

    # General Portfolio / Website
    portfolio_match = re.search(
        r"https?://(?!.*(?:linkedin\.com|github\.com))[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(?:/[^\s]*)?",
        text,
        re.IGNORECASE
    )
    portfolio = portfolio_match.group(0) if portfolio_match else None

    has_email = bool(email)
    has_phone = bool(phone)
    has_links = bool(linkedin or github or portfolio)

    return {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio,
        "completeness_score": (int(has_email) * 50 + int(has_phone) * 35 + int(has_links) * 15)
    }


def detect_sections(text: str) -> Dict[str, bool]:
    """
    Detects the presence of standard resume sections using heading-aware matching
    to avoid false positives inside regular sentence text.
    """
    detected = {}
    lines = [line.strip().lower() for line in text.split("\n") if line.strip()]

    for section, aliases in SECTION_ALIASES.items():
        found = False
        for alias in aliases:
            # Check 1: Does a standalone line or short header match the alias?
            for line in lines:
                # Remove punctuation like colons, bullet points
                clean_line = re.sub(r"[:\-\–\—|#*]", "", line).strip()
                if clean_line == alias or clean_line.startswith(f"{alias} ") or clean_line.endswith(f" {alias}"):
                    found = True
                    break
            if found:
                break

            # Check 2: Word boundary regex search
            pattern = rf"(?m)^[\s\*\#\-\–]*{re.escape(alias)}[\s\:\-\–]*$"
            if re.search(pattern, text, re.IGNORECASE):
                found = True
                break

            # Fallback check
            if re.search(rf"\b{re.escape(alias)}\b", text, re.IGNORECASE):
                found = True
                break

        detected[section] = found

    return detected


def parse_job_description(jd_text: str, role: str) -> List[str]:
    """
    Extracts relevant skill keywords from a pasted Job Description.
    Matches against known industry skills and role taxonomy, avoiding common filler words.
    """
    base_keywords = set(get_role_keywords(role))
    if not jd_text or not jd_text.strip():
        return sorted(list(base_keywords))

    jd_lower = jd_text.lower()
    extracted = set()

    # Match known skills (single and multi-word phrases) in the JD
    for skill in ALL_KNOWN_SKILLS:
        if safe_keyword_search(skill, jd_lower):
            extracted.add(skill)

    # Combine: base role skills + skills specifically highlighted in the JD
    combined = base_keywords.union(extracted)
    return sorted(list(combined))


def audit_action_verbs_and_impact(text: str) -> Dict[str, Any]:
    """
    Evaluates bullet points for strong action verbs, quantifiable metrics,
    and flags weak/passive phrases.
    """
    text_lower = text.lower()
    found_power_verbs = []
    for verb in POWER_ACTION_VERBS:
        if safe_keyword_search(verb, text_lower):
            found_power_verbs.append(verb)

    found_weak_phrases = []
    for phrase in WEAK_PASSIVE_PHRASES:
        if phrase in text_lower:
            found_weak_phrases.append(phrase)

    # Quantifiable metrics detection (%, $, numbers >= 2 digits, multipliers like 5x, 20+)
    metric_matches = re.findall(r"\b(?:\$\d+[\d,]*|\d+%(?:\.\d+)?|\d+x|\d+\+|\d{2,}\b)", text)
    has_quantifiable_results = len(metric_matches) >= 3

    # Calculate impact score (0-100)
    verb_score = min(50, len(found_power_verbs) * 15)
    metric_score = min(50, len(metric_matches) * 15)
    weakness_penalty = min(20, len(found_weak_phrases) * 5)
    impact_score = max(0, min(100, verb_score + metric_score - weakness_penalty))

    return {
        "score": impact_score,
        "found_power_verbs": found_power_verbs[:10],
        "power_verb_count": len(found_power_verbs),
        "found_weak_phrases": found_weak_phrases,
        "metric_count": len(metric_matches),
        "metric_samples": metric_matches[:5],
        "has_quantifiable_results": has_quantifiable_results
    }


def audit_formatting_and_layout(metadata: Dict[str, Any], text: str) -> Tuple[int, List[str]]:
    """
    Assesses ATS formatting readability, length, and special character layout.
    Returns (score_0_to_100, list_of_suggestions).
    """
    score = 100
    suggestions = []
    word_count = metadata.get("word_count", len(text.split()))
    page_count = metadata.get("page_count", 1)
    is_scanned = metadata.get("is_scanned", False)

    # 1. Scanned Document Check
    if is_scanned:
        score -= 50
        suggestions.append(
            "CRITICAL: Scanned/Image-based document detected! ATS scanners cannot read images or rasterized text. "
            "Please re-export your resume directly from Word, Google Docs, or LaTeX as a text-searchable PDF."
        )

    # 2. Word Count Check
    if word_count < 150:
        score -= 30
        suggestions.append(
            f"Your resume is very brief ({word_count} words). ATS parsers may consider it incomplete. "
            "Aim for 350 to 800 words with detailed project and work bullet points."
        )
    elif word_count > 1200:
        score -= 15
        suggestions.append(
            f"Your resume is quite long ({word_count} words). Recruiter screens usually favor concise 1-2 page resumes "
            "between 450-900 words."
        )

    # 3. Page Count Check
    if page_count > 2:
        score -= 15
        suggestions.append(
            f"Your resume spans {page_count} pages. Unless you have 10+ years of senior executive experience, "
            "condense your resume to 1 or 2 pages."
        )

    # 4. Complex symbols and tables check
    complex_symbols = text.count("█") + text.count("•••") + text.count("◆") + text.count("■")
    if complex_symbols > 6:
        score -= 10
        suggestions.append(
            "Found decorative graphic symbols (blocks, diamond bullets, icon text) that can confuse older ATS parsers. "
            "Stick to standard bullet points (-, •)."
        )

    return max(10, score), suggestions


def calculate_comprehensive_ats_score(
    text: str,
    metadata: Dict[str, Any],
    role: str = "general",
    user_type: str = "fresher",
    job_description: str = ""
) -> Dict[str, Any]:
    """
    Main ATS evaluation pipeline. Computes multi-factor scoring (0-100),
    identifies matched/missing skills, checks section completeness,
    evaluates formatting, and returns actionable recommendations.
    """
    # 1. Target keywords list
    keywords = parse_job_description(job_description, role)

    # 2. Skill analysis
    matched_skills = []
    missing_skills = []
    for kw in keywords:
        if safe_keyword_search(kw, text):
            matched_skills.append(kw)
        else:
            missing_skills.append(kw)

    keyword_match_ratio = len(matched_skills) / len(keywords) if keywords else 0
    skill_score = round(keyword_match_ratio * 100, 1)

    # 3. Section analysis
    sections_detected = detect_sections(text)
    section_score = 100
    section_suggestions = []

    # Critical sections logic
    essential_sections = ["summary", "skills", "education"]
    if user_type == "fresher":
        essential_sections.append("projects")
        if not sections_detected.get("experience"):
            # Freshers are not heavily penalized for missing corporate experience if projects exist
            pass
        if not sections_detected.get("projects"):
            section_score -= 30
            section_suggestions.append(
                "No Projects section found! As a student/fresher, academic or personal projects are the #1 evidence of your capability."
            )
    else:
        essential_sections.append("experience")
        if not sections_detected.get("experience"):
            section_score -= 35
            section_suggestions.append(
                "No Work Experience section found! Experienced professionals must have a dedicated Employment History section."
            )

    for sec in ["education", "skills"]:
        if not sections_detected.get(sec):
            section_score -= 25
            section_suggestions.append(f"Missing '{sec.title()}' section. This is a required section for all ATS parsers.")

    if not sections_detected.get("summary"):
        section_score -= 10
        section_suggestions.append("Consider adding a short 2-3 sentence Professional Summary at the top to highlight your core strengths.")

    section_score = max(10, min(100, section_score))

    # 4. Contact Info analysis
    contact_info = extract_contact_info(text)
    contact_suggestions = []
    if not contact_info["email"]:
        contact_suggestions.append("No valid Email address found in the text. Recruiters must be able to reach you!")
    if not contact_info["phone"]:
        contact_suggestions.append("No Phone number found. Include a phone number with country code.")
    if not contact_info["linkedin"]:
        contact_suggestions.append("No LinkedIn profile link detected. Most technical recruiters cross-verify LinkedIn.")
    if role in ["frontend developer", "backend developer", "full stack developer", "python developer", "machine learning engineer"]:
        if not contact_info["github"] and not contact_info["portfolio"]:
            contact_suggestions.append("Software engineering resumes strongly benefit from a GitHub profile or portfolio link.")

    # 5. Formatting analysis
    formatting_score, formatting_suggestions = audit_formatting_and_layout(metadata, text)

    # 6. Action verbs and impact
    impact_data = audit_action_verbs_and_impact(text)
    impact_score = impact_data["score"]
    impact_suggestions = []
    if impact_data["power_verb_count"] < 4:
        impact_suggestions.append(
            "Use more strong action verbs at the beginning of bullet points (e.g. 'Architected', 'Spearheaded', 'Optimized', 'Automated')."
        )
    if not impact_data["has_quantifiable_results"]:
        impact_suggestions.append(
            "Add quantifiable metrics to your bullet points (e.g. 'reduced latency by 35%', 'managed team of 5', 'served 10,000+ users')."
        )
    if impact_data["found_weak_phrases"]:
        impact_suggestions.append(
            f"Replace passive phrases like {', '.join(repr(p) for p in impact_data['found_weak_phrases'])} with direct impact verbs."
        )

    # 7. Weighted Total ATS Score Calculation (0 - 100)
    # 40% Skills Match, 25% Section Completeness, 20% Formatting, 15% Impact
    overall_score = round(
        (skill_score * 0.40) +
        (section_score * 0.25) +
        (formatting_score * 0.20) +
        (impact_score * 0.15),
        1
    )

    # Performance Tier categorization
    if overall_score >= 80:
        tier = "ATS Optimized"
        tier_color = "#10b981"  # Emerald green
        tier_description = "Excellent! Your resume matches ATS requirements and industry standards closely."
    elif overall_score >= 60:
        tier = "Competitive"
        tier_color = "#f59e0b"  # Amber
        tier_description = "Good foundation, but targeted improvements in skills and formatting will significantly boost callback rates."
    elif overall_score >= 40:
        tier = "Needs Improvement"
        tier_color = "#f97316"  # Orange
        tier_description = "Several essential sections or key skills are missing. Review the suggestions below."
    else:
        tier = "Critical Issues"
        tier_color = "#ef4444"  # Red
        tier_description = "Major parsing or completeness hurdles detected that may cause automatic ATS rejection."

    # Priority-sorted suggestions
    keyword_suggestions = [f"Add keyword '{kw}' to your skills or project descriptions" for kw in missing_skills[:8]]

    return {
        "score": overall_score,
        "score_out_of_10": round(overall_score / 10, 1),  # Backward compatibility
        "tier": tier,
        "tier_color": tier_color,
        "tier_description": tier_description,
        "category_scores": {
            "skills": skill_score,
            "sections": section_score,
            "formatting": formatting_score,
            "impact": impact_score
        },
        "contact_info": contact_info,
        "sections_detected": sections_detected,
        "skills_breakdown": {
            "matched_count": len(matched_skills),
            "missing_count": len(missing_skills),
            "matched": matched_skills,
            "missing": missing_skills
        },
        "impact_data": impact_data,
        "suggestions": {
            "keywords": keyword_suggestions,
            "sections": section_suggestions,
            "formatting": formatting_suggestions,
            "contact": contact_suggestions,
            "impact": impact_suggestions
        },
        # Legacy fields for backward compatibility with prototype
        "keyword_suggestions": keyword_suggestions,
        "section_suggestions": section_suggestions,
        "formatting_suggestions": formatting_suggestions
    }
