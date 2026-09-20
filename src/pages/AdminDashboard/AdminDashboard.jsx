import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { logoutAdmin } from "../../services/auth/authService";
import { db } from "../../services/firestore/firestoreService";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [counts, setCounts] = useState({
    applications: 0,
    notices: 0,
    gallery: 0,
    syllabus: 0,
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoadingStats(true);

        const [
          applicationsSnapshot,
          noticesSnapshot,
          gallerySnapshot,
          syllabusSnapshot,
        ] = await Promise.all([
          getDocs(
            collection(db, "applications")
          ),

          getDocs(
            collection(db, "notices")
          ),

          getDocs(
            collection(db, "gallery")
          ),

          getDocs(
            collection(db, "syllabus")
          ),
        ]);

        const publishedNotices =
          noticesSnapshot.docs.filter(
            (item) => {
              const data = item.data();

              return (
                !data.status ||
                data.status.toLowerCase() ===
                  "published"
              );
            }
          );

        const publishedSyllabus =
          syllabusSnapshot.docs.filter(
            (item) => {
              const data = item.data();

              return (
                !data.status ||
                data.status.toLowerCase() ===
                  "published"
              );
            }
          );

        setCounts({
          applications:
            applicationsSnapshot.size,

          notices:
            publishedNotices.length,

          gallery:
            gallerySnapshot.size,

          syllabus:
            publishedSyllabus.length,
        });
      } catch (error) {
        console.error(
          "Dashboard stats loading error:",
          error
        );
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, []);

  const stats = [
    {
      title: "Applications",
      value: counts.applications,
      icon: "📋",
      description: "Admission applications",
    },
    {
      title: "Notices",
      value: counts.notices,
      icon: "📢",
      description: "Published notices",
    },
    {
      title: "Gallery",
      value: counts.gallery,
      icon: "🖼️",
      description: "Uploaded photos",
    },
    {
      title: "Syllabus",
      value: counts.syllabus,
      icon: "📚",
      description: "Published resources",
    },
  ];

  const managementItems = [
    {
      title: "Admission Applications",
      description:
        "View and manage student admission enquiries.",
      icon: "📋",
      path: "/admin/applications",
    },
    {
      title: "Syllabus",
      description:
        "Manage class-wise academic syllabus and resources.",
      icon: "📚",
      path: "/admin/syllabus",
    },
    {
      title: "Classes Management",
      description:
        "Manage classes, sections, subjects and academic information.",
      icon: "🎓",
      path: "/admin/classes",
    },
    {
      title: "Gallery",
      description:
        "Upload, organize and remove gallery photos.",
      icon: "🖼️",
      path: "/admin/gallery",
    },
    {
      title: "Notices",
      description:
        "Create and manage important announcements.",
      icon: "📢",
      path: "/admin/notices",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logoutAdmin();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );

      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="admin-sidebar">

        <Link
          to="/admin/dashboard"
          className="admin-sidebar-brand"
        >
          <div className="admin-sidebar-logo">
            A
          </div>

          <div>
            <strong>APJ EDU</strong>

            <span>
              Admin Panel
            </span>
          </div>
        </Link>

        <nav className="admin-sidebar-nav">

          <span className="admin-nav-label">
            MAIN MENU
          </span>

          <Link
            to="/admin/dashboard"
            className="admin-nav-item active"
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link
            to="/admin/applications"
            className="admin-nav-item"
          >
            <span>📋</span>
            Applications
          </Link>

          <Link
            to="/admin/syllabus"
            className="admin-nav-item"
          >
            <span>📚</span>
            Syllabus
          </Link>

          <Link
            to="/admin/classes"
            className="admin-nav-item"
          >
            <span>🎓</span>
            Classes
          </Link>

          <Link
            to="/admin/gallery"
            className="admin-nav-item"
          >
            <span>🖼️</span>
            Gallery
          </Link>

          <Link
            to="/admin/notices"
            className="admin-nav-item"
          >
            <span>📢</span>
            Notices
          </Link>

          <span className="admin-nav-label">
            SYSTEM
          </span>

          <Link
            to="/admin/settings"
            className="admin-nav-item"
          >
            <span>⚙️</span>
            Settings
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-view-site"
          >
            <span>↗</span>
            View Website
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span>
              {loggingOut ? "…" : "↪"}
            </span>

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <span>
              ADMINISTRATION
            </span>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className="admin-user">

            <div className="admin-user-avatar">
              A
            </div>

            <div>
              <strong>
                Administrator
              </strong>

              <small>
                Admin
              </small>
            </div>

          </div>

        </header>

        {/* =========================
            WELCOME
        ========================= */}

        <section className="admin-welcome">

          <div>

            <span>
              APJ EDU ADMIN PANEL
            </span>

            <h2>
              Welcome back, Administrator 👋
            </h2>

            <p>
              Manage your website content and keep
              APJ EDU information up to date.
            </p>

          </div>

        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="admin-stats">

          {stats.map((stat) => (

            <div
              className="admin-stat-card"
              key={stat.title}
            >

              <div className="admin-stat-icon">
                {stat.icon}
              </div>

              <div>

                <span>
                  {stat.title}
                </span>

                <strong>
                  {loadingStats
                    ? "..."
                    : stat.value}
                </strong>

                <small>
                  {stat.description}
                </small>

              </div>

            </div>

          ))}

        </section>

        {/* =========================
            MANAGEMENT
        ========================= */}

        <section className="admin-management">

          <div className="admin-section-heading">

            <div>

              <span>
                CONTENT MANAGEMENT
              </span>

              <h2>
                Manage Website
              </h2>

            </div>

          </div>

          <div className="admin-management-grid">

            {managementItems.map((item) => (

              <Link
                to={item.path}
                className="admin-management-card"
                key={item.title}
              >

                <div className="admin-management-icon">
                  {item.icon}
                </div>

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </div>

                <span className="admin-card-arrow">
                  →
                </span>

              </Link>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;