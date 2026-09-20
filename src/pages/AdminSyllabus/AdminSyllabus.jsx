import { useEffect, useMemo, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./AdminSyllabus.css";

function AdminSyllabus() {
  const [selectedClass, setSelectedClass] =
    useState("All");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [syllabusItems, setSyllabusItems] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    className: "Class 4",
    subject: "Mathematics",
    title: "",
    description: "",
    status: "Published",
  });

  // ==========================================
  // Load Syllabus from Firestore
  // ==========================================

  useEffect(() => {
    const syllabusRef = collection(
      db,
      "syllabus"
    );

    const syllabusQuery = query(
      syllabusRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      syllabusQuery,
      (snapshot) => {
        const items = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

        setSyllabusItems(items);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error(
          "Syllabus loading error:",
          firebaseError
        );

        setError(
          "Syllabus could not be loaded. Please check Firestore permissions."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // Filter Syllabus
  // ==========================================

  const filteredItems = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return syllabusItems.filter((item) => {
      const className =
        item.className || "";

      const subject =
        item.subject || "";

      const title =
        item.title || "";

      const description =
        item.description || "";

      const matchesClass =
        selectedClass === "All" ||
        className === selectedClass;

      const matchesSearch =
        title
          .toLowerCase()
          .includes(searchValue) ||
        subject
          .toLowerCase()
          .includes(searchValue) ||
        description
          .toLowerCase()
          .includes(searchValue) ||
        className
          .toLowerCase()
          .includes(searchValue);

      return (
        matchesClass &&
        matchesSearch
      );
    });
  }, [
    syllabusItems,
    selectedClass,
    search,
  ]);

  // ==========================================
  // Statistics
  // ==========================================

  const publishedCount =
    syllabusItems.filter(
      (item) =>
        item.status === "Published"
    ).length;

  const draftCount =
    syllabusItems.filter(
      (item) =>
        item.status === "Draft"
    ).length;

  const classCount =
    new Set(
      syllabusItems.map(
        (item) => item.className
      )
    ).size;

  // ==========================================
  // Form Change
  // ==========================================

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {
    setFormData({
      className: "Class 4",
      subject: "Mathematics",
      title: "",
      description: "",
      status: "Published",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // Add / Update Syllabus
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title =
      formData.title.trim();

    const description =
      formData.description.trim();

    if (!title || !description) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        // ------------------------------
        // Update existing syllabus
        // ------------------------------

        const syllabusRef = doc(
          db,
          "syllabus",
          editingId
        );

        await updateDoc(
          syllabusRef,
          {
            className:
              formData.className,

            subject:
              formData.subject,

            title,

            description,

            status:
              formData.status,

            updatedAt:
              serverTimestamp(),
          }
        );
      } else {
        // ------------------------------
        // Add new syllabus
        // ------------------------------

        await addDoc(
          collection(
            db,
            "syllabus"
          ),
          {
            className:
              formData.className,

            subject:
              formData.subject,

            title,

            description,

            status:
              formData.status,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }

      resetForm();
    } catch (firebaseError) {
      console.error(
        "Syllabus save error:",
        firebaseError
      );

      setError(
        "Syllabus could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Edit Syllabus
  // ==========================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      className:
        item.className ||
        "Class 4",

      subject:
        item.subject ||
        "Mathematics",

      title:
        item.title ||
        "",

      description:
        item.description ||
        "",

      status:
        item.status ||
        "Published",
    });

    setShowForm(true);
  };

  // ==========================================
  // Delete Syllabus
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this syllabus item?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const syllabusRef = doc(
        db,
        "syllabus",
        id
      );

      await deleteDoc(
        syllabusRef
      );
    } catch (firebaseError) {
      console.error(
        "Syllabus delete error:",
        firebaseError
      );

      setError(
        "Syllabus could not be deleted."
      );
    }
  };

  // ==========================================
  // Format Updated Date
  // ==========================================

  const formatUpdatedDate = (item) => {
    if (item.updatedAt?.toDate) {
      return item.updatedAt
        .toDate()
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
    }

    if (item.createdAt?.toDate) {
      return item.createdAt
        .toDate()
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
    }

    return "Recently";
  };

  // ==========================================
  // Subject Icon
  // ==========================================

  const getSubjectIcon = (subject) => {
    if (subject === "Mathematics") {
      return "∑";
    }

    if (subject === "Science") {
      return "⚗";
    }

    return "A";
  };

  // ==========================================
  // Open Add Form
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      className:
        selectedClass !== "All"
          ? selectedClass
          : "Class 4",

      subject: "Mathematics",

      title: "",

      description: "",

      status: "Published",
    });

    setError("");
    setShowForm(true);
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="syllabus-admin-page">

      {/* Header */}

      <header className="syllabus-admin-header">

        <div>
          <span>
            CONTENT MANAGEMENT
          </span>

          <h1>
            Syllabus Management
          </h1>

          <p>
            Manage class-wise academic syllabus
            and learning resources.
          </p>
        </div>

        <button
          type="button"
          className="syllabus-add-button"
          onClick={openAddForm}
        >
          <span>+</span>
          Add Syllabus
        </button>

      </header>

      {/* Error */}

      {error && (
        <div className="syllabus-error">
          <span>!</span>
          {error}
        </div>
      )}

      {/* Statistics */}

      <section className="syllabus-stats">

        <div className="syllabus-stat-card">

          <div className="syllabus-stat-icon">
            📚
          </div>

          <div>
            <span>
              Total Topics
            </span>

            <strong>
              {syllabusItems.length}
            </strong>
          </div>

        </div>

        <div className="syllabus-stat-card">

          <div className="syllabus-stat-icon published">
            ✓
          </div>

          <div>
            <span>
              Published
            </span>

            <strong>
              {publishedCount}
            </strong>
          </div>

        </div>

        <div className="syllabus-stat-card">

          <div className="syllabus-stat-icon draft">
            📝
          </div>

          <div>
            <span>
              Drafts
            </span>

            <strong>
              {draftCount}
            </strong>
          </div>

        </div>

        <div className="syllabus-stat-card">

          <div className="syllabus-stat-icon classes">
            🎓
          </div>

          <div>
            <span>
              Classes
            </span>

            <strong>
              {classCount}
            </strong>
          </div>

        </div>

      </section>

      {/* Main Content */}

      <section className="syllabus-content-card">

        {/* Toolbar */}

        <div className="syllabus-toolbar">

          <div className="syllabus-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search syllabus..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={selectedClass}
            onChange={(event) =>
              setSelectedClass(
                event.target.value
              )
            }
          >

            <option value="All">
              All Classes
            </option>

            {Array.from(
              { length: 10 },
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

          </select>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="syllabus-loading">

            <div className="syllabus-spinner" />

            <p>
              Loading syllabus...
            </p>

          </div>

        ) : (

          /* Syllabus Grid */

          <div className="syllabus-grid">

            {filteredItems.length > 0 ? (

              filteredItems.map(
                (item) => (

                  <article
                    className="syllabus-item-card"
                    key={item.id}
                  >

                    <div className="syllabus-item-top">

                      <span className="syllabus-class-badge">
                        {item.className}
                      </span>

                      <span
                        className={`syllabus-status ${
                          (
                            item.status ||
                            "Published"
                          ).toLowerCase()
                        }`}
                      >
                        {item.status ||
                          "Published"}
                      </span>

                    </div>

                    <div className="syllabus-item-icon">
                      {getSubjectIcon(
                        item.subject
                      )}
                    </div>

                    <span className="syllabus-subject">
                      {item.subject}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <div className="syllabus-item-footer">

                      <small>
                        Updated{" "}
                        {formatUpdatedDate(
                          item
                        )}
                      </small>

                      <div>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )

            ) : (

              <div className="syllabus-empty">

                <span>📚</span>

                <h3>
                  No syllabus found
                </h3>

                <p>
                  {syllabusItems.length ===
                  0
                    ? "No syllabus has been added yet."
                    : "Try changing your search or class filter."}
                </p>

              </div>

            )}

          </div>

        )}

      </section>

      {/* Add / Edit Modal */}

      {showForm && (

        <div
          className="syllabus-modal-overlay"
          onClick={resetForm}
        >

          <div
            className="syllabus-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="syllabus-modal-header">

              <div>

                <span>
                  SYLLABUS MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Syllabus"
                    : "Add Syllabus"}
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
              className="syllabus-form"
              onSubmit={handleSubmit}
            >

              <div className="syllabus-form-row">

                {/* Class */}

                <div className="syllabus-field">

                  <label>
                    Class
                  </label>

                  <select
                    name="className"
                    value={
                      formData.className
                    }
                    onChange={
                      handleChange
                    }
                  >

                    {Array.from(
                      { length: 10 },
                      (_, index) => (
                        <option
                          key={
                            index + 4
                          }
                          value={`Class ${
                            index + 4
                          }`}
                        >
                          Class{" "}
                          {index + 4}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Subject */}

                <div className="syllabus-field">

                  <label>
                    Subject
                  </label>

                  <select
                    name="subject"
                    value={
                      formData.subject
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="Mathematics">
                      Mathematics
                    </option>

                    <option value="Science">
                      Science
                    </option>

                    <option value="English">
                      English
                    </option>

                  </select>

                </div>

              </div>

              {/* Title */}

              <div className="syllabus-field">

                <label>
                  Topic Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter syllabus topic"
                  required
                />

              </div>

              {/* Description */}

              <div className="syllabus-field">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter topic description"
                  rows="5"
                  required
                />

              </div>

              {/* Status */}

              <div className="syllabus-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Published">
                    Published
                  </option>

                  <option value="Draft">
                    Draft
                  </option>

                </select>

              </div>

              {/* Actions */}

              <div className="syllabus-form-actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Syllabus"
                    : "Add Syllabus"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminSyllabus;