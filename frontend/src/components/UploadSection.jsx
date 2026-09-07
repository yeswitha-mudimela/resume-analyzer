import React, { useState, useRef } from "react";

const SAMPLE_JDS = {
  "frontend developer": `Seeking a Frontend Engineer experienced in React, TypeScript, and modern CSS frameworks like Tailwind CSS.
Responsibilities:
- Build responsive, accessible UI components with React and Next.js.
- Optimize web performance, Core Web Vitals, and browser caching.
- Collaborate with backend engineers to integrate REST APIs and GraphQL.
- Write robust unit and integration tests using Jest and Cypress.
Qualifications:
- 2+ years experience with JavaScript, HTML5, CSS3, and Git.
- Deep understanding of state management, responsive design, and CI/CD pipelines.`,

  "python developer": `Looking for a Python Developer to build and scale cloud-native backend services.
Requirements:
- Strong proficiency in Python, Django, Flask, or FastAPI.
- Hands-on experience with PostgreSQL, Redis, and Celery task queues.
- Containerization experience with Docker and Kubernetes on AWS or GCP.
- Familiarity with RESTful API design, microservices, and pytest test suites.`,

  "data analyst": `Hiring a Data Analyst to transform complex datasets into actionable business intelligence.
Key Requirements:
- Expert in SQL queries, window functions, and database schema navigation.
- Proficient in Python (Pandas, NumPy) or R for statistical data cleaning.
- Proven track record building executive dashboards in Tableau or Power BI.
- Experience with A/B testing methodologies and ETL pipelines.`,

  "full stack developer": `Full Stack Developer needed for high-growth SaaS platform.
Requirements:
- JavaScript/TypeScript, React on frontend; Node.js or Python on backend.
- Relational databases (PostgreSQL/MySQL) and NoSQL (MongoDB).
- Cloud deployment experience using AWS, Docker, and GitHub Actions CI/CD.
- Excellent problem-solving skills, API security, and Agile teamwork.`
};

export default function UploadSection({
  roles,
  file,
  setFile,
  role,
  setRole,
  userType,
  setUserType,
  jd,
  setJd,
  loading,
  onSubmit,
  error
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const loadSampleResume = () => {
    const sampleResumeContent = `ALEX MORGAN
alex.morgan@email.com | +1 (555) 019-2834 | linkedin.com/in/alexmorgan | github.com/alexmorgan
San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 3+ years experience designing scalable web applications and REST APIs.
Proven expertise in Python, React, PostgreSQL, and cloud deployments with Docker.

TECHNICAL SKILLS
- Languages: Python, JavaScript, TypeScript, SQL, HTML, CSS
- Frameworks & Libraries: Django, FastAPI, React, Node.js, Tailwind CSS
- Databases & Tools: PostgreSQL, Redis, Docker, Git, Linux, Postman
- Concepts: REST API, Microservices, CI/CD, Agile, Unit Testing

WORK EXPERIENCE
Full Stack Engineer | CloudTech Solutions (2022 - Present)
- Architected and deployed 8+ RESTful microservices using FastAPI and PostgreSQL, serving 120,000+ daily active requests.
- Optimized database indexing and query performance, reducing average API response latency by 42%.
- Spearheaded the migration from legacy monolithic frontend to React & TypeScript, improving Core Web Vitals and user retention by 25%.
- Automated CI/CD pipelines via GitHub Actions and Docker, accelerating weekly release cycles by 50%.

Software Engineering Intern | DataPulse Inc. (2021 - 2022)
- Built interactive analytics dashboards in React and Chart.js used by 450+ internal operations managers.
- Authored 80+ unit tests with Pytest and Jest, elevating overall test coverage to 92%.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley (Graduated 2022)

NOTABLE PROJECTS
- Distributed Task Queue: Open-source Python background job worker utilizing Redis and WebSockets.
- E-Commerce Microservices: Multi-tenant store platform built with React, FastAPI, and Stripe API integration.`;

    const blob = new Blob([sampleResumeContent], { type: "text/plain" });
    const sampleFile = new File([blob], "Alex_Morgan_Resume.txt", { type: "text/plain" });
    setFile(sampleFile);
    setRole("full stack developer");
    setUserType("professional");
  };

  const applySampleJd = (targetRole) => {
    setRole(targetRole);
    if (SAMPLE_JDS[targetRole]) {
      setJd(SAMPLE_JDS[targetRole]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="card-header">
          <h2>Scan & Optimize Your Resume</h2>
          <p>Get instant ATS scoring, keyword gap analysis, and tailored recommendations.</p>
        </div>

        {/* Career Stage Selector */}
        <div className="form-group">
          <label className="form-label">Career Stage</label>
          <div className="career-stage-toggle">
            <button
              type="button"
              className={`stage-btn ${userType === "fresher" ? "stage-btn-active" : ""}`}
              onClick={() => setUserType("fresher")}
            >
              <span className="stage-icon">🎓</span>
              <div>
                <strong>Student / Fresher</strong>
                <p>Prioritizes coursework, projects, and foundational skills</p>
              </div>
            </button>

            <button
              type="button"
              className={`stage-btn ${userType === "professional" ? "stage-btn-active" : ""}`}
              onClick={() => setUserType("professional")}
            >
              <span className="stage-icon">💼</span>
              <div>
                <strong>Experienced Professional</strong>
                <p>Prioritizes employment history, leadership, and quantifiable impact</p>
              </div>
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div className="form-group">
          <label className="form-label">
            Resume Document <span className="label-req">*</span>
          </label>
          <div
            className={`dropzone ${dragActive ? "dropzone-active" : ""} ${file ? "dropzone-has-file" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {file ? (
              <div className="selected-file-card">
                <div className="file-info-col">
                  <div className="file-icon-badge">
                    {file.name.endsWith(".pdf") ? "📄 PDF" : file.name.endsWith(".docx") ? "📝 DOCX" : "📃 TXT"}
                  </div>
                  <div>
                    <h4 className="file-name">{file.name}</h4>
                    <p className="file-meta">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  title="Remove file"
                >
                  ✕ Change File
                </button>
              </div>
            ) : (
              <div className="dropzone-content">
                <div className="upload-cloud-icon">☁️</div>
                <p className="dropzone-title">
                  <strong>Click to upload</strong> or drag and drop your resume
                </p>
                <p className="dropzone-hint">Supports PDF, DOCX, and TXT (Max 16MB)</p>
              </div>
            )}
          </div>

          <div className="sample-resume-bar">
            <span>Don't have a file ready?</span>
            <button type="button" className="btn-link" onClick={loadSampleResume}>
              Load Sample Full-Stack Resume 🪄
            </button>
          </div>
        </div>

        {/* Role Picker */}
        <div className="form-group">
          <label className="form-label" htmlFor="role-select">
            Target Role / Domain
          </label>
          <select
            id="role-select"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description with Presets */}
        <div className="form-group">
          <div className="label-with-presets">
            <label className="form-label" htmlFor="jd-input">
              Job Description <span className="label-optional">(Recommended for precision)</span>
            </label>
            <div className="preset-badges">
              <span>Try preset:</span>
              <button type="button" className="preset-btn" onClick={() => applySampleJd("frontend developer")}>
                Frontend
              </button>
              <button type="button" className="preset-btn" onClick={() => applySampleJd("python developer")}>
                Python
              </button>
              <button type="button" className="preset-btn" onClick={() => applySampleJd("data analyst")}>
                Data Analyst
              </button>
            </div>
          </div>
          <textarea
            id="jd-input"
            className="form-textarea"
            rows={5}
            placeholder="Paste the job posting description here to calculate ATS keyword match and requirement overlap..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <div className="textarea-footer">
            <span>{jd.length} characters</span>
            {jd && (
              <button type="button" className="btn-clear" onClick={() => setJd("")}>
                Clear JD
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          className="btn-primary-action"
          disabled={loading || !file}
          onClick={onSubmit}
        >
          {loading ? (
            <span className="btn-loading-state">
              <span className="spinner"></span>
              Analyzing ATS Compatibility...
            </span>
          ) : (
            <span>Analyze Resume Now →</span>
          )}
        </button>
      </div>
    </div>
  );
}
