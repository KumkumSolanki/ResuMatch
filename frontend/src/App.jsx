import { useState } from "react";
import ResumeUpload from "./ResumeUpload";
import "./App.css";

function App() {
  const [showUpload, setShowUpload] = useState(false);
  if (showUpload) {
    return <ResumeUpload onBack={() => setShowUpload(false)} />;
  }
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">✦</span>
          Resu<span>Match</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <button className="nav-button">
          Get Started →
        </button>

      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            ✨ AI-Powered Career Intelligence
          </div>

          <h1>
            Your Resume.
            <br />
            <span>Your Future.</span>
          </h1>

          <p>
            Unlock your career potential with AI-powered resume
            analysis, intelligent job matching, and personalized
            career guidance.
          </p>

          <div className="hero-buttons">

            <button className="primary-button"
            onClick={() => setShowUpload(true)}>
              Analyze My Resume →
            </button>

            <button className="secondary-button">
              Explore Features
            </button>

          </div>

          <div className="trust-text">
            ✦ Built for ambitious professionals
          </div>

        </div>

        {/* Resume Preview Card */}
        <div className="hero-visual">

          <div className="resume-card">

            <div className="card-top">
              <div className="mini-logo">✦</div>
              <span>AI ANALYSIS</span>
            </div>

            <div className="profile-placeholder"></div>

            <div className="line large"></div>
            <div className="line medium"></div>
            <div className="line small"></div>

            <div className="score-section">

              <div>
                <p>Resume Score</p>
                <h2>92<span>/100</span></h2>
              </div>

              <div className="score-circle">
                92%
              </div>

            </div>

            <div className="skill-tags">
              <span>Python</span>
              <span>Machine Learning</span>
              <span>SQL</span>
            </div>

          </div>

          <div className="floating-card">
            ✨ AI Insights
            <br />
            <strong>Skills matched successfully</strong>
          </div>

        </div>

      </section>

      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">
          <p className="section-label">POWERFUL FEATURES</p>

          <h2>
            Everything you need to
            <br />
            <span>move your career forward.</span>
          </h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon blue">📄</div>
            <h3>Resume Analysis</h3>
            <p>
              Extract important information and understand
              your resume strengths.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon pink">🎯</div>
            <h3>Smart Job Matching</h3>
            <p>
              Compare your skills with job requirements
              and identify relevant opportunities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">🤖</div>
            <h3>AI Career Assistant</h3>
            <p>
              Get personalized guidance, skill suggestions,
              and interview preparation.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer>
        <div className="logo">
          <span className="logo-icon">✦</span>
          Resu<span>Match</span>
        </div>

        <p>Build your career with intelligence.</p>
      </footer>

    </div>
  );
}

export default App;