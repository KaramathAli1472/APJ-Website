import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import noticesData from "../../data/notices/noticesData";
import { formatDateLong } from "../../utils/formatters/dateFormatter";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const noticesQuery = query(
          collection(db, "notices"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(noticesQuery);

        const firebaseNotices = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (item) =>
              !item.status ||
              item.status.toLowerCase() ===
                "published"
          )
          .map((item) => ({
            id: item.id,
            title:
              item.title ||
              "APJ EDU Announcement",

            category:
              item.category ||
              "General",

            description:
              item.description ||
              "",

            date:
              item.createdAt ||
              new Date().toISOString(),
          }));

        setNotices(firebaseNotices);
      } catch (error) {
        console.error(
          "Notices loading error:",
          error
        );

        // Firebase error hone par fallback data use hoga.
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  /*
   * Firebase mein notices available hain
   * to Firebase data use hoga.
   *
   * Agar Firebase empty hai to local noticesData
   * fallback ke taur par show hoga.
   */
  const displayNotices =
    notices.length > 0
      ? notices
      : noticesData;

  /*
   * Firebase se categories dynamically create karna.
   */
  const firebaseCategories = [
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
   * Firebase empty hone par local categories.
   */
  const fallbackCategories = [
    "All",
    ...Array.from(
      new Set(
        noticesData.map(
          (notice) => notice.category
        )
      )
    ),
  ];

  const categories =
    notices.length > 0
      ? firebaseCategories
      : fallbackCategories;

  /*
   * Agar selected category available nahi hai
   * to All select karna.
   */
  useEffect(() => {
    if (
      !categories.includes(activeCategory)
    ) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  const filteredNotices =
    activeCategory === "All"
      ? displayNotices
      : displayNotices.filter(
          (notice) =>
            notice.category === activeCategory
        );

  /*
   * Firestore Timestamp / Date / String
   * sab ko Date object mein convert karna.
   */
  const getNoticeDate = (dateValue) => {
    if (!dateValue) {
      return new Date();
    }

    if (
      typeof dateValue.toDate === "function"
    ) {
      return dateValue.toDate();
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return new Date();
    }

    return date;
  };

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
            admission and general announcements.
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

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "30px 20px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Loading notices...
            </div>
          )}

          {/* Notice List */}
          {!loading && (
            <div className="notices-list">

              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const noticeDate =
                    getNoticeDate(
                      notice.date
                    );

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
                })
              ) : (
                <div className="notices-empty">

                  <div className="notices-empty-icon">
                    📢
                  </div>

                  <h3>
                    No notices found
                  </h3>

                  <p>
                    There are no notices available
                    in this category.
                  </p>

                </div>
              )}

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
              admissions and student activities.
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