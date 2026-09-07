import React from "react";

export default function Navbar({ apiHealthy, onReset }) {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={onReset} style={{ cursor: "pointer" }}>
          <div className="brand-icon">⚡</div>
          <div>
            <h1 className="brand-title">ResumeIQ Pro</h1>
            <p className="brand-subtitle">Production-Grade ATS Resume Analyzer</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-badge ${apiHealthy ? "status-online" : "status-warning"}`}>
            <span className="status-dot"></span>
            <span className="status-text">{apiHealthy ? "API Connected" : "Connecting..."}</span>
          </div>

          <a
            href="https://github.com/yeswitha-mudimela/resume-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-link"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}
