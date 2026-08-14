import { useState } from "react"
import axios from "axios"

function CircularScore({ score }) {
  const radius = 70
  const stroke = 10
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const progress = (score / 10) * circumference
  const strokeDashoffset = circumference - progress
  const color = score <= 4 ? "#e74c3c" : score <= 7 ? "#f39c12" : "#2ecc71"

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill={color}
        >
          {score}/10
        </text>
      </svg>
      <p style={{ color: "#7f8c8d", marginTop: "8px" }}>ATS Score</p>
    </div>
  )
}

function SuggestionCard({ title, suggestions, color }) {
  if (suggestions.length === 0) return null
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px",
      borderLeft: `5px solid ${color}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <h3 style={{ color, marginTop: 0, marginBottom: "12px" }}>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: "20px" }}>
        {suggestions.map((s, i) => (
          <li key={i} style={{ marginBottom: "8px", color: "#2c3e50", lineHeight: "1.5" }}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState("onboarding")
  const [userType, setUserType] = useState("")
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState("")
  const [role, setRole] = useState("general")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleUserType = (type) => {
    setUserType(type)
    setScreen("upload")
  }

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a resume PDF"); return }
    setLoading(true)
    setError("")
    const formData = new FormData()
    formData.append("resume", file)
    formData.append("job_description", jd)
    formData.append("role", role)
    formData.append("user_type", userType)
    try {
      const response = await axios.post("https://resume-analyzer-unzk.onrender.com/analyze", formData)
      setResult(response.data)
      setScreen("results")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f0f4f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box"
    },
    card: {
      background: "white",
      borderRadius: "16px",
      padding: "40px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    },
    title: { textAlign: "center", color: "#2c3e50", marginBottom: "8px" },
    subtitle: { textAlign: "center", color: "#7f8c8d", marginBottom: "32px" },
    button: {
      width: "100%",
      padding: "14px",
      background: "#2c3e50",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "8px"
    },
    optionButton: {
      width: "100%",
      padding: "20px",
      background: "white",
      border: "2px solid #e0e0e0",
      borderRadius: "12px",
      fontSize: "16px",
      cursor: "pointer",
      marginBottom: "16px",
      textAlign: "left",
      transition: "border-color 0.2s"
    },
    label: { fontWeight: "bold", display: "block", marginBottom: "8px", color: "#2c3e50" },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      marginBottom: "16px",
      boxSizing: "border-box",
      fontSize: "14px"
    }
  }

  if (screen === "onboarding") return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Resume Analyzer 🚀</h1>
        <p style={styles.subtitle}>Let's personalize your analysis. Are you a...</p>
        <button
          style={styles.optionButton}
          onClick={() => handleUserType("fresher")}
          onMouseOver={e => e.target.style.borderColor = "#2c3e50"}
          onMouseOut={e => e.target.style.borderColor = "#e0e0e0"}
        >
          🎓 <strong>Student / Fresher</strong>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#7f8c8d" }}>Recently graduated or still studying</p>
        </button>
        <button
          style={styles.optionButton}
          onClick={() => handleUserType("professional")}
          onMouseOver={e => e.target.style.borderColor = "#2c3e50"}
          onMouseOut={e => e.target.style.borderColor = "#e0e0e0"}
        >
          💼 <strong>Professional</strong>
          <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#7f8c8d" }}>Have work experience</p>
        </button>
      </div>
    </div>
  )

  if (screen === "upload") return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload Your Resume 📄</h2>
        <p style={styles.subtitle}>We'll check how ATS-friendly it is</p>

        <label style={styles.label}>Upload Resume (PDF)</label>
        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} style={styles.input} />

        <label style={styles.label}>Select Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} style={styles.input}>
          <option value="general">General</option>
          <option value="frontend developer">Frontend Developer</option>
          <option value="data analyst">Data Analyst</option>
          <option value="python developer">Python Developer</option>
          <option value="machine learning">Machine Learning</option>
        </select>

        <label style={styles.label}>Job Description (optional)</label>
        <textarea
          rows={4}
          placeholder="Paste the job description here..."
          value={jd}
          onChange={e => setJd(e.target.value)}
          style={{ ...styles.input, resize: "vertical" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={styles.button}>
          {loading ? "Analyzing... ⏳" : "Analyze Resume →"}
        </button>

        <button onClick={() => setScreen("onboarding")} style={{
          ...styles.button, background: "transparent",
          color: "#7f8c8d", border: "1px solid #e0e0e0", marginTop: "8px"
        }}>
          ← Back
        </button>
      </div>
    </div>
  )

  if (screen === "results") return (
    <div style={{ ...styles.container, alignItems: "flex-start", paddingTop: "40px" }}>
      <div style={{ ...styles.card, maxWidth: "700px" }}>
        <h2 style={styles.title}>Your Results 📊</h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <CircularScore score={result.score} />
        </div>

        {result.keyword_suggestions.length === 0 &&
          result.section_suggestions.length === 0 &&
          result.formatting_suggestions.length === 0 && (
            <div style={{ background: "#eafaf1", padding: "20px", borderRadius: "12px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ color: "#2ecc71", fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                🎉 Your resume looks great! No major issues found.
              </p>
            </div>
          )}

        <SuggestionCard
          title="🔑 Keyword Issues"
          suggestions={result.keyword_suggestions}
          color="#e74c3c"
        />
        <SuggestionCard
          title="📋 Missing Sections"
          suggestions={result.section_suggestions}
          color="#e67e22"
        />
        <SuggestionCard
          title="⚠️ Formatting Issues"
          suggestions={result.formatting_suggestions}
          color="#8e44ad"
        />

        <button onClick={() => { setScreen("upload"); setResult(null) }} style={styles.button}>
          Analyze Another Resume →
        </button>
        <button onClick={() => { setScreen("onboarding"); setResult(null); setUserType("") }} style={{
          ...styles.button, background: "transparent",
          color: "#7f8c8d", border: "1px solid #e0e0e0", marginTop: "8px"
        }}>
          ← Start Over
        </button>
      </div>
    </div>
  )
}