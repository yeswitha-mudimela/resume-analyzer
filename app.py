from flask import Flask, request, jsonify
from flask_cors import CORS
from analyzer import analyser, scorecalculator, suggestor, section_checker, section_checker_v2
import pdfplumber
import io

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Resume Analyzer is running"

@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files["resume"]
    jd_text = request.form.get("job_description", "")

    with pdfplumber.open(io.BytesIO(file.read())) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()

    key = ["python", "sql", "communication", "git", "problem solving"]

    if jd_text:
        jd_words = [word.strip() for word in jd_text.lower().split() if len(word) > 4]
        key = list(set(key + jd_words))

    section_aliases = {
      "summary": ["about me", "objective", "profile"],
      "experience": ["internships", "work history", "employment"],
      "skills": ["skills", "technical skills", "competencies"],
      "education": ["education", "academic background", "qualifications"],
      "projects": ["projects", "personal projects", "academic projects"]
    }

    keyword_result = analyser(text, key)
    section_result = section_checker_v2(text, section_aliases)

    score = scorecalculator(keyword_result)
    keyword_suggestions = suggestor(keyword_result)
    section_suggestions = section_checker(section_result)

    return jsonify({
        "score": score,
        "keyword_suggestions": keyword_suggestions,
        "section_suggestions": section_suggestions
    })

if __name__ == "__main__":
    app.run(debug=True)