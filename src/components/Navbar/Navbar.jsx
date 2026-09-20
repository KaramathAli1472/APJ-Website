import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-mark">A</span>

          <span className="logo-text">
            <strong>APJ</strong>
            <small>EDU</small>
          </span>
        </NavLink>

        <button
          type="button"
          className={`mobile-menu-btn ${
            menuOpen ? "open" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`navbar-menu ${
            menuOpen ? "show" : ""
          }`}
        >
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About Us
          </NavLink>

          <NavLink to="/admission" onClick={closeMenu}>
            Admission
          </NavLink>

          <NavLink to="/syllabus" onClick={closeMenu}>
            Syllabus
          </NavLink>

          <NavLink to="/classes" onClick={closeMenu}>
            Classes
          </NavLink>

          <NavLink to="/gallery" onClick={closeMenu}>
            Gallery
          </NavLink>

          <NavLink to="/notices" onClick={closeMenu}>
            Notices
          </NavLink>

          <NavLink to="/faq" onClick={closeMenu}>
            FAQ
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <NavLink
            to="/admission"
            className="navbar-apply-btn"
            onClick={closeMenu}
          >
            Apply Now
          </NavLink>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;