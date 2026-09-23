import { Link } from "react-router-dom";

import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-container">
          <span className="privacy-hero-badge">APJ EDU</span>
          <h1>Privacy Policy</h1>
          <p>
            Your privacy matters to APJ Abdul Kalam Welfare Society.
            This policy explains how we collect, use and protect student
            information.
          </p>
        </div>
      </section>

      <main className="privacy-content">
        <div className="privacy-container">
          <p className="privacy-updated">
            Last updated: September 22, 2026
          </p>

          <section className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              When a student or parent uses APJ EDU services, we may collect
              information such as name, class, date of birth, contact number,
              email address, address, registration details and examination
              information. We collect only the information needed to provide
              our educational and registration services.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. How We Use Student Data</h2>
            <p>Student information may be used to:</p>
            <ul>
              <li>process registrations and scholarship applications;</li>
              <li>provide syllabus, class and examination services;</li>
              <li>communicate important academic or administrative updates;</li>
              <li>maintain secure student and administrative records; and</li>
              <li>improve the APJ EDU website and services.</li>
            </ul>
          </section>

          <section className="privacy-section privacy-highlight">
            <h2>3. Student Data Protection</h2>
            <p>
              Student data is stored in secure systems and is accessed only by
              authorised APJ EDU administrators or service providers who need
              it to operate the website. We do not sell student information or
              share it for unrelated marketing purposes. We use reasonable
              technical and administrative safeguards to protect data from
              unauthorised access, alteration or loss.
            </p>
            <p>
              No online service can guarantee absolute security, but APJ EDU
              takes appropriate steps to keep student information protected
              and to respond to any suspected security issue.
            </p>
          </section>

          <section className="privacy-section">
            <h2>4. Service Providers</h2>
            <p>
              APJ EDU may use trusted technology providers, such as Firebase
              for authentication and database services and Cloudinary for
              approved media storage. These providers process information only
              as needed to provide their services and have their own privacy
              and security practices.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Data Retention and Requests</h2>
            <p>
              We retain information for as long as it is reasonably required
              for registration, academic, examination, legal or administrative
              purposes. A student or parent may contact us to ask about their
              information, request a correction, or request deletion where
              retention is not required by law or a legitimate administrative
              need.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Children&apos;s Privacy</h2>
            <p>
              Students under the applicable age should use APJ EDU with the
              involvement and consent of a parent or legal guardian. Parents
              or guardians may contact us regarding the information submitted
              for a student.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Contact Us</h2>
            <p>
              For privacy questions, corrections or data requests, please
              contact APJ Abdul Kalam Welfare Society at{" "}
              <a href="mailto:apjedu2001@gmail.com">apjedu2001@gmail.com</a>
              {" "}or call <a href="tel:+918500212306">+91 85002 12306</a>.
            </p>
          </section>

          <Link to="/" className="privacy-home-link">
            Return to APJ EDU home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
