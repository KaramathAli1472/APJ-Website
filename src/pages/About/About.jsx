import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* Page Hero */}
      <section className="about-hero">
        <div className="about-container">
          <span className="about-hero-label">
            ABOUT APJ EDU
          </span>

          <h1>
            Education That Builds
            <span> Better Futures</span>
          </h1>

          <p>
            Learn more about APJ Abdul Kalam Welfare Society
            and our commitment to education and student development.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <div className="about-container about-intro-grid">

          <div className="about-intro-content">
            <span className="about-section-label">
              WHO WE ARE
            </span>

            <h2>
              Supporting Education,
              <span> Inspiring Students</span>
            </h2>

            <p>
              APJ Abdul Kalam Welfare Society is committed to
              supporting education and creating opportunities that
              help students learn, grow and move towards a brighter
              future.
            </p>

            <p>
              Through APJ EDU, students and parents can access
              useful academic information, syllabus resources,
              admission information, notices and other educational
              services in one place.
            </p>

            <Link
              to="/admission"
              className="about-primary-button"
            >
              Explore Admission →
            </Link>
          </div>

          <div className="about-intro-card">
            <div className="about-card-icon">
              🎓
            </div>

            <span>APJ EDU</span>

            <h3>
              Empowering Students
            </h3>

            <p>
              Knowledge today creates opportunities for
              tomorrow.
            </p>

            <div className="about-card-line"></div>

            <strong>
              Learn • Grow • Achieve
            </strong>
          </div>

        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="about-container">

          <div className="about-heading">
            <span className="about-section-label">
              OUR PURPOSE
            </span>

            <h2>
              Mission & Vision
            </h2>

            <p>
              Building an environment where students can
              develop knowledge, confidence and the skills
              needed for the future.
            </p>
          </div>

          <div className="mission-grid">

            <div className="mission-card">
              <div className="mission-number">
                01
              </div>

              <div className="mission-icon">
                🎯
              </div>

              <h3>
                Our Mission
              </h3>

              <p>
                To support students through accessible
                educational resources, meaningful learning
                opportunities and a positive environment for
                personal and academic development.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-number">
                02
              </div>

              <div className="mission-icon">
                🌟
              </div>

              <h3>
                Our Vision
              </h3>

              <p>
                To contribute towards a future where every
                student has the opportunity to learn, develop
                confidence and work towards achieving their
                goals.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-container">

          <div className="about-heading">
            <span className="about-section-label">
              OUR VALUES
            </span>

            <h2>
              What We Believe In
            </h2>
          </div>

          <div className="values-grid">

            <div className="value-card">
              <div className="value-icon">
                📚
              </div>

              <h3>
                Quality Learning
              </h3>

              <p>
                Encouraging strong academic foundations
                and meaningful learning.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                🤝
              </div>

              <h3>
                Inclusiveness
              </h3>

              <p>
                Creating educational opportunities and
                support for students.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                🌱
              </div>

              <h3>
                Student Growth
              </h3>

              <p>
                Supporting confidence, discipline,
                creativity and personal development.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                🚀
              </div>

              <h3>
                Future Focus
              </h3>

              <p>
                Preparing students with knowledge and
                skills for future opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container about-cta-inner">

          <div>
            <span>
              BUILDING A BRIGHTER FUTURE
            </span>

            <h2>
              Give Education the Power to Change Lives
            </h2>

            <p>
              Explore APJ EDU and discover our academic
              resources and student services.
            </p>
          </div>

          <Link
            to="/contact"
            className="about-cta-button"
          >
            Contact Us →
          </Link>

        </div>
      </section>

    </div>
  );
}

export default About;