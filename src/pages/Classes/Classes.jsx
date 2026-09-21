import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import classesData from "../../data/classes/classesData";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./Classes.css";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const classesQuery = query(
      collection(db, "classes"),
      where("status", "==", "Active"),
      orderBy("createdAt", "desc")
    );

    getDocs(classesQuery)
      .then((snapshot) => {
        const firebaseClasses = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setClasses(firebaseClasses);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Classes loading error:", error);

        setErrorMessage(
          "Unable to load classes right now."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * Firebase classes ko public format mein convert karna
   */
  const firebaseClasses = classes
    .filter((item) => item.status !== "Inactive")
    .map((item, index) => ({
      id:
        item.className ||
        item.class ||
        `class-${index + 1}`,
      name:
        item.className ||
        item.class ||
        "Class",
      description:
        item.description ||
        "Explore academic information, subjects and learning resources for this class.",
      students: item.students || 0,
      subjects: item.subjects || [],
    }));

  /*
   * Agar Firestore mein classes nahi hain,
   * to existing classesData show hoga.
   */
  const displayClasses =
    firebaseClasses.length > 0
      ? firebaseClasses
      : classesData;

  return (
    <div className="classes-page">

      {/* Hero Section */}
      <section className="classes-hero">
        <div className="classes-container">

          <span className="classes-hero-badge">
            APJ EDU
          </span>

          <h1>Classes</h1>

          <p>
            Explore academic information and learning
            resources for students from Class 4 to Class 12.
          </p>

        </div>
      </section>

      {/* Classes Section */}
      <section className="classes-section">
        <div className="classes-container">

          <SectionTitle
            eyebrow="Academic Classes"
            title="Explore Your Class"
            description="Select your class to explore available academic information, subjects and learning resources."
          />

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Loading classes...
            </div>
          )}

          {/* Error */}
          {!loading && errorMessage && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                marginBottom: "25px",
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Classes Grid */}
          {!loading && (
            <div className="classes-grid">

              {displayClasses.map((item, index) => (
                <div
                  className="class-card"
                  key={item.id || index}
                >

                  <div className="class-number">
                    {item.name
                      ? item.name
                          .replace("Class ", "")
                          .replace("class ", "")
                      : index + 1}
                  </div>

                  <div className="class-content">

                    <span className="class-label">
                      CLASS
                    </span>

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      {item.description}
                    </p>

                    <Link
                      to={`/syllabus#class-${encodeURIComponent(
                        item.id
                      )}`}
                      className="class-link"
                    >
                      View Syllabus
                      <span>→</span>
                    </Link>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* Learning Resources */}
      <section className="classes-resources">
        <div className="classes-container">

          <div className="resources-content">

            <span className="resources-eyebrow">
              Learning Resources
            </span>

            <h2>
              Support Your Academic Journey
            </h2>

            <p>
              APJ EDU is designed to provide students with
              useful academic information and resources
              to support their learning journey.
            </p>

            <div className="resources-list">

              <div className="resource-item">
                <span>✓</span>
                <p>
                  Class-wise academic information
                </p>
              </div>

              <div className="resource-item">
                <span>✓</span>
                <p>
                  Subject-wise learning resources
                </p>
              </div>

              <div className="resource-item">
                <span>✓</span>
                <p>
                  Easy access to syllabus information
                </p>
              </div>

            </div>

            <Link
              to="/syllabus"
              className="classes-cta-button"
            >
              Explore Syllabus
              <span>→</span>
            </Link>

          </div>

          <div className="resources-card">

            <div className="resources-card-icon">
              📚
            </div>

            <h3>
              Learn. Grow. Succeed.
            </h3>

            <p>
              Building a strong academic foundation
              for a brighter future.
            </p>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="classes-bottom-cta">
        <div className="classes-container">

          <div>
            <span>APJ EDU</span>

            <h2>
              Ready to Continue Your Learning?
            </h2>

            <p>
              Explore the syllabus and discover useful
              academic resources.
            </p>
          </div>

          <Link
            to="/syllabus"
            className="classes-bottom-button"
          >
            View Syllabus
          </Link>

        </div>
      </section>

    </div>
  );
}

export default Classes;