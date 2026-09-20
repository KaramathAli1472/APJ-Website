import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import "./Syllabus.css";

import { db } from "../../services/firestore/firestoreService";

function Syllabus() {
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const syllabusQuery = query(
      collection(db, "syllabus"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      syllabusQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setSyllabusData(data);
        setLoading(false);
        setErrorMessage("");
      },
      (error) => {
        console.error(
          "Syllabus loading error:",
          error
        );

        setErrorMessage(
          "Unable to load syllabus information right now."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * Group Firestore syllabus documents by class.
   *
   * Example:
   *
   * Class 4
   *   Mathematics
   *   Science
   *   English
   *
   * Only Published syllabus items are shown
   * on the public website.
   */
  const groupedClasses = syllabusData
    .filter((item) => {
      return (
        !item.status ||
        item.status.toLowerCase() === "published"
      );
    })
    .reduce((groups, item) => {
      const className =
        item.className || item.class || "";

      const subject =
        item.subject || "";

      if (!className) {
        return groups;
      }

      if (!groups[className]) {
        groups[className] = {
          className,
          subjects: [],
          topics: [],
        };
      }

      if (
        subject &&
        !groups[className].subjects.includes(subject)
      ) {
        groups[className].subjects.push(subject);
      }

      groups[className].topics.push(item);

      return groups;
    }, {});

  /*
   * Convert grouped object into array
   * and sort classes numerically.
   */
  const classes = Object.values(groupedClasses).sort(
    (a, b) => {
      const numberA = parseInt(
        a.className.replace(/\D/g, ""),
        10
      );

      const numberB = parseInt(
        b.className.replace(/\D/g, ""),
        10
      );

      if (Number.isNaN(numberA)) {
        return 1;
      }

      if (Number.isNaN(numberB)) {
        return -1;
      }

      return numberA - numberB;
    }
  );

  /*
   * If Firestore has no syllabus documents yet,
   * show the default class structure.
   */
  const defaultClasses = [
    {
      className: "Class 4",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 5",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 6",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 7",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 8",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 9",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
    {
      className: "Class 10",
      subjects: [
        "Mathematics",
        "Science",
        "English",
      ],
      topics: [],
    },
  ];

  const displayClasses =
    classes.length > 0
      ? classes
      : defaultClasses;

  const getClassNumber = (className) => {
    const number = className.match(/\d+/);

    return number ? number[0] : "10+";
  };

  return (
    <div className="syllabus-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="syllabus-hero">
        <div className="syllabus-container">

          <span className="syllabus-hero-label">
            ACADEMIC RESOURCES
          </span>

          <h1>
            Explore the
            <span> Syllabus</span>
          </h1>

          <p>
            Find academic subjects and syllabus
            information for students from Class 4
            to Class 10.
          </p>

        </div>
      </section>


      {/* =================================================
          INTRODUCTION
      ================================================= */}

      <section className="syllabus-intro">
        <div className="syllabus-container">

          <div className="syllabus-heading">

            <span className="syllabus-section-label">
              CLASSES 4–10
            </span>

            <h2>
              Academic Syllabus
            </h2>

            <p>
              Select your class to explore the available
              subjects and academic resources.
            </p>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
                color: "#667085",
                fontSize: "15px",
              }}
            >
              Loading syllabus...
            </div>
          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && errorMessage && (
            <div
              style={{
                marginBottom: "30px",
                padding: "16px 18px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                fontSize: "14px",
              }}
            >
              ⚠ {errorMessage}
            </div>
          )}


          {/* =================================================
              CLASS GRID
          ================================================= */}

          {!loading && (
            <div className="syllabus-grid">

              {displayClasses.map((item) => (
                <div
                  className="syllabus-card"
                  key={item.className}
                >

                  <div className="syllabus-card-top">

                    <div className="syllabus-class-number">
                      {getClassNumber(
                        item.className
                      )}
                    </div>

                    <span>
                      CLASS
                    </span>

                  </div>


                  <h3>
                    {item.className}
                  </h3>


                  <div className="syllabus-subjects">

                    {item.subjects
                      .filter((subject) =>
                        [
                          "Mathematics",
                          "Science",
                          "English",
                        ].includes(subject)
                      )
                      .map((subject) => (
                        <div
                          className="syllabus-subject"
                          key={subject}
                        >
                          <span>✓</span>

                          {subject}
                        </div>
                      ))}

                  </div>


                  {/* Topic count when Firebase
                      syllabus data is available */}

                  {item.topics.length > 0 && (
                    <div
                      style={{
                        marginTop: "14px",
                        color: "#788294",
                        fontSize: "13px",
                      }}
                    >
                      {item.topics.length} syllabus{" "}
                      {item.topics.length === 1
                        ? "topic"
                        : "topics"}
                    </div>
                  )}


                  <button
                    type="button"
                    className="syllabus-view-button"
                    onClick={() => {
                      const firstTopic =
                        item.topics[0];

                      if (firstTopic?.id) {
                        const element =
                          document.getElementById(
                            `syllabus-${firstTopic.id}`
                          );

                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }
                    }}
                  >
                    View Syllabus →
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>


      {/* =================================================
          FIREBASE SYLLABUS TOPICS
      ================================================= */}

      {!loading &&
        syllabusData.length > 0 && (
          <section className="syllabus-resources">

            <div className="syllabus-container">

              <div className="syllabus-heading">

                <span className="syllabus-section-label">
                  SYLLABUS TOPICS
                </span>

                <h2>
                  Available Academic Topics
                </h2>

                <p>
                  Explore the syllabus topics currently
                  published by APJ EDU.
                </p>

              </div>


              <div className="resource-grid">

                {syllabusData
                  .filter((item) => {
                    return (
                      !item.status ||
                      item.status.toLowerCase() ===
                        "published"
                    );
                  })
                  .map((item) => (
                    <div
                      className="resource-card"
                      id={`syllabus-${item.id}`}
                      key={item.id}
                    >

                      <div className="resource-icon">
                        📚
                      </div>

                      <h3>
                        {item.title ||
                          "Syllabus Topic"}
                      </h3>

                      <p>
                        {item.description ||
                          `${item.subject || "Academic"} syllabus topic for ${
                            item.className ||
                            item.class ||
                            "students"
                          }.`}
                      </p>

                      <div
                        style={{
                          marginTop: "14px",
                          color: "#1b63a8",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        {item.className ||
                          item.class ||
                          "Class"}

                        {" • "}

                        {item.subject ||
                          "Subject"}
                      </div>

                    </div>
                  ))}

              </div>

            </div>

          </section>
        )}


      {/* =================================================
          LEARNING RESOURCES
      ================================================= */}

      <section className="syllabus-resources">

        <div className="syllabus-container">

          <div className="syllabus-heading">

            <span className="syllabus-section-label">
              LEARNING RESOURCES
            </span>

            <h2>
              More Than Just a Syllabus
            </h2>

            <p>
              APJ EDU can provide students with useful
              academic resources in one place.
            </p>

          </div>


          <div className="resource-grid">

            <div className="resource-card">

              <div className="resource-icon">
                📖
              </div>

              <h3>
                Study Material
              </h3>

              <p>
                Useful learning material to support
                students with their studies.
              </p>

            </div>


            <div className="resource-card">

              <div className="resource-icon">
                📄
              </div>

              <h3>
                Notes & PDFs
              </h3>

              <p>
                Academic notes and downloadable resources
                can be made available for students.
              </p>

            </div>


            <div className="resource-card">

              <div className="resource-icon">
                📝
              </div>

              <h3>
                Practice
              </h3>

              <p>
                Practice resources can help students
                strengthen their understanding.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CTA
      ================================================= */}

      <section className="syllabus-cta">

        <div className="syllabus-container syllabus-cta-inner">

          <div>

            <span>
              READY TO LEARN?
            </span>

            <h2>
              Find Your Class & Start Exploring
            </h2>

            <p>
              Explore the available academic sections
              and discover useful resources.
            </p>

          </div>


          <Link
            to="/classes"
            className="syllabus-cta-button"
          >
            Explore Classes →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Syllabus;