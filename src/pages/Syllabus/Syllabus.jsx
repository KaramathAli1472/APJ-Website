import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import "./Syllabus.css";

import { db } from "../../services/firestore/firestoreService";

function Syllabus() {
  const [syllabusData, setSyllabusData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        /*
         * Firebase se sirf Published syllabus
         * records fetch kiye ja rahe hain.
         */
        const syllabusQuery = query(
          collection(db, "syllabus"),
          where("status", "==", "Published")
        );

        const snapshot = await getDocs(syllabusQuery);

        const data = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .sort((first, second) => {
            const firstTime = first.createdAt?.toMillis
              ? first.createdAt.toMillis()
              : new Date(first.createdAt || 0).getTime();
            const secondTime = second.createdAt?.toMillis
              ? second.createdAt.toMillis()
              : new Date(second.createdAt || 0).getTime();

            return secondTime - firstTime;
          });

        setSyllabusData(data);
      } catch (error) {
        console.error("Syllabus loading error:", error);

        setErrorMessage(
          "Unable to load syllabus information right now."
        );

        setSyllabusData([]);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabus();
  }, []);

  /*
   * Group syllabus documents by class.
   */
  const groupedClasses = syllabusData.reduce(
    (groups, item) => {
      const className =
        item.className ||
        item.class ||
        "";

      const subject =
        item.subject ||
        "";

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

      /*
       * Award & Scholarship Test ke liye
       * sirf Mathematics aur Science.
       */
      if (
        subject &&
        ["Mathematics", "Science"].includes(subject) &&
        !groups[className].subjects.includes(subject)
      ) {
        groups[className].subjects.push(subject);
      }

      /*
       * Sirf Mathematics aur Science syllabus
       * resources mein show hoga.
       */
      if (
        ["Mathematics", "Science"].includes(subject)
      ) {
        groups[className].topics.push(item);
      }

      return groups;
    },
    {}
  );

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
   * Default class structure.
   *
   * Class 4 to Class 12
   * Only Mathematics + Science.
   */
  const defaultClasses = [
    {
      className: "Class 4",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 5",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 6",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 7",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 8",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 9",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 10",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 11",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
    {
      className: "Class 12",
      subjects: ["Mathematics", "Science"],
      topics: [],
    },
  ];

  /*
   * Firebase data available ho to Firebase data.
   * Warna default classes.
   */
  const displayClasses =
    classes.length > 0
      ? classes
      : defaultClasses;

  const selectedClassTopics = selectedClass
    ? syllabusData.filter((item) => {
        const className =
          item.className ||
          item.class ||
          "";

        return (
          className === selectedClass.className &&
          ["Mathematics", "Science"].includes(
            item.subject
          )
        );
      })
    : [];

  const getClassNumber = (className) => {
    const number = className.match(/\d+/);

    return number
      ? number[0]
      : "10+";
  };

  return (
    <div className="syllabus-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="syllabus-hero">
        <div className="syllabus-container">

          <span className="syllabus-hero-label">
            ALL INDIA BRIGHT STUDENT AWARD & SCHOLARSHIP TEST
          </span>

          <h1>
            Explore the
            <span> Syllabus</span>
          </h1>

          <p>
            Explore the Mathematics and Science syllabus
            for students from Class 4 to Class 12,
            designed around their school curriculum.
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
              CLASSES 4–12
            </span>

            <h2>
              Award & Scholarship Test Syllabus
            </h2>

            <p>
              Select your class to explore the
              Mathematics and Science syllabus.
              The examination is based on the student's
              own school syllabus with conceptual,
              application-based and higher-order questions.
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
                      {getClassNumber(item.className)}
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
                      setSelectedClass(item);

                      window.setTimeout(() => {
                        const element =
                          document.getElementById(
                            "syllabus-topics"
                          );

                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 0);
                    }}
                  >
                    {selectedClass?.className ===
                    item.className
                      ? "Selected"
                      : "View Syllabus →"}
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
        selectedClass &&
        syllabusData.length > 0 && (
          <section className="syllabus-resources">

            <div className="syllabus-container">

              <div
                className="syllabus-heading"
                id="syllabus-topics"
              >

                <span className="syllabus-section-label">
                  SYLLABUS TOPICS
                </span>

                <h2>
                  {selectedClass.className} Syllabus
                </h2>

                <p>
                  Explore the detailed Mathematics and
                  Science syllabus currently published
                  by APJ EDU.
                </p>

              </div>


              <div className="resource-grid">

                {selectedClassTopics.map((item) => (
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
                          `Complete ${
                            item.subject ||
                            "Academic"
                          } Syllabus`}
                      </h3>


                      {item.description ? (
                        <div
                          className="syllabus-description"
                        >
                          {item.description}
                        </div>
                      ) : (
                        <p>
                          {item.subject ||
                            "Academic"}{" "}
                          syllabus for{" "}
                          {item.className ||
                            item.class ||
                            "students"}.
                        </p>
                      )}


                      <div
                        style={{
                          marginTop: "18px",
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

              {selectedClassTopics.length === 0 && (
                <p className="syllabus-empty-state">
                  Detailed syllabus for {selectedClass.className} is
                  not available yet.
                </p>
              )}

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
              APJ EDU provides students with useful
              academic resources to support their
              preparation.
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
                strengthen their conceptual understanding.
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
              Find Your Class & Start Preparing
            </h2>

            <p>
              Explore the syllabus for your class and
              prepare for the All India Bright Student
              Award & Scholarship Test.
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