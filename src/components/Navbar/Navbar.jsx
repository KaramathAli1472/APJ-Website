import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import societyLogo from "../../assets/logo/logo.png.jpeg";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firestore/firestoreService";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [noticeItems, setNoticeItems] = useState([]);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "notices"),
      (snapshot) => {
        const publishedNotices = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })).filter((notice) =>
          String(notice.status || "").trim().toLowerCase() === "published"
        );
        publishedNotices.sort((a, b) => {
          const getTime = (value) => {
            if (!value) return 0;
            if (typeof value.toMillis === "function") return value.toMillis();
            return new Date(value).getTime() || 0;
          };
          const bTime = Math.max(getTime(b.updatedAt), getTime(b.createdAt));
          const aTime = Math.max(getTime(a.updatedAt), getTime(a.createdAt));
          return bTime - aTime;
        });

        setNoticeItems(
          publishedNotices.map((notice) => ({
            id: notice.id,
            title:
              notice.description?.trim() ||
              notice.title ||
              "APJ EDU Announcement",
          }))
        );
      },
      (error) => {
        console.error("Notice ticker loading error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (noticeItems.length === 0) {
      setActiveNoticeIndex(0);
      return undefined;
    }

    setActiveNoticeIndex((current) =>
      current >= noticeItems.length ? 0 : current
    );

    if (noticeItems.length <= 1) {
      setActiveNoticeIndex(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveNoticeIndex((current) =>
        (current + 1) % noticeItems.length
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, [noticeItems.length]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-topbar">
        <div className="navbar-container navbar-topbar-container">
          <span>APJ Abdul Kalam Welfare Society</span>
          <div>
            <span>Education for Every Student</span>
            <NavLink to="/admission">Quick Admission</NavLink>
          </div>
        </div>
      </div>
      <div className="navbar-container">

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <img
            src={societyLogo}
            alt="APJ Abdul Kalam Welfare Society"
            className="logo-mark"
          />

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
            Registration
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
            to="/student/login"
            className="navbar-student-login-btn"
            onClick={closeMenu}
          >
            Student Login
          </NavLink>

          <NavLink
            to="/admission"
            className="navbar-apply-btn"
            onClick={closeMenu}
          >
            Register Now
          </NavLink>
        </nav>

      </div>

      {noticeItems.length > 0 && (
      <NavLink to="/notices" className="notice-ticker" aria-label="Important notices">
        <span className="notice-ticker-label">IMPORTANT NOTICE</span>
        <div className="notice-ticker-window">
          <span
            className="notice-ticker-item"
            key={noticeItems[activeNoticeIndex]?.id}
          >
            {noticeItems[activeNoticeIndex]?.title}
          </span>
        </div>
      </NavLink>
      )}

    </header>
  );
}

export default Navbar;