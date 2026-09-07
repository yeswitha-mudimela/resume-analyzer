import React from "react";

const POWER_VERBS_BY_CATEGORY = {
  "Engineering & Building": ["Architected", "Engineered", "Automated", "Constructed", "Deployed", "Developed", "Integrated", "Refactored"],
  "Leadership & Ownership": ["Spearheaded", "Championed", "Directed", "Guided", "Mentored", "Orchestrated", "Pioneered"],
  "Optimization & Results": ["Accelerated", "Maximized", "Optimized", "Overhauled", "Reduced", "Streamlined", "Transformed"]
};

export default function ImpactAudit({ impactData }) {
  const score = impactData?.score ?? 0;
  const powerVerbs = impactData?.found_power_verbs || [];
  const weakPhrases = impactData?.found_weak_phrases || [];
  const metrics = impactData?.metric_samples || [];
  const metricCount = impactData?.metric_count || 0;

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3 className="section-title">🚀 Impact & Action Verb Audit</h3>
          <p className="section-subtitle">
            Recruiters prioritize resumes with measurable results and active leadership verbs over passive task descriptions.
          </p>
        </div>
        <div className="impact-badge" style={{
          backgroundColor: score >= 70 ? "#10b98115" : score >= 40 ? "#f59e0b15" : "#ef444415",
          color: score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444",
          borderColor: score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444"
        }}>
          Impact Score: {score}/100
        </div>
      </div>

      <div className="impact-grid">
        {/* Power Verbs */}
        <div className="impact-box">
          <div className="impact-box-head">
            <span className="impact-icon">⚡</span>
            <div>
              <h4 className="impact-box-title">Strong Action Verbs</h4>
              <span className="impact-box-count">{powerVerbs.length} detected</span>
            </div>
          </div>
          {powerVerbs.length > 0 ? (
            <div className="chips-wrap">
              {powerVerbs.map((v, i) => (
                <span key={i} className="skill-chip chip-verb">
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-box-note">
              No strong action verbs found. Start bullet points with words like <em>Architected</em>, <em>Spearheaded</em>, or <em>Optimized</em>.
            </p>
          )}
        </div>

        {/* Quantifiable Metrics */}
        <div className="impact-box">
          <div className="impact-box-head">
            <span className="impact-icon">📈</span>
            <div>
              <h4 className="impact-box-title">Quantifiable Results</h4>
              <span className="impact-box-count">{metricCount} metrics detected</span>
            </div>
          </div>
          {metrics.length > 0 ? (
            <div>
              <p className="metrics-intro">Detected measurable numbers and percentages:</p>
              <div className="chips-wrap">
                {metrics.map((m, i) => (
                  <span key={i} className="skill-chip chip-metric">
                    📊 {m}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="empty-box-note">
              No numbers or percentages found. Use the <strong>X-Y-Z formula</strong>: <em>"Accomplished [X] as measured by [Y] by doing [Z]"</em>.
            </p>
          )}
        </div>
      </div>

      {/* Weak Phrases Warning */}
      {weakPhrases.length > 0 && (
        <div className="weak-phrases-alert">
          <div className="weak-alert-header">
            <span>⚠️ Passive Phrases Found ({weakPhrases.length})</span>
          </div>
          <p className="weak-alert-text">
            Phrases like {weakPhrases.map((p, i) => <code key={i} className="code-passive">"{p}"</code>)} sound like passive duties.
            Replace them with direct accomplishment verbs.
          </p>
        </div>
      )}

      {/* Recommended Power Verbs Reference */}
      <div className="power-verbs-ref">
        <h4 className="ref-title">💡 Recommended Power Verbs by Impact Category</h4>
        <div className="ref-grid">
          {Object.entries(POWER_VERBS_BY_CATEGORY).map(([catName, verbs]) => (
            <div key={catName} className="ref-col">
              <span className="ref-cat-name">{catName}</span>
              <ul className="ref-list">
                {verbs.map((verb, idx) => (
                  <li key={idx} className="ref-item" onClick={() => navigator.clipboard.writeText(verb)} title="Click to copy">
                    {verb}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
