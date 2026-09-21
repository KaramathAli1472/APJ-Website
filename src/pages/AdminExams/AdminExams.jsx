import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./AdminExams.css";

const emptyQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "A",
});

function AdminExams() {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [form, setForm] = useState({
    title: "",
    className: "Class 4",
    durationMinutes: "60",
    scheduledAt: "",
    status: "Draft",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadExams = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "exams"), orderBy("createdAt", "desc"))
      );
      setExams(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (loadError) {
      console.error("Exam loading error:", loadError);
      setError("Unable to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const updateQuestion = (index, key, value) => {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, [key]: value }
          : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, emptyQuestion()]);
  };

  const removeQuestion = (index) => {
    setQuestions((current) =>
      current.length === 1
        ? current
        : current.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const resetForm = () => {
    setForm({
      title: "",
      className: "Class 4",
      durationMinutes: "60",
      scheduledAt: "",
      status: "Draft",
    });
    setQuestions([emptyQuestion()]);
  };

  const createExam = async (event) => {
    event.preventDefault();
    const validQuestions = questions.every(
      (question) =>
        question.text.trim() &&
        question.options.every((option) => option.trim())
    );

    if (!form.title.trim() || !validQuestions) {
      setError("Enter an exam title and complete every question and option.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await addDoc(collection(db, "exams"), {
        ...form,
        title: form.title.trim(),
        durationMinutes: Number(form.durationMinutes),
        questions: questions.map((question) => ({
          ...question,
          text: question.text.trim(),
          options: question.options.map((option) => option.trim()),
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      resetForm();
      await loadExams();
    } catch (saveError) {
      console.error("Exam creation error:", saveError);
      setError("Unable to create exam.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (exam) => {
    await updateDoc(doc(db, "exams", exam.id), {
      status: exam.status === "Published" ? "Draft" : "Published",
      updatedAt: serverTimestamp(),
    });
    await loadExams();
  };

  const removeExam = async (exam) => {
    if (!window.confirm(`Delete ${exam.title}?`)) return;
    await deleteDoc(doc(db, "exams", exam.id));
    await loadExams();
  };

  return (
    <main className="admin-exams-page">
      <header className="admin-exams-header">
        <div>
          <span>ASSESSMENT MANAGEMENT</span>
          <h1>Exams</h1>
          <p>Create timed MCQ exams for Classes 4–12.</p>
        </div>
      </header>

      {error && <div className="admin-exams-error">{error}</div>}

      <form className="admin-exam-form" onSubmit={createExam}>
        <div className="admin-exam-form-heading">
          <div>
            <span>NEW EXAM</span>
            <h2>Create an examination</h2>
          </div>
          <strong>{questions.length} question{questions.length === 1 ? "" : "s"}</strong>
        </div>

        <div className="admin-exam-fields">
          <label>
            Exam name
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Mathematics Unit Test" />
          </label>
          <label>
            Class
            <select value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })}>
              {Array.from({ length: 9 }, (_, index) => <option key={index + 4}>Class {index + 4}</option>)}
            </select>
          </label>
          <label>
            Duration (minutes)
            <input type="number" min="1" value={form.durationMinutes} onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })} />
          </label>
          <label>
            Exam date/time
            <input type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })} />
          </label>
          <label>
            Initial status
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>Draft</option>
              <option>Published</option>
            </select>
          </label>
        </div>

        <div className="admin-question-list">
          {questions.map((question, questionIndex) => (
            <fieldset className="admin-question" key={questionIndex}>
              <legend>Question {questionIndex + 1}</legend>
              <button type="button" className="admin-question-remove" onClick={() => removeQuestion(questionIndex)}>Remove</button>
              <textarea value={question.text} onChange={(event) => updateQuestion(questionIndex, "text", event.target.value)} placeholder="Write the question here" />
              <div className="admin-option-grid">
                {question.options.map((option, optionIndex) => {
                  const letter = String.fromCharCode(65 + optionIndex);
                  return (
                    <label key={letter}>
                      <span>{letter}</span>
                      <input value={option} onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)} placeholder={`Option ${letter}`} />
                    </label>
                  );
                })}
              </div>
              <label className="admin-correct-answer">
                Correct answer
                <select value={question.correctAnswer} onChange={(event) => updateQuestion(questionIndex, "correctAnswer", event.target.value)}>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </label>
            </fieldset>
          ))}
        </div>

        <div className="admin-exam-actions">
          <button type="button" className="admin-secondary-button" onClick={addQuestion}>+ Add Question</button>
          <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? "Saving..." : "Create Exam"}</button>
        </div>
      </form>

      <section className="admin-exam-list">
        <div className="admin-exam-list-heading"><h2>Created Exams</h2><span>{exams.length} total</span></div>
        {loading ? <p>Loading exams...</p> : exams.length === 0 ? <p>No exams created yet.</p> : exams.map((exam) => (
          <article key={exam.id} className="admin-exam-row">
            <div><span>{exam.className} · {exam.durationMinutes} minutes</span><h3>{exam.title}</h3><p>{exam.questions?.length || 0} questions</p></div>
            <div className="admin-exam-row-actions"><strong className={`admin-exam-status ${exam.status?.toLowerCase()}`}>{exam.status}</strong><button type="button" onClick={() => toggleStatus(exam)}>{exam.status === "Published" ? "Unpublish" : "Publish"}</button><button type="button" onClick={() => removeExam(exam)}>Delete</button></div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminExams;
