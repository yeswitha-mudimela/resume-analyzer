import React, { useState } from "react";
import { requestAiCritique } from "../services/api";

export default function AiCoachModal({ resumeText, role, userType, jd, onClose }) {
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState(null);
  const [error, setError] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const runCritique = async () => {
      setLoading(true);
      setError("");
      const result = await requestAiCritique({
        resume_text: resumeText,
        role: role,
        user_type: userType,
        job_description: jd
      });

      if (isMounted) {
        if (result.success) {
          setCritique(result.data);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    };

    runCritique();
    return () => {
      isMounted = false;
    };
  }, [resumeText, role, userType, jd]);

  const handleCopySummary = () => {
    if (!critique?.tailored_summary) return;
    navigator.clipboard.writeText(critique.tailored_summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🤖</span>
            <div>
              <h3 className="modal-title">AI Resume Coach & STAR Rewriter</h3>
              <p className="modal-subtitle">
                Tailored critique for {role.toUpperCase()} ({userType})
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="modal-loading-state">
              <span className="spinner spinner-large"></span>
              <h4>Analyzing Resume & Synthesizing Recommendations...</h4>
              <p>Evaluating technical alignment, bullet-point STAR metrics, and role positioning.</p>
            </div>
          )}

          {error && (
            <div className="alert-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {critique && !loading && (
            <div className="critique-content">
              {/* Tailored Summary */}
              <div className="critique-section">
                <div className="section-title-row">
                  <h4 className="critique-heading">✍️ Recommended Professional Summary</h4>
                  <button type="button" className="btn-copy-small" onClick={handleCopySummary}>
                    {copiedSummary ? "✓ Copied!" : "📋 Copy Summary"}
                  </button>
                </div>
                <div className="summary-quote-box">
                  <p>"{critique.tailored_summary}"</p>
                </div>
              </div>

              {/* Bullet Point Rewrites */}
              <div className="critique-section">
                <h4 className="critique-heading">🎯 STAR Bullet-Point Rewrites</h4>
                <p className="critique-hint">
                  See how passive job descriptions are transformed into high-impact, quantifiable achievements:
                </p>
                <div className="rewrites-stack">
                  {critique.bullet_rewrites?.map((rewrite, idx) => (
                    <div key={idx} className="rewrite-card">
                      <div className="rewrite-original">
                        <span className="badge-original">Before (Weak)</span>
                        <p className="rewrite-text">"{rewrite.original}"</p>
                      </div>
                      <div className="rewrite-arrow">↓</div>
                      <div className="rewrite-improved">
                        <div className="rewrite-improved-header">
                          <span className="badge-improved">After (STAR Method)</span>
                          <button
                            type="button"
                            className="btn-copy-mini"
                            onClick={() => navigator.clipboard.writeText(rewrite.improved)}
                            title="Copy improved bullet"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="rewrite-text-bold">"{rewrite.improved}"</p>
                        <p className="rewrite-explanation">💡 {rewrite.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="critique-columns">
                <div className="critique-col">
                  <h4 className="critique-heading text-matched">✓ Key Strengths</h4>
                  <ul className="critique-list">
                    {critique.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="critique-col">
                  <h4 className="critique-heading text-missing">⚠️ Priority Improvements</h4>
                  <ul className="critique-list">
                    {critique.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interview Prep Tips */}
              {critique.interview_prep_tips && (
                <div className="critique-section">
                  <h4 className="critique-heading">🎙️ Target Role Interview Tips</h4>
                  <ul className="critique-list">
                    {critique.interview_prep_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close Coach
          </button>
        </div>
      </div>
    </div>
  );
}
