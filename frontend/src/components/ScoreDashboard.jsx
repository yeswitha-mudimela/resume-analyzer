import React from "react";

function CircularScoreGauge({ score, tier, tierColor }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div className="gauge-wrapper">
      <svg height={radius * 2} width={radius * 2} className="gauge-svg">
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={tierColor || "#10b981"}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%"
          }}
        />
        <text
          x="50%"
          y="46%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="gauge-score-text"
          fill={tierColor}
        >
          {score}
        </text>
        <text
          x="50%"
          y="62%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="gauge-max-text"
          fill="#94a3b8"
        >
          / 100
        </text>
      </svg>
      <div className="gauge-badge" style={{ backgroundColor: `${tierColor}15`, color: tierColor, borderColor: tierColor }}>
        {tier}
      </div>
    </div>
  );
}

export default function ScoreDashboard({ data }) {
  const { score, tier, tier_color, tier_description, category_scores, metadata, contact_info } = data;

  const categories = [
    {
      name: "Skills Match",
      weight: "40%",
      score: category_scores?.skills ?? 0,
      icon: "🎯",
      desc: "Overlap with core industry role and job posting keywords"
    },
    {
      name: "Section Completeness",
      weight: "25%",
      score: category_scores?.sections ?? 0,
      icon: "📑",
      desc: "Presence of essential ATS-recognized section headings"
    },
    {
      name: "ATS Formatting",
      weight: "20%",
      score: category_scores?.formatting ?? 0,
      icon: "📐",
      desc: "Document length, text searchability, and clean layout"
    },
    {
      name: "Impact & Action Verbs",
      weight: "15%",
      score: category_scores?.impact ?? 0,
      icon: "🚀",
      desc: "Quantifiable metrics and active leadership verb usage"
    }
  ];

  return (
    <div className="dashboard-card">
      <div className="dashboard-hero">
        <div className="score-column">
          <CircularScoreGauge score={score} tier={tier} tierColor={tier_color} />
          <p className="score-summary-text">{tier_description}</p>
        </div>

        <div className="categories-column">
          <h3 className="categories-header">ATS Evaluation Breakdown</h3>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div className="category-meta">
                  <span className="cat-icon">{cat.icon}</span>
                  <div className="cat-title-group">
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-weight">{cat.weight} weight</span>
                  </div>
                  <span className="cat-score">{Math.round(cat.score)}%</span>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.max(5, cat.score))}%`,
                      backgroundColor:
                        cat.score >= 75 ? "#10b981" : cat.score >= 50 ? "#f59e0b" : "#ef4444"
                    }}
                  />
                </div>
                <p className="cat-desc">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata & Contact Strip */}
      <div className="meta-strip">
        <div className="meta-item">
          <span className="meta-label">Document:</span>
          <span className="meta-value">{metadata?.filename}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Length:</span>
          <span className="meta-value">{metadata?.page_count} page{metadata?.page_count > 1 ? "s" : ""} ({metadata?.word_count} words)</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Est. Read Time:</span>
          <span className="meta-value">~{metadata?.reading_time_minutes} min</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Reachability:</span>
          <span className="meta-tags">
            {contact_info?.email && <span className="tag-contact" title={contact_info.email}>✉️ Email</span>}
            {contact_info?.phone && <span className="tag-contact" title={contact_info.phone}>📞 Phone</span>}
            {contact_info?.linkedin && (
              <a href={contact_info.linkedin} target="_blank" rel="noreferrer" className="tag-contact tag-link">
                🔗 LinkedIn
              </a>
            )}
            {contact_info?.github && (
              <a href={contact_info.github} target="_blank" rel="noreferrer" className="tag-contact tag-link">
                🐙 GitHub
              </a>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
