import React, { useState } from "react";

export default function SkillsMatrix({ skillsBreakdown }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const matched = skillsBreakdown?.matched || [];
  const missing = skillsBreakdown?.missing || [];

  const handleCopyMissing = () => {
    if (missing.length === 0) return;
    navigator.clipboard.writeText(missing.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filterList = (list) => {
    if (!searchQuery.trim()) return list;
    return list.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredMatched = filterList(matched);
  const filteredMissing = filterList(missing);

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3 className="section-title">🔑 Skills & Keyword Matrix</h3>
          <p className="section-subtitle">
            ATS scanners parse resumes for exact skill matches before recruiters see them.
          </p>
        </div>

        {missing.length > 0 && (
          <button type="button" className="btn-copy" onClick={handleCopyMissing}>
            {copied ? "✓ Copied to Clipboard!" : "📋 Copy Missing Skills"}
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="matrix-toolbar">
        <div className="matrix-tabs">
          <button
            type="button"
            className={`matrix-tab ${activeFilter === "all" ? "matrix-tab-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Skills ({matched.length + missing.length})
          </button>
          <button
            type="button"
            className={`matrix-tab ${activeFilter === "matched" ? "matrix-tab-active" : ""}`}
            onClick={() => setActiveFilter("matched")}
          >
            ✓ Matched ({matched.length})
          </button>
          <button
            type="button"
            className={`matrix-tab ${activeFilter === "missing" ? "matrix-tab-active" : ""}`}
            onClick={() => setActiveFilter("missing")}
          >
            ✕ Missing ({missing.length})
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Filter skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Skills Display */}
      <div className="skills-container">
        {(activeFilter === "all" || activeFilter === "matched") && filteredMatched.length > 0 && (
          <div className="skills-group">
            <h4 className="group-heading text-matched">
              ✓ Detected Skills ({filteredMatched.length})
            </h4>
            <div className="chips-wrap">
              {filteredMatched.map((skill, idx) => (
                <span key={idx} className="skill-chip chip-matched">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(activeFilter === "all" || activeFilter === "missing") && filteredMissing.length > 0 && (
          <div className="skills-group">
            <h4 className="group-heading text-missing">
              ✕ Missing Recommended Skills ({filteredMissing.length})
            </h4>
            <p className="group-hint">
              Adding these keywords into your experience bullet points or skills list improves your ATS rank.
            </p>
            <div className="chips-wrap">
              {filteredMissing.map((skill, idx) => (
                <span key={idx} className="skill-chip chip-missing" title="Click to copy" onClick={() => navigator.clipboard.writeText(skill)}>
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {filteredMatched.length === 0 && filteredMissing.length === 0 && (
          <p className="empty-search">No skills match '{searchQuery}'.</p>
        )}
      </div>
    </div>
  );
}
