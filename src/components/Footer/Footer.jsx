import { Link } from "react-router-dom";
import societyLogo from "../../assets/logo/logo.png.jpeg";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img
                src={societyLogo}
                alt="APJ Abdul Kalam Welfare Society"
                className="footer-logo-mark"
              />

              <span>
                <strong>APJ EDU</strong>
                <small>Education for a Better Tomorrow</small>
              </span>
            </Link>

            <p>
              APJ Abdul Kalam Welfare Society is committed to supporting
              education, student development and opportunities for a
              brighter future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>

            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/admission">Registration</Link>
            <Link to="/syllabus">Syllabus</Link>
            <Link to="/classes">Classes</Link>
          </div>

          {/* Explore */}
          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/gallery">Gallery</Link>
            <Link to="/notices">Notices</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">
              Privacy Policy
            </Link>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <h3>Contact Us</h3>

            <div className="contact-item">
              <span>📍</span>

              <p>
                APJ Abdul Kalam Welfare Society
                <br />
                Hyderabad, Telangana
              </p>
            </div>

            <div className="contact-item">
              <span>📞</span>

              <a href="tel:+918500212306">
                +91 85002 12306
              </a>
            </div>

            <div className="contact-item">
              <span>✉️</span>

              <a href="mailto:apjedu2001@gmail.com">
                apjedu2001@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">

          <p>
            © {currentYear} APJ EDU. All rights reserved.
          </p>

          <div>
            <span>APJ Abdul Kalam Welfare Society</span>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;