import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth } from "../../services/auth/authService";
import { db } from "../../services/firestore/firestoreService";

import "./StudentExam.css";

function StudentExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      try {
        const [examSnapshot, profileSnapshot] = await Promise.all([
          getDoc(doc(db, "exams", examId)),
          getDoc(doc(db, "studentProfiles", auth.currentUser.uid)),
        ]);

        if (!examSnapshot.exists() || !profileSnapshot.exists()) {
          throw new Error("Exam or student profile was not found.");
        }

        const profile = profileSnapshot.data();
        const registrationSnapshot = await getDoc(
          doc(db, "registrations", profile.registrationDocId)
        );

        if (!registrationSnapshot.exists()) {
          throw new Error("Registration record was not found.");
        }

        const examData = { id: examSnapshot.id, ...examSnapshot.data() };
        const registrationData = registrationSnapshot.data();

        if (examData.status !== "Published" || examData.className !== registrationData.className) {
          throw new Error("This exam is not available for your class.");
        }

        setExam(examData);
        setRegistration({ ...registrationData, ...profile });
        setSecondsLeft(Number(examData.durationMinutes || 60) * 60);
      } catch (loadError) {
        console.error("Exam loading error:", loadError);
        setError(loadError.message || "Unable to load this exam.");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  const submitExam = async () => {
    if (!exam || submitted || submitting) return;
    setSubmitting(true);

    const score = exam.questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.correctAnswer ? 1 : 0),
      0
    );

    try {
      const attemptId = `${exam.id}_${auth.currentUser.uid}`;
      await setDoc(doc(db, "examAttempts", attemptId), {
        examId: exam.id,
        examTitle: exam.title,
        studentUid: auth.currentUser.uid,
        registrationId: registration.registrationId,
        className: registration.className,
        answers,
        score,
        totalQuestions: exam.questions.length,
        submittedAt: serverTimestamp(),
      });
      setResult({ score, total: exam.questions.length });
      setSubmitted(true);
    } catch (submitError) {
      console.error("Exam submission error:", submitError);
      setError("Unable to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!exam || submitted) return undefined;

    const preventContextMenu = (event) => event.preventDefault();
    const preventClipboard = (event) => event.preventDefault();
    const preventShortcuts = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "v", "a", "p", "s"].includes(
          event.key.toLowerCase()
        )
      ) {
        event.preventDefault();
      }
    };
    const warnBeforeLeave = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("keydown", preventShortcuts);
    window.addEventListener("beforeunload", warnBeforeLeave);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("keydown", preventShortcuts);
      window.removeEventListener("beforeunload", warnBeforeLeave);
    };
  }, [exam, submitted]);

  useEffect(() => {
    if (!exam || submitted || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [exam, submitted, secondsLeft]);

  useEffect(() => {
    if (exam && secondsLeft === 0 && !submitted) submitExam();
  }, [secondsLeft, exam, submitted]);

  if (loading) return <main className="student-exam-state">Loading exam...</main>;
  if (error) return <main className="student-exam-state">{error}</main>;

  if (submitted) {
    return (
      <main className="student-exam-state">
        <section className="student-exam-result">
          <span>EXAM SUBMITTED</span>
          <h1>{exam.title}</h1>
          <strong>{result.score} / {result.total}</strong>
          <p>Your answers have been saved successfully.</p>
          <button type="button" onClick={() => navigate("/student/dashboard")}>Back to Dashboard</button>
        </section>
      </main>
    );
  }

  const question = exam.questions[currentQuestion];
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <main className="student-exam-page">
      <header className="student-exam-header">
        <div><span>{exam.className}</span><h1>{exam.title}</h1></div>
        <strong className={secondsLeft < 60 ? "urgent" : ""}>⏱ {minutes}:{seconds}</strong>
      </header>

      <section className="student-exam-question">
        <div className="student-exam-progress">Question {currentQuestion + 1} of {exam.questions.length}</div>
        <h2>{question.text}</h2>
        <div className="student-exam-options">
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            return (
              <button
                type="button"
                key={letter}
                className={answers[currentQuestion] === letter ? "selected" : ""}
                onClick={() => setAnswers((current) => ({ ...current, [currentQuestion]: letter }))}
              >
                <span>{letter}</span>{option}
              </button>
            );
          })}
        </div>
        <div className="student-exam-actions">
          <button type="button" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion((current) => current - 1)}>Previous</button>
          {currentQuestion < exam.questions.length - 1 ? (
            <button type="button" onClick={() => setCurrentQuestion((current) => current + 1)}>Next</button>
          ) : (
            <button type="button" disabled={submitting} onClick={submitExam}>{submitting ? "Submitting..." : "Submit Exam"}</button>
          )}
        </div>
      </section>
    </main>
  );
}

export default StudentExam;
