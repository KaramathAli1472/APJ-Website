import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, logoutAdmin } from "../../services/auth/authService";
import { db } from "../../services/firestore/firestoreService";

import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRegistration = async () => {
      try {
        const profileSnapshot = await getDoc(
          doc(db, "studentProfiles", auth.currentUser.uid)
        );

        if (!profileSnapshot.exists()) {
          throw new Error("Student profile was not found.");
        }

        const profile = profileSnapshot.data();
        const registrationSnapshot = await getDoc(
          doc(db, "registrations", profile.registrationDocId)
        );

        if (!registrationSnapshot.exists()) {
          throw new Error("Registration record was not found.");
        }

        setRegistration({
          id: registrationSnapshot.id,
          ...registrationSnapshot.data(),
        });

        const examsSnapshot = await getDocs(
          query(
            collection(db, "exams"),
            where("status", "==", "Published")
          )
        );

        setExams(
          examsSnapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .filter(
              (exam) =>
                exam.className ===
                registrationData.className
            )
        );
      } catch (loadError) {
        console.error("Student dashboard loading error:", loadError);
        setError("Unable to load your registration details.");
      } finally {
        setLoading(false);
      }
    };

    loadRegistration();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/student/login");
  };

  if (loading) {
    return (
      <main className="student-dashboard-state">
        Loading your account...
      </main>
    );
  }

  if (error || !registration) {
    return (
      <main className="student-dashboard-state">
        {error}
      </main>
    );
  }

  return (
    <main className="student-dashboard-page">
      <header className="student-dashboard-header">
        <div>
          <span>STUDENT PORTAL</span>
          <h1>Welcome, {registration.studentName}</h1>
          <p>Registration ID: {registration.registrationId}</p>
        </div>

        <button type="button" onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <section className="student-dashboard-grid">
        <article>
          <span>REGISTRATION STATUS</span>
          <strong>{registration.approvalStatus || "Pending"}</strong>
        </article>

        <article>
          <span>PAYMENT STATUS</span>
          <strong>{registration.paymentStatus || "Pending"}</strong>
        </article>

        <article>
          <span>ID CARD</span>
          <strong>{registration.idCardStatus || "Not Generated"}</strong>
        </article>
      </section>

      <section className="student-dashboard-panel">
        <h2>My Registration</h2>
        <p>Your registration is being reviewed by the administration.</p>

        <div>
          <span>School</span>
          <strong>{registration.schoolName || "-"}</strong>
        </div>

        <div>
          <span>Class</span>
          <strong>{registration.className || "-"}</strong>
        </div>
      </section>

      <section className="student-dashboard-panel">
        <h2>Available Exams</h2>
        {exams.length === 0 ? (
          <p>No exams are currently available for your class.</p>
        ) : (
          <div className="student-exam-list">
            {exams.map((exam) => (
              <Link
                to={`/student/exams/${exam.id}`}
                key={exam.id}
              >
                <strong>{exam.title}</strong>
                <span>
                  {exam.questions?.length || 0} questions · {exam.durationMinutes} minutes
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default StudentDashboard;
