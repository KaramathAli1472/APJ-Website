import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { formatDateLong } from "../../utils/formatters/dateFormatter";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Firebase Timestamp / Date / String
   * sab ko Date object mein convert karna.
   */
  const getNoticeDate = (dateValue) => {
    if (!dateValue) {
      return new Date();
    }

    // Firebase Timestamp
    if (typeof dateValue.toDate === "function") {
      return dateValue.toDate();
    }

    // JavaScript Date
    if (dateValue instanceof Date) {
      return dateValue;
    }

    // String / number
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return new Date();
    }

    return date;
  };

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Firebase se sirf Published notices fetch kar rahe hain.
         *
         * orderBy() intentionally use nahi kar rahe,
         * taake Firestore composite index ki zaroorat na pade.
         */
        const noticesQuery = query(
          collection(db, "notices"),
          where("status", "==", "Published")
        );

        const snapshot = await getDocs(noticesQuery);

        const firebaseNotices = snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            title:
              data.title ||
              "APJ EDU Announcement",

            category:
              data.category ||
              "General",

            description:
              data.description ||
              "",

            date:
              data.createdAt ||
              null,

            status:
              data.status ||
              "Published",
          };
        });

        /*
         * Latest notice sabse upar.
         */
        firebaseNotices.sort((a, b) => {
          const dateA = getNoticeDate(a.date).getTime();
          const dateB = getNoticeDate(b.date).getTime();

          return dateB - dateA;
        });

        setNotices(firebaseNotices);
      } catch (error) {
        console.error("Notices loading error:", error);

        setNotices([]);

        setError(
          "Unable to load notices right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  /*
   * Firebase se categories dynamically create karna.
   */
  const categories = [
    "All",
    ...Array.from(
      new Set(
        notices
          .map((notice) => notice.category)
          .filter(Boolean)
      )
    ),
  ];

  /*
   * Agar selected category available nahi hai
   * to All select karna.
   */
  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  /*
   * Category ke according notices filter karna.
   */
  const filteredNotices =
    activeCategory === "All"
      ? notices
      : notices.filter(
          (notice) =>
            notice.category === activeCategory
        );

  return (
    <div className="notices-page">

      {/* Hero */}
      <section className="notices-hero">
        <div className="notices-container">

          <span className="notices-hero-badge">
            APJ EDU
          </span>

          <h1>
            Notices & Announcements
          </h1>

          <p>
            Stay updated with important academic,
            registration and general announcements.
          </p>

        </div>
      </section>

      {/* Notices */}
      <section className="notices-section">
        <div className="notices-container">

          <SectionTitle
            eyebrow="Latest Updates"
            title="Important Notices"
            description="Find the latest information and announcements from APJ EDU."
          />

          {/* Category Filters */}
          {!loading &&
            !error &&
            notices.length > 0 && (
              <div className="notices-filters">

                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={
                      activeCategory === category
                        ? "notice-filter active"
                        : "notice-filter"
                    }
                    onClick={() =>
                      setActiveCategory(category)
                    }
                  >
                    {category}
                  </button>
                ))}

              </div>
            )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Loading latest notices...
            </div>
          )}

          {/* Firebase Error */}
          {!loading && error && (
            <div className="notices-empty">

              <div className="notices-empty-icon">
                📢
              </div>

              <h3>
                Unable to Load Notices
              </h3>

              <p>
                {error}
              </p>

            </div>
          )}

          {/* No Notices */}
          {!loading &&
            !error &&
            notices.length === 0 && (
              <div className="notices-empty">

                <div className="notices-empty-icon">
                  📢
                </div>

                <h3>
                  No notices available
                </h3>

                <p>
                  There are currently no published
                  notices available.
                </p>

              </div>
            )}

          {/* Notice List */}
          {!loading &&
            !error &&
            filteredNotices.length > 0 && (
              <div className="notices-list">

                {filteredNotices.map((notice) => {
                  const noticeDate =
                    getNoticeDate(notice.date);

                  return (
                    <article
                      className="notice-card"
                      key={notice.id}
                    >

                      {/* Date */}
                      <div className="notice-date">

                        <span className="notice-date-day">
                          {noticeDate.getDate()}
                        </span>

                        <span className="notice-date-month">
                          {noticeDate.toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                            }
                          )}
                        </span>

                      </div>

                      {/* Content */}
                      <div className="notice-content">

                        <div className="notice-top">

                          <span className="notice-category">
                            {notice.category}
                          </span>

                          <span className="notice-full-date">
                            {formatDateLong(
                              noticeDate
                            )}
                          </span>

                        </div>

                        <h2>
                          {notice.title}
                        </h2>

                        <p>
                          {notice.description}
                        </p>

                      </div>

                      {/* Arrow */}
                      <div className="notice-arrow">
                        →
                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </div>
      </section>

      {/* Information CTA */}
      <section className="notices-info">
        <div className="notices-container">

          <div className="notices-info-icon">
            📢
          </div>

          <div className="notices-info-content">

            <span>
              Stay Updated
            </span>

            <h2>
              Don't Miss Important Announcements
            </h2>

            <p>
              Keep checking the Notices section for
              the latest updates related to academics,
              registrations and student activities.
            </p>

          </div>

          <Link
            to="/contact"
            className="notices-info-button"
          >
            Contact Us
            <span>→</span>
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Notices;