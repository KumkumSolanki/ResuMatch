import React, { useState } from "react";

function ResumeUpload({ onBack }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [jobSkills, setJobSkills] = useState([]);
  const [analyzingJD, setAnalyzingJD] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [improvements, setImprovements] = useState([]);
  const [loadingImprovements, setLoadingImprovements] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matching, setMatching] = useState(false);
  const [bulletPoint, setBulletPoint] = useState("");
  const [rewrittenBullet, setRewrittenBullet] = useState("");
  const [rewriting, setRewriting] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);

  // Handle PDF Upload
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
      setFile(null);
    }
  };

  // Analyze Resume
  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(
        "https://resumatch-backend-amt0.onrender.com/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Job role response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to upload resume.");
      }

      const data = await response.json();
      console.log("Job role response data:", data);
      console.log("Backend Response:", data);

      setResumeText(data.resume_text);
      setAtsScore(data.ats_score);
      setBreakdown(data.breakdown);
      setMissingKeywords(data.missing_keywords);
      setLoadingRecommendations(true);

      const recommendationResponse = await fetch(
          "https://resumatch-backend-amt0.onrender.com/resume-recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resume_text: data.resume_text,
            }),
          }
      );

      const recommendationData = await recommendationResponse.json();

      setRecommendations(recommendationData.recommendations);
      setLoadingRecommendations(false);

      alert("Resume analyzed successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // Analyze Job Description
  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setAnalyzingJD(true);

    try {
      const response = await fetch(
        "https://resumatch-backend-amt0.onrender.com/analyze-job-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze job description.");
      }

      const data = await response.json();

      console.log("Job Description Response:", data);

      setJobSkills(data.required_skills);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setAnalyzingJD(false);
    }
  };
  const matchResumeWithJob = async () => {
    if (!resumeText) {
      alert("Please analyze your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description first.");
      return;
    }

    setMatching(true);

    try {
      const response = await fetch(
          "https://resumatch-backend-amt0.onrender.com/match-resume",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resume_text: resumeText,
              job_description: jobDescription,
            }),
          }
      );

      if (!response.ok) {
        throw new Error("Matching failed.");
      }

      const data = await response.json();

      setMatchResult(data);

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setMatching(false);
    }
  };
    const handleMatchResume = async () => {
    if (!resumeText) {
      alert("Please analyze your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setMatching(true);

    try {
      const response = await fetch(
        "https://resumatch-backend-amt0.onrender.com/match-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Matching failed.");
      }

      const data = await response.json();

      setMatchResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while matching.");
    } finally {
      setMatching(false);
    }
  };
    const handleImproveResume = async () => {
  if (!resumeText) {
    alert("Please analyze your resume first.");
    return;
  }

  setLoadingImprovements(true);

  try {
    const response = await fetch(
      "https://resumatch-backend-amt0.onrender.com/improve-resume",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Improvement analysis failed.");
    }

    const data = await response.json();

    setImprovements(data.improvements);

    if (data.improvements.length === 0) {
      alert(
          "No improvement suggestions found. Your resume does not contain the weak phrases currently being checked."
      );
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong while improving your resume.");
  } finally {
    setLoadingImprovements(false);
  }
};
    const handleRewriteBullet = async () => {
  if (!bulletPoint.trim()) {
    alert("Please enter a bullet point.");
    return;
  }

  setRewriting(true);

  try {
    const response = await fetch(
      "https://resumatch-backend-amt0.onrender.com/rewrite-bullet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bullet_point: bulletPoint,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Rewrite failed.");
    }

    const data = await response.json();
    setRewrittenBullet(data.rewritten_bullet);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setRewriting(false);
  }
};

    const handleJobRoleRecommendations = async () => {
      console.log("Job role button clicked!");
console.log("Resume text:", resumeText);
  if (!resumeText) {
    alert("Please analyze your resume first.");
    return;
  }

  setLoadingJobRoles(true);

  try {
    const response = await fetch(
      "https://resumatch-backend-amt0.onrender.com/recommend-job-roles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Job role recommendation failed.");
    }

    const data = await response.json();
    setJobRoles(data.recommendations);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoadingJobRoles(false);
  }
};
  return (
    <div className="dashboard-wrapper">
    <div className="upload-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Home
      </button>

      <div className="upload-container">

        {/* Header */}
        <div className="upload-header">
          <span className="section-badge">
            RESUME ANALYZER
          </span>

          <h1>Let's analyze your resume.</h1>

          <p>
            Upload your resume and discover insights to improve your career.
          </p>
        </div>

        {/* Resume Upload */}
        <div className="upload-box">
          <div className="upload-icon">📄</div>

          <h2>Upload your resume</h2>

          <p>Supported format: PDF</p>

          <label className="upload-button">
            {file ? "Choose Another File" : "Choose PDF File"}

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {file && (
            <div className="file-selected">
              ✅ {file.name}
            </div>
          )}

          {file && (
            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume →"}
            </button>
          )}
          <div className="bullet-rewriter">
  <h2>✍️ AI Bullet Point Rewriter</h2>

  <textarea
    placeholder="Enter your resume bullet point..."
    value={bulletPoint}
    onChange={(e) => setBulletPoint(e.target.value)}
  />

  <button
    className="improve-resume-btn"
    onClick={handleRewriteBullet}
    disabled={rewriting}
  >
    {rewriting ? "Rewriting..." : "Rewrite Bullet Point"}
  </button>
        <button
  className="improve-resume-btn"
  onClick={handleJobRoleRecommendations}
  disabled={loadingJobRoles}
>
  {loadingJobRoles
    ? "Finding Roles..."
    : "💼 Recommend Job Roles"}
</button>

  {rewrittenBullet && (
    <div className="rewritten-result">
      <h3>✨ Improved Version</h3>
      <p>{rewrittenBullet}</p>
    </div>
  )}
</div>
        </div>
        <button
            className="improve-resume-btn"
            onClick={handleImproveResume}
            disabled={loadingImprovements}
        >
          {loadingImprovements
              ? "Improving Resume..."
              : "🤖 Improve Resume"}
        </button>
        {improvements.length > 0 && (
            <div className="improvements-container">
              <h2>🤖 AI Resume Improvements</h2>

              {improvements.map((item, index) => (
                  <div className="improvement-card" key={index}>
                    <p>
                      <strong>Original:</strong>{" "}
                      {item.original_phrase}
                    </p>

                    <p>
                      <strong>Suggested:</strong>{" "}
                      {item.suggested_phrase}
                    </p>

                    <p>{item.message}</p>
                  </div>
              ))}
            </div>
        )}
        {jobRoles.length > 0 && (
  <div className="job-roles-container">
    <h2>💼 Recommended Job Roles</h2>

    {jobRoles.map((role, index) => (
      <div className="job-role-card" key={index}>
        <h3>{role.role}</h3>

        <p>
          <strong>Skill Match:</strong>{" "}
          {role.match_percentage}%
        </p>

        <p>
          <strong>Matched Skills:</strong>{" "}
          {role.matched_skills.join(", ")}
        </p>
      </div>
    ))}
  </div>
)}

        {/* Resume Results */}
        {resumeText && (
          <div className="results-box">
            <h2>Extracted Resume Text</h2>

            <pre>{resumeText}</pre>
          </div>
        )}
        <div className="dashboard-heading">
          <h2>📊 Resume Improvement Dashboard</h2>
          <p>Understand your resume and improve your career opportunities.</p>
        </div>
        {/* ATS Score */}
        {atsScore !== null && (
          <div className="ats-score-card">
            <span>YOUR ATS SCORE</span>

            <h2>
              {atsScore}
              <small>/100</small>
            </h2>

            <p>
              Your resume has been analyzed successfully.
            </p>
          </div>
        )}

        {/* Score Breakdown */}
        {breakdown && (
          <div className="breakdown-box">
            <h2>Score Breakdown</h2>

            <div className="breakdown-item">
              <span>Resume Structure</span>
              <strong>{breakdown.structure}/25</strong>
            </div>

            <div className="breakdown-item">
              <span>Technical Skills</span>
              <strong>{breakdown.skills}/25</strong>
            </div>

            <div className="breakdown-item">
              <span>Keywords</span>
              <strong>{breakdown.keywords}/25</strong>
            </div>

            <div className="breakdown-item">
              <span>Projects & Experience</span>
              <strong>
                {breakdown.projects_experience}/25
              </strong>
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {missingKeywords.length > 0 && (
          <div className="missing-keywords-box">
            <h2>Missing Technical Skills</h2>

            <p>
              Consider adding these skills to your resume:
            </p>

            <div className="keywords-list">
              {missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="keyword-tag"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {recommendations.length > 0 && (
            <div className="recommendations-container">
              <div className="recommendations-heading">
                <h2>🚀 How to Improve Your Resume</h2>
                <p>
                  Personalized suggestions based on your resume analysis.
                </p>
              </div>

              <div className="recommendations-grid">
                {recommendations.map((recommendation, index) => (
                    <div className="recommendation-card" key={index}>
                      <div className="recommendation-number">
                        {index + 1}
                      </div>

                      <div>
                        <h3>
                          {recommendation.title || "Resume Improvement"}
                        </h3>

                        <p>
                          {recommendation.description || recommendation}
                        </p>
                      </div>
                    </div>
                ))}
              </div>
            </div>

        )}

        {/* Job Description Analyzer */}
        <div className="job-description-box">
          <h2>Analyze Job Description</h2>

          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            rows="8"
          />

          <button
            className="primary-btn"
            onClick={analyzeJobDescription}
            disabled={analyzingJD}
          >
            {analyzingJD
              ? "Analyzing..."
              : "Analyze Job Description →"}
          </button>
        </div>
        <button
            className="match-button"
            onClick={handleMatchResume}
            disabled={matching}
        >
          {matching ? "Matching..." : "Match Resume With Job →"}
        </button>
        {matchResult && (
            <div className="match-results-box">
              <div className="match-score">
                <p>YOUR RESUME–JOB MATCH</p>
                <h2>{matchResult.match_percentage}%</h2>

                <div className="match-progress">
                  <div
                      className="match-progress-fill"
                      style={{
                        width: `${matchResult.match_percentage}%`,
                      }}
                  ></div>
                </div>
              </div>

              <div className="skill-section">
                <h3>✅ Matching Skills</h3>

                <div className="skill-tags">
                  {matchResult.matching_skills.map((skill, index) => (
                      <span className="matching-tag" key={index}>
            {skill}
          </span>
                  ))}
                </div>
              </div>
              <div className="skill-gap-card">
                <h3>📌 Skill Gap Summary</h3>

                <p>
                  You have{" "}
                  <strong>
                    {matchResult
                        ? matchResult.missing_skills.length
                        : missingKeywords.length}
                  </strong>{" "}
                  missing technical skills in your resume.
                </p>

                <p>
                  {matchResult
                      ? "These skills are missing for your selected job description."
                      : "Analyze your resume against a job description to see personalized skill gaps."}
                </p>
              </div>
              <div className="skill-section">
                <h3>❌ Missing Skills</h3>

                <div className="skill-tags">
                  {matchResult.missing_skills.map((skill, index) => (
                      <span className="missing-tag" key={index}>
            {skill}
          </span>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* Required Job Skills */}
        {jobSkills.length > 0 && (
          <div className="job-skills-result">
            <h2>Required Skills</h2>

            <div className="keywords-list">
              {jobSkills.map((skill, index) => (
                <span
                  key={index}
                  className="keyword-tag"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
      <button
          className="download-report-btn"
          onClick={() => window.print()}
      >
        📄 Download Analysis Report
      </button>
      <footer className="resumatch-footer">
        <h3>  ResuMatch </h3>
        <p>
          AI-powered resume intelligence for your career growth.
        </p>
        <span>© 2026 ResuMatch. Built with ❤️</span>
      </footer>
    </div>
  );
}

export default ResumeUpload;