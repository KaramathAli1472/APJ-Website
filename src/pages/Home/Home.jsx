import { Link } from "react-router-dom";
import apjStudents from "../../assets/apj-students.jpg";
import "./Home.css";

function Home() {
  const classes = [4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(7, 31, 58, 0.82) 0%, rgba(7, 31, 58, 0.62) 48%, rgba(7, 31, 58, 0.18) 100%), url("' +
            apjStudents +
            '")',
          backgroundSize: "cover",
          backgroundPosition: "center 38%",
        }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Discover Your Future
              <span>With Us</span>
            </h1>

            <p>
              Education, knowledge and opportunity for every student.
            </p>

            <div className="hero-buttons">
              <Link to="/syllabus" className="btn btn-outline">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-feature-strip" aria-label="Education highlights">
        <div className="home-feature-card">
          <span className="feature-icon">🎓</span>
          <h3>Strong Foundation</h3>
          <p>Build knowledge and confidence from classes 4 to 12.</p>
        </div>
        <div className="home-feature-card">
          <span className="feature-icon">👥</span>
          <h3>Student Community</h3>
          <p>Learn, grow and succeed in a supportive environment.</p>
        </div>
        <div className="home-feature-card">
          <span className="feature-icon">📚</span>
          <h3>Best Curriculum</h3>
          <p>Clear resources, subjects and syllabus guidance.</p>
        </div>
        <div className="home-feature-card">
          <span className="feature-icon">📅</span>
          <h3>Flexible Learning</h3>
          <p>Access academic information whenever students need it.</p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="home-container">

          <div className="section-label">
            WELCOME TO APJ EDU
          </div>

          <h2 className="section-title">
            Building Knowledge, Character & Confidence
          </h2>

          <p className="section-description">
            APJ EDU is committed to creating an educational environment
            where students can learn, grow and develop the confidence
            needed to build a successful and responsible future.
          </p>

          <div className="welcome-grid">

            <div className="welcome-card">
              <div className="welcome-icon">📚</div>
              <h3>Quality Education</h3>
              <p>
                Strong academic foundations and meaningful learning
                experiences for students.
              </p>
            </div>

            <div className="welcome-card">
              <div className="welcome-icon">🌱</div>
              <h3>Student Growth</h3>
              <p>
                Supporting confidence, discipline, creativity and
                personal development.
              </p>
            </div>

            <div className="welcome-card">
              <div className="welcome-icon">🚀</div>
              <h3>Future Ready</h3>
              <p>
                Helping students develop knowledge and skills for
                future opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Classes Section */}
      <section className="classes-section">
        <div className="home-container">

          <div className="section-label">
            ACADEMIC PROGRAMS
          </div>

          <h2 className="section-title">
            Explore Our Classes
          </h2>

          <p className="section-description">
            Discover academic resources and syllabus information
            for classes 4 to 12.
          </p>

          <div className="classes-grid">
            {classes.map((classNumber) => (
              <Link
                to="/classes"
                className="class-card"
                key={classNumber}
              >
                <div className="class-number">
                  {classNumber}
                </div>

                <div>
                  <span>ACADEMIC</span>
                  <h3>Class {classNumber}</h3>
                  <p>View subjects & syllabus</p>
                </div>

                <div className="class-arrow">
                  →
                </div>
              </Link>
            ))}
          </div>

          <div className="center-button">
            <Link to="/classes" className="btn btn-primary">
              View All Classes
            </Link>
          </div>

        </div>
      </section>


      {/* Why Choose Section */}
      <section className="why-section">
        <div className="home-container">

          <div className="section-label">
            WHY APJ EDU
          </div>

          <h2 className="section-title">
            Education Beyond the Classroom
          </h2>

          <div className="why-grid">

            <div className="why-item">
              <div className="why-number">01</div>
              <div>
                <h3>Strong Foundation</h3>
                <p>
                  Focus on building strong academic fundamentals.
                </p>
              </div>
            </div>

            <div className="why-item">
              <div className="why-number">02</div>
              <div>
                <h3>Student Development</h3>
                <p>
                  Encouraging confidence, discipline and creativity.
                </p>
              </div>
            </div>

            <div className="why-item">
              <div className="why-number">03</div>
              <div>
                <h3>Supportive Environment</h3>
                <p>
                  Creating a positive environment for every student.
                </p>
              </div>
            </div>

            <div className="why-item">
              <div className="why-number">04</div>
              <div>
                <h3>Future Focused</h3>
                <p>
                  Preparing students for future learning and opportunities.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* Admission CTA */}
      <section className="admission-cta">
        <div className="home-container admission-cta-container">

          <div>
            <span>START YOUR JOURNEY</span>

            <h2>
              Give Your Child a Stronger Educational Foundation
            </h2>

            <p>
              Explore our registration process and take the first step
              towards a brighter future.
            </p>
          </div>

          <Link to="/admission" className="cta-button">
            Register Now →
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Home;