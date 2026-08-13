import { useState } from "react"
import axios from "axios"

function getScoreColor(score) {
  if (score <= 4) return "#e74c3c"
  if (score <= 7) return "#f39c12"
  return "#2ecc71"
}

export default function App() {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState("general")

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a resume PDF")
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("job_description", jd)
    formData.append("role", role)

    try {
      const response = await axios.post("https://resume-analyzer-unzk.onrender.com/analyze", formData)
      setResult(response.data)
    } catch (err) {
      setError("Something went wrong. Make sure Flask is running.")
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial", padding: "20px" }}>
      
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Resume Analyzer</h1>
      <p style={{ textAlign: "center", color: "#7f8c8d" }}>Check how ATS friendly your resume is</p>

      <div style={{ background: "#f9f9f9", padding: "24px", borderRadius: "12px", marginTop: "24px" }}>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ width: "100%" }}
          />
        </div>

     <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
         Select Role
        </label>
        <select
         value={role}
         onChange={(e) => setRole(e.target.value)}
         style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
        >
        <option value="general">General</option>
        <option value="frontend developer">Frontend Developer</option>
        <option value="data analyst">Data Analyst</option>
        <option value="python developer">Python Developer</option>
        <option value="machine learning">Machine Learning</option>
        </select>
</div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Job Description (optional)
          </label>
          <textarea
            rows={5}
            placeholder="Paste the job description here..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "32px" }}>
          
          <div style={{
            textAlign: "center",
            padding: "32px",
            borderRadius: "12px",
            background: "#f9f9f9",
            marginBottom: "24px"
          }}>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2c3e50" }}>ATS Score</p>
            <p style={{
               fontSize: "72px",
               fontWeight: "bold",
               color: getScoreColor(result.score),
               margin: "10px 0 0 0"
          }}> {result.score}/10
          </p>
          </div>

          {result.keyword_suggestions.length > 0 && (
            <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", marginBottom: "16px" }}>
              <h3 style={{ color: "#e74c3c" }}>Keyword Issues</h3>
              <ul>
                {result.keyword_suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.section_suggestions.length > 0 && (
            <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>
              <h3 style={{ color: "#e67e22" }}>Missing Sections</h3>
              <ul>
                {result.section_suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.formatting_suggestions.length > 0 && (
            <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "12px", marginTop: "16px" }}>
              <h3 style={{ color: "#8e44ad" }}>Formatting Issues</h3>
              <ul>
                {result.formatting_suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>{s}</li>
                ))}
             </ul>
            </div>
          )}
          {result.keyword_suggestions.length === 0 && result.section_suggestions.length === 0 && (
            <div style={{ background: "#eafaf1", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "18px" }}>
                Your resume looks great! No major issues found.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}