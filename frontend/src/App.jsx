import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadSection from "./components/UploadSection";
import ScoreDashboard from "./components/ScoreDashboard";
import SkillsMatrix from "./components/SkillsMatrix";
import SuggestionsList from "./components/SuggestionsList";
import ImpactAudit from "./components/ImpactAudit";
import AiCoachModal from "./components/AiCoachModal";
import { checkServerHealth, fetchAvailableRoles, analyzeResume } from "./services/api";
import "./App.css";

export default function App() {
  const [apiHealthy, setApiHealthy] = useState(false);
  const [roles, setRoles] = useState([]);
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("full stack developer");
  const [userType, setUserType] = useState("fresher");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Health check and roles initialization
  useEffect(() => {
    async function init() {
      const health = await checkServerHealth();
      setApiHealthy(health.ok);

      const availableRoles = await fetchAvailableRoles();
      setRoles(availableRoles);
    }
    init();
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select or drop a resume file (.pdf, .docx, or .txt).");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);
    formData.append("user_type", userType);
    formData.append("job_description", jd);

    const res = await analyzeResume(formData);
    if (res.success) {
      setResult(res.data);
      // Smooth scroll to results
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-root">
      <Navbar apiHealthy={apiHealthy} onReset={handleReset} />

      <main className="main-content">
        {!result ? (
          <UploadSection
            roles={roles}
            file={file}
            setFile={setFile}
            role={role}
            setRole={setRole}
            userType={userType}
            setUserType={setUserType}
            jd={jd}
            setJd={setJd}
            loading={loading}
            onSubmit={handleSubmit}
            error={error}
          />
        ) : (
          <div className="results-container">
            {/* Results Action Bar */}
            <div className="results-toolbar no-print">
              <button type="button" className="btn-secondary" onClick={handleReset}>
                ← Scan Another Resume
              </button>

              <div className="toolbar-right-actions">
                <button
                  type="button"
                  className="btn-ai-coach"
                  onClick={() => setShowAiModal(true)}
                >
                  🤖 AI Resume Coach & Rewrites
                </button>
                <button
                  type="button"
                  className="btn-export-report"
                  onClick={handlePrint}
                >
                  🖨️ Export ATS Report
                </button>
              </div>
            </div>

            {/* Core Score Dashboard */}
            <ScoreDashboard data={result} />

            {/* Skills Matrix */}
            <SkillsMatrix skillsBreakdown={result.skills_breakdown} />

            {/* Prioritized Suggestions */}
            <SuggestionsList
              suggestions={result.suggestions}
              sectionsDetected={result.sections_detected}
            />

            {/* Action Verbs & Impact */}
            <ImpactAudit impactData={result.impact_data} />

            {/* Bottom Actions */}
            <div className="bottom-nav-bar no-print">
              <button type="button" className="btn-primary-action" onClick={handleReset}>
                Analyze Another Resume →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Optional AI Coach Modal */}
      {showAiModal && result && (
        <AiCoachModal
          resumeText={file ? "Resume Document Loaded" : ""}
          role={role}
          userType={userType}
          jd={jd}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="app-footer no-print">
        <p>ResumeIQ ATS Engine &bull; Built for High-Recall Applicant Tracking System Compatibility</p>
      </footer>
    </div>
  );
}