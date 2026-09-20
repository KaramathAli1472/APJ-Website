import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const classes = [4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">

            <span className="hero-tag">
              APJ Abdul Kalam Welfare Society
            </span>

            <h1>
              Empowering Students
              <span> Building Futures</span>
            </h1>

            <p>
              Welcome to APJ EDU — a platform dedicated to education,
              student development, knowledge and a brighter future.
            </p>

            <div className="hero-buttons">
              <Link to="/admission" className="btn btn-primary">
                Apply for Admission
              </Link>

              <Link to="/syllabus" className="btn btn-outline">
                Explore Syllabus
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>4–10</strong>
                <span>Classes</span>
              </div>

              <div>
                <strong>7+</strong>
                <span>Academic Levels</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Student Focus</span>
              </div>
            </div>

          </div>

          <div className="hero-card-wrapper">
            <div className="hero-card">
              <div className="hero-card-icon">🎓</div>

              <h3>Learn</h3>
              <p>Grow</p>
              <span>Achieve</span>

              <div className="hero-card-line"></div>

              <small>
                Education is the foundation of a better tomorrow.
              </small>
            </div>
          </div>
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
            for classes 4 to 10.
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
              Explore our admission process and take the first step
              towards a brighter future.
            </p>
          </div>

          <Link to="/admission" className="cta-button">
            Apply Now →
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Home;