/**
 * Centralized API client for ATS Resume Analyzer backend.
 */

import axios from "axios";

// Determine base URL:
// 1. Environment variable VITE_API_URL if defined
// 2. Local backend (http://localhost:5000) if running locally
// 3. Fallback to production Render backend
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5000";
  }
  return "https://resume-analyzer-unzk.onrender.com";
};

export const API_BASE_URL = getBaseUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

/**
 * Checks server health and API version.
 */
export async function checkServerHealth() {
  try {
    const response = await client.get("/health");
    return { ok: true, data: response.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Fetches available roles and taxonomy.
 */
export async function fetchAvailableRoles() {
  try {
    const response = await client.get("/api/roles");
    return response.data.roles || [];
  } catch (err) {
    console.warn("Failed to fetch roles from API, falling back to local list", err);
    return [
      { id: "frontend developer", title: "Frontend Developer" },
      { id: "backend developer", title: "Backend Developer" },
      { id: "full stack developer", title: "Full Stack Developer" },
      { id: "python developer", title: "Python Developer" },
      { id: "data analyst", title: "Data Analyst" },
      { id: "data scientist", title: "Data Scientist" },
      { id: "machine learning engineer", title: "Machine Learning Engineer" },
      { id: "devops engineer", title: "DevOps / Cloud Engineer" },
      { id: "mobile developer", title: "Mobile Developer" },
      { id: "qa engineer", title: "QA / SDET Engineer" },
      { id: "cybersecurity analyst", title: "Cybersecurity Analyst" },
      { id: "product manager", title: "Product Manager" },
      { id: "ui ux designer", title: "UI / UX Designer" },
      { id: "general", title: "General Professional" }
    ];
  }
}

/**
 * Submits resume for comprehensive ATS analysis.
 */
export async function analyzeResume(formData) {
  try {
    const response = await client.post("/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return { success: true, data: response.data };
  } catch (err) {
    const serverMessage = err.response?.data?.error?.message;
    return {
      success: false,
      error: serverMessage || err.message || "Failed to analyze resume. Please check your connection."
    };
  }
}

/**
 * Requests AI-powered bullet rewrite and executive review.
 */
export async function requestAiCritique(payload) {
  try {
    const response = await client.post("/api/ai/critique", payload);
    return { success: true, data: response.data.critique };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error?.message || "AI review currently unavailable."
    };
  }
}
