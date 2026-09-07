import React, { useState } from "react";

export default function SuggestionsList({ suggestions }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const contactList = suggestions?.contact || [];
  const sectionList = suggestions?.sections || [];
  const formattingList = suggestions?.formatting || [];
  const keywordList = suggestions?.keywords || [];

  const allCount = contactList.length + sectionList.length + formattingList.length + keywordList.length;

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div>
          <h3 className="section-title">📋 Actionable ATS Recommendations</h3>
          <p className="section-subtitle">
            Prioritized checklist to boost your resume's search ranking and recruiter response rate.
          </p>
        </div>

        {allCount === 0 && (
          <span className="badge-perfect">🎉 0 Issues Found!</span>
        )}
      </div>

      {/* Category Pills */}
      <div className="pills-bar">
        <button
          type="button"
          className={`pill-btn ${selectedCategory === "all" ? "pill-btn-active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All ({allCount})
        </button>
        {contactList.length > 0 && (
          <button
            type="button"
            className={`pill-btn pill-critical ${selectedCategory === "contact" ? "pill-btn-active" : ""}`}
            onClick={() => setSelectedCategory("contact")}
          >
            Contact Info ({contactList.length})
          </button>
        )}
        {sectionList.length > 0 && (
          <button
            type="button"
            className={`pill-btn pill-warning ${selectedCategory === "sections" ? "pill-btn-active" : ""}`}
            onClick={() => setSelectedCategory("sections")}
          >
            Sections ({sectionList.length})
          </button>
        )}
        {formattingList.length > 0 && (
          <button
            type="button"
            className={`pill-btn pill-info ${selectedCategory === "formatting" ? "pill-btn-active" : ""}`}
            onClick={() => setSelectedCategory("formatting")}
          >
            Formatting ({formattingList.length})
          </button>
        )}
        {keywordList.length > 0 && (
          <button
            type="button"
            className={`pill-btn pill-keywords ${selectedCategory === "keywords" ? "pill-btn-active" : ""}`}
            onClick={() => setSelectedCategory("keywords")}
          >
            Keywords ({keywordList.length})
          </button>
        )}
      </div>

      <div className="suggestions-stack">
        {/* Contact Suggestions */}
        {(selectedCategory === "all" || selectedCategory === "contact") &&
          contactList.map((item, idx) => (
            <div key={`c-${idx}`} className="suggestion-item border-critical">
              <span className="sugg-badge badge-critical">Critical</span>
              <div className="sugg-content">
                <p className="sugg-text">{item}</p>
                <span className="sugg-category">Contact Information</span>
              </div>
            </div>
          ))}

        {/* Section Suggestions */}
        {(selectedCategory === "all" || selectedCategory === "sections") &&
          sectionList.map((item, idx) => (
            <div key={`s-${idx}`} className="suggestion-item border-warning">
              <span className="sugg-badge badge-warning">High Priority</span>
              <div className="sugg-content">
                <p className="sugg-text">{item}</p>
                <span className="sugg-category">Resume Sections</span>
              </div>
            </div>
          ))}

        {/* Formatting Suggestions */}
        {(selectedCategory === "all" || selectedCategory === "formatting") &&
          formattingList.map((item, idx) => (
            <div key={`f-${idx}`} className="suggestion-item border-info">
              <span className="sugg-badge badge-info">ATS Layout</span>
              <div className="sugg-content">
                <p className="sugg-text">{item}</p>
                <span className="sugg-category">Document Formatting</span>
              </div>
            </div>
          ))}

        {/* Keyword Suggestions */}
        {(selectedCategory === "all" || selectedCategory === "keywords") &&
          keywordList.map((item, idx) => (
            <div key={`k-${idx}`} className="suggestion-item border-neutral">
              <span className="sugg-badge badge-neutral">Keyword</span>
              <div className="sugg-content">
                <p className="sugg-text">{item}</p>
                <span className="sugg-category">Skill Match</span>
              </div>
            </div>
          ))}

        {allCount === 0 && (
          <div className="all-clear-box">
            <h4>🌟 Outstanding ATS Compatibility</h4>
            <p>Your resume satisfies all primary ATS structural, contact, and keyword parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
