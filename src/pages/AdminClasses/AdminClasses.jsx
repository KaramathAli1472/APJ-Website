import { useEffect, useMemo, useState } from "react";

import {
addDoc,
collection,
deleteDoc,
doc,
onSnapshot,
orderBy,
query,
serverTimestamp,
updateDoc,
} from "firebase/firestore";

import "./AdminClasses.css";

import { db } from "../../services/firestore/firestoreService";

function AdminClasses() {
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);

const [classes, setClasses] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [formData, setFormData] = useState({
className: "Class 4",
section: "A",
subjects: "Mathematics, Science, English",
description: "",
students: 0,
status: "Active",
});

// =========================
// FIRESTORE LISTENER
// =========================

useEffect(() => {
const classesRef = collection(db, "classes");

const classesQuery = query(
  classesRef,
  orderBy("createdAt", "desc")
);

const unsubscribe = onSnapshot(
  classesQuery,
  (snapshot) => {
    const classList = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setClasses(classList);
    setLoading(false);
    setError("");
  },
  (firebaseError) => {
    console.error(
      "Classes Firestore Error:",
      firebaseError
    );

    setError(
      "Unable to load classes. Please check your Firestore connection."
    );

    setLoading(false);
  }
);

return () => unsubscribe();

}, []);

// =========================
// FILTERED CLASSES
// =========================

const filteredClasses = useMemo(() => {
return classes.filter((item) => {
const searchText = search.toLowerCase().trim();

  const className =
    item.className?.toLowerCase() || "";

  const section =
    item.section?.toLowerCase() || "";

  const subjects = Array.isArray(item.subjects)
    ? item.subjects
    : [];

  const matchesSearch =
    className.includes(searchText) ||
    section.includes(searchText) ||
    subjects.some((subject) =>
      subject.toLowerCase().includes(searchText)
    );

  const matchesStatus =
    statusFilter === "All" ||
    item.status === statusFilter;

  return matchesSearch && matchesStatus;
});

}, [classes, search, statusFilter]);

// =========================
// STATS
// =========================

const activeCount = classes.filter(
(item) => item.status === "Active"
).length;

const inactiveCount = classes.filter(
(item) => item.status === "Inactive"
).length;

const totalStudents = classes.reduce(
(total, item) =>
total + Number(item.students || 0),
0
);

// =========================
// FORM HANDLER
// =========================

const handleChange = (event) => {
const { name, value } = event.target;

setFormData((current) => ({
  ...current,
  [name]: value,
}));

};

// =========================
// RESET FORM
// =========================

const resetForm = () => {
setFormData({
className: "Class 4",
section: "A",
subjects: "Mathematics, Science, English",
description: "",
students: 0,
status: "Active",
});

setEditingId(null);
setShowForm(false);

};

// =========================
// OPEN ADD FORM
// =========================

const openAddForm = () => {
setEditingId(null);

setFormData({
  className: "Class 4",
  section: "A",
  subjects: "Mathematics, Science, English",
  description: "",
  students: 0,
  status: "Active",
});

setShowForm(true);

};

// =========================
// ADD / UPDATE CLASS
// =========================

const handleSubmit = async (event) => {
event.preventDefault();

if (!formData.description.trim()) {
  window.alert("Please enter class description.");
  return;
}

const subjectList = formData.subjects
  .split(",")
  .map((subject) => subject.trim())
  .filter(Boolean);

if (subjectList.length === 0) {
  window.alert("Please enter at least one subject.");
  return;
}

try {
  setError("");

  const classData = {
    className: formData.className,
    section: formData.section,
    subjects: subjectList,
    description: formData.description.trim(),
    students: Number(formData.students || 0),
    status: formData.status,
  };

  // UPDATE
  if (editingId) {
    const classRef = doc(
      db,
      "classes",
      editingId
    );

    await updateDoc(classRef, {
      ...classData,
      updatedAt: serverTimestamp(),
    });
  }

  // ADD
  else {
    await addDoc(collection(db, "classes"), {
      ...classData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  resetForm();
} catch (firebaseError) {
  console.error(
    "Save Class Error:",
    firebaseError
  );

  window.alert(
    "Unable to save class. Please try again."
  );
}

};

// =========================
// EDIT
// =========================

const handleEdit = (item) => {
setEditingId(item.id);

setFormData({
  className: item.className || "Class 4",
  section: item.section || "A",
  subjects: Array.isArray(item.subjects)
    ? item.subjects.join(", ")
    : "",
  description: item.description || "",
  students: Number(item.students || 0),
  status: item.status || "Active",
});

setShowForm(true);

};

// =========================
// DELETE
// =========================

const handleDelete = async (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this class?"
);

if (!confirmed) {
  return;
}

try {
  setError("");

  await deleteDoc(
    doc(db, "classes", id)
  );
} catch (firebaseError) {
  console.error(
    "Delete Class Error:",
    firebaseError
  );

  window.alert(
    "Unable to delete class. Please try again."
  );
}

};

return (
<div className="admin-classes-page">

  {/* =========================
      HEADER
  ========================= */}

  <header className="admin-classes-header">
    <div>
      <span>ACADEMIC MANAGEMENT</span>

      <h1>Classes Management</h1>

      <p>
        Manage classes, sections, subjects and
        academic information.
      </p>
    </div>

    <button
      type="button"
      className="class-add-button"
      onClick={openAddForm}
    >
      <span>+</span>
      Add Class
    </button>
  </header>

  {/* =========================
      STATS
  ========================= */}

  <section className="class-stats">

    <div className="class-stat-card">
      <div className="class-stat-icon">
        🎓
      </div>

      <div>
        <span>Total Classes</span>
        <strong>{classes.length}</strong>
      </div>
    </div>

    <div className="class-stat-card">
      <div className="class-stat-icon active">
        ✓
      </div>

      <div>
        <span>Active Classes</span>
        <strong>{activeCount}</strong>
      </div>
    </div>

    <div className="class-stat-card">
      <div className="class-stat-icon inactive">
        ×
      </div>

      <div>
        <span>Inactive</span>
        <strong>{inactiveCount}</strong>
      </div>
    </div>

    <div className="class-stat-card">
      <div className="class-stat-icon students">
        👥
      </div>

      <div>
        <span>Total Students</span>
        <strong>{totalStudents}</strong>
      </div>
    </div>

  </section>

  {/* =========================
      CONTENT
  ========================= */}

  <section className="classes-content-card">

    <div className="classes-toolbar">

      <div className="classes-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search classes or subjects..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
      >
        <option value="All">
          All Status
        </option>

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>
      </select>

    </div>

    {/* =========================
        ERROR
    ========================= */}

    {error && (
      <div
        style={{
          padding: "16px",
          margin: "0 0 20px",
          borderRadius: "10px",
          background: "#fff1f2",
          color: "#be123c",
          border: "1px solid #fecdd3",
        }}
      >
        {error}
      </div>
    )}

    {/* =========================
        LOADING
    ========================= */}

    {loading ? (
      <div className="classes-empty">
        <span>⏳</span>

        <h3>
          Loading classes...
        </h3>

        <p>
          Please wait while classes are
          loaded from Firebase.
        </p>
      </div>
    ) : (
      <div className="classes-grid">

        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <article
              className="class-admin-card"
              key={item.id}
            >

              <div className="class-card-top">

                <div className="class-number">
                  {item.className ===
                  "Intermediate"
                    ? "12"
                    : (item.className || "")
                        .replace(
                          "Class ",
                          ""
                        )}
                </div>

                <div>
                  <span className="class-label">
                    ACADEMIC CLASS
                  </span>

                  <h3>
                    {item.className}
                  </h3>
                </div>

                <span
                  className={`class-status ${
                    item.status?.toLowerCase() ||
                    "inactive"
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <div className="class-section-row">
                <span>
                  Section
                </span>

                <strong>
                  {item.section}
                </strong>
              </div>

              <p className="class-description">
                {item.description}
              </p>

              <div className="class-subjects">

                <span>
                  Subjects
                </span>

                <div>
                  {Array.isArray(
                    item.subjects
                  ) &&
                    item.subjects.map(
                      (subject) => (
                        <span
                          key={subject}
                          className="subject-chip"
                        >
                          {subject}
                        </span>
                      )
                    )}
                </div>

              </div>

              <div className="class-card-footer">

                <div className="student-count">
                  <span>👥</span>

                  <strong>
                    {Number(
                      item.students || 0
                    )}
                  </strong>

                  <small>
                    Students
                  </small>
                </div>

                <div className="class-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </article>
          ))
        ) : (
          <div className="classes-empty">

            <span>🎓</span>

            <h3>
              No classes found
            </h3>

            <p>
              Try changing your search or
              status filter, or add a new
              class.
            </p>

          </div>
        )}

      </div>
    )}

  </section>

  {/* =========================
      ADD / EDIT MODAL
  ========================= */}

  {showForm && (
    <div
      className="class-modal-overlay"
      onClick={resetForm}
    >
      <div
        className="class-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="class-modal-header">

          <div>
            <span>
              ACADEMIC MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Edit Class"
                : "Add Class"}
            </h2>
          </div>

          <button
            type="button"
            onClick={resetForm}
          >
            ×
          </button>

        </div>

        <form
          className="class-form"
          onSubmit={handleSubmit}
        >

          <div className="class-form-row">

            <div className="class-field">

              <label>
                Class
              </label>

              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
              >
                {Array.from(
                  { length: 7 },
                  (_, index) => (
                    <option
                      key={index + 4}
                      value={`Class ${
                        index + 4
                      }`}
                    >
                      Class {index + 4}
                    </option>
                  )
                )}

                <option value="Class 11">
                  Class 11
                </option>

                <option value="Class 12">
                  Class 12
                </option>

              </select>

            </div>

            <div className="class-field">

              <label>
                Section
              </label>

              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
              >
                <option value="A">
                  Section A
                </option>

                <option value="B">
                  Section B
                </option>

                <option value="C">
                  Section C
                </option>

                <option value="D">
                  Section D
                </option>

              </select>

            </div>

          </div>

          <div className="class-field">

            <label>
              Subjects
            </label>

            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="Mathematics, Science, English"
            />

            <small>
              Separate subjects with commas.
            </small>

          </div>

          <div className="class-field">

            <label>
              Number of Students
            </label>

            <input
              type="number"
              name="students"
              value={formData.students}
              onChange={handleChange}
              min="0"
              placeholder="Enter number of students"
            />

          </div>

          <div className="class-field">

            <label>
              Class Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter class description..."
              rows="5"
              required
            />

          </div>

          <div className="class-field">

            <label>
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

          <div className="class-form-actions">

            <button
              type="button"
              className="cancel"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save"
            >
              {editingId
                ? "Update Class"
                : "Add Class"}
            </button>

          </div>

        </form>

      </div>
    </div>
  )}

</div>

);
}

export default AdminClasses;