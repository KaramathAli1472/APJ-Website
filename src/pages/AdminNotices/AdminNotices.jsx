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

import "./AdminNotices.css";

import { db } from "../../services/firestore/firestoreService";

function AdminNotices() {
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] =
useState("All");

const [showForm, setShowForm] = useState(false);
const [showView, setShowView] = useState(false);

const [editingId, setEditingId] =
useState(null);

const [selectedNotice, setSelectedNotice] =
useState(null);

const [notices, setNotices] = useState([]);

const [loading, setLoading] =
useState(false);

const [saving, setSaving] =
useState(false);

const [error, setError] =
useState("");

const [formData, setFormData] = useState({
title: "",
category: "General",
description: "",
status: "Published",
});

// =========================
// FIRESTORE LISTENER
// =========================

useEffect(() => {
const noticesRef = collection(
db,
"notices"
);

const noticesQuery = query(
  noticesRef,
  orderBy("createdAt", "desc")
);

const unsubscribe = onSnapshot(
  noticesQuery,
  (snapshot) => {
    const noticeList =
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

    setNotices(noticeList);
    setLoading(false);
    setError("");
  },
  (firebaseError) => {
    console.error(
      "Notices Firestore Error:",
      firebaseError
    );

    setError(
      "Unable to load notices. Please check your Firestore connection."
    );

    setLoading(false);
  }
);

return () => unsubscribe();

}, []);

// =========================
// FILTER
// =========================

const filteredNotices = useMemo(() => {
return notices.filter((item) => {
const searchText =
search.toLowerCase().trim();

  const title =
    item.title?.toLowerCase() || "";

  const category =
    item.category?.toLowerCase() || "";

  const description =
    item.description?.toLowerCase() || "";

  const matchesSearch =
    title.includes(searchText) ||
    category.includes(searchText) ||
    description.includes(searchText);

  const matchesStatus =
    statusFilter === "All" ||
    item.status === statusFilter;

  return (
    matchesSearch &&
    matchesStatus
  );
});

}, [
notices,
search,
statusFilter,
]);

// =========================
// STATS
// =========================

const totalNotices =
notices.length;

const publishedCount =
notices.filter(
(item) =>
item.status === "Published"
).length;

const draftCount =
notices.filter(
(item) =>
item.status === "Draft"
).length;

const importantCount =
notices.filter(
(item) =>
                  item.category === "Registration" ||
item.category === "Examination"
).length;

// =========================
// FORM CHANGE
// =========================

const handleChange = (event) => {
const { name, value } =
event.target;

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
title: "",
category: "General",
description: "",
status: "Published",
});

setEditingId(null);
setShowForm(false);
setSaving(false);

};

// =========================
// OPEN ADD FORM
// =========================

const openAddForm = () => {
setEditingId(null);

setFormData({
  title: "",
  category: "General",
  description: "",
  status: "Published",
});

setShowForm(true);

};

// =========================
// ADD / UPDATE
// =========================

const handleSubmit = async (event) => {
event.preventDefault();

if (!formData.title.trim()) {
  window.alert(
    "Please enter notice title."
  );
  return;
}

if (!formData.description.trim()) {
  window.alert(
    "Please enter notice description."
  );
  return;
}

try {
  setSaving(true);
  setError("");

  const noticeData = {
    title: formData.title.trim(),
    category: formData.category,
    description:
      formData.description.trim(),
    status: formData.status,
  };

  // UPDATE
  if (editingId) {
    const noticeRef = doc(
      db,
      "notices",
      editingId
    );

    await updateDoc(noticeRef, {
      ...noticeData,
      updatedAt:
        serverTimestamp(),
    });
  }

  // ADD
  else {
    await addDoc(
      collection(db, "notices"),
      {
        ...noticeData,
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
    "Save Notice Error:",
    firebaseError
  );

  window.alert(
    "Unable to save notice. Please try again."
  );

  setSaving(false);
}

};

// =========================
// EDIT
// =========================

const handleEdit = (item) => {
setEditingId(item.id);

setFormData({
  title: item.title || "",
  category:
    item.category || "General",
  description:
    item.description || "",
  status:
    item.status || "Published",
});

setShowForm(true);

};

// =========================
// DELETE
// =========================

const handleDelete = async (id) => {
const confirmed =
window.confirm(
"Are you sure you want to delete this notice?"
);

if (!confirmed) {
  return;
}

try {
  setError("");

  await deleteDoc(
    doc(db, "notices", id)
  );
} catch (firebaseError) {
  console.error(
    "Delete Notice Error:",
    firebaseError
  );

  window.alert(
    "Unable to delete notice. Please try again."
  );
}

};

// =========================
// VIEW NOTICE
// =========================

const handleView = (item) => {
setSelectedNotice(item);
setShowView(true);
};

const closeView = () => {
setSelectedNotice(null);
setShowView(false);
};

// =========================
// DATE FORMAT
// =========================

const formatDate = (timestamp) => {
if (!timestamp) {
return "Just now";
}

try {
  const date =
    timestamp.toDate();

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
} catch {
  return "Recently";
}

};

return (
<div className="admin-notices-page">

  {/* =========================
      HEADER
  ========================= */}

  <header className="admin-notices-header">

    <div>
      <span>
        CONTENT MANAGEMENT
      </span>

      <h1>
        Notices Management
      </h1>

      <p>
        Create and manage important
        announcements, updates and
        academic notices.
      </p>
    </div>

    <button
      type="button"
      className="notice-add-button"
      onClick={openAddForm}
    >
      <span>+</span>
      Add Notice
    </button>

  </header>

  {/* =========================
      STATS
  ========================= */}

  <section className="notice-stats">

    <div className="notice-stat-card">
      <div className="notice-stat-icon">
        📢
      </div>

      <div>
        <span>
          Total Notices
        </span>

        <strong>
          {totalNotices}
        </strong>
      </div>
    </div>

    <div className="notice-stat-card">
      <div className="notice-stat-icon published">
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

    <div className="notice-stat-card">
      <div className="notice-stat-icon draft">
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

    <div className="notice-stat-card">
      <div className="notice-stat-icon important">
        !
      </div>

      <div>
        <span>
          Academic
        </span>

        <strong>
          {importantCount}
        </strong>
      </div>
    </div>

  </section>

  {/* =========================
      CONTENT
  ========================= */}

  <section className="notices-content-card">

    <div className="notices-toolbar">

      <div className="notices-search">

        <span>⌕</span>

        <input
          type="text"
          placeholder="Search notices..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

      </div>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(
            event.target.value
          )
        }
      >
        <option value="All">
          All Status
        </option>

        <option value="Published">
          Published
        </option>

        <option value="Draft">
          Draft
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
          marginBottom: "20px",
          borderRadius: "10px",
          background: "#fff1f2",
          color: "#be123c",
          border:
            "1px solid #fecdd3",
        }}
      >
        {error}
      </div>
    )}

    {/* =========================
        LOADING
    ========================= */}

    {loading ? (
      <div className="notices-empty">

        <span>⏳</span>

        <h3>
          Loading notices...
        </h3>

        <p>
          Please wait while notices
          are loaded from Firebase.
        </p>

      </div>
    ) : (
      <div className="notices-list">

        {filteredNotices.length > 0 ? (
          filteredNotices.map(
            (item) => (
              <article
                className="admin-notice-card"
                key={item.id}
              >

                <div className="notice-card-main">

                  <div className="notice-card-icon">
                    📢
                  </div>

                  <div className="notice-card-content">

                    <div className="notice-card-meta">

                      <span className="notice-category">
                        {item.category}
                      </span>

                      <span
                        className={`notice-status ${
                          item.status?.toLowerCase() ||
                          "draft"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <small>
                      Published:
                      {" "}
                      {formatDate(
                        item.createdAt
                      )}
                    </small>

                  </div>

                </div>

                <div className="notice-card-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleView(item)
                    }
                  >
                    View
                  </button>

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
                      handleDelete(
                        item.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>
            )
          )
        ) : (
          <div className="notices-empty">

            <span>📢</span>

            <h3>
              No notices found
            </h3>

            <p>
              Add a new notice or
              change your search/filter.
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
      className="notice-modal-overlay"
      onClick={resetForm}
    >
      <div
        className="notice-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="notice-modal-header">

          <div>
            <span>
              CONTENT MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Edit Notice"
                : "Add Notice"}
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
          className="notice-form"
          onSubmit={handleSubmit}
        >

          <div className="notice-field">

            <label>
              Notice Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notice title..."
              required
            />

          </div>

          <div className="notice-form-row">

            <div className="notice-field">

              <label>
                Category
              </label>

              <select
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
              >
                <option value="General">
                  General
                </option>

                <option value="Registration">
                  Registration
                </option>

                <option value="Scholarship">
                  Scholarship
                </option>

                <option value="Examination">
                  Examination
                </option>

                <option value="Events">
                  Events
                </option>

              </select>

            </div>

            <div className="notice-field">

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

          </div>

          <div className="notice-field">

            <label>
              Notice Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Enter complete notice details..."
              rows="7"
              required
            />

          </div>

          <div className="notice-form-actions">

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
                ? "Update Notice"
                : "Add Notice"}
            </button>

          </div>

        </form>

      </div>
    </div>
  )}

  {/* =========================
      VIEW MODAL
  ========================= */}

  {showView &&
    selectedNotice && (
      <div
        className="notice-view-overlay"
        onClick={closeView}
      >
        <div
          className="notice-view-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <div className="notice-view-header">

            <div>
              <span>
                {selectedNotice.category}
              </span>

              <h2>
                {selectedNotice.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeView}
            >
              ×
            </button>

          </div>

          <div className="notice-view-status">

            <span
              className={`notice-status ${
                selectedNotice.status?.toLowerCase() ||
                "draft"
              }`}
            >
              {selectedNotice.status}
            </span>

            <small>
              {formatDate(
                selectedNotice.createdAt
              )}
            </small>

          </div>

          <div className="notice-view-content">

            <p>
              {
                selectedNotice.description
              }
            </p>

          </div>

          <div className="notice-view-actions">

            <button
              type="button"
              onClick={() => {
                closeView();
                handleEdit(
                  selectedNotice
                );
              }}
            >
              Edit Notice
            </button>

            <button
              type="button"
              className="close"
              onClick={closeView}
            >
              Close
            </button>

          </div>

        </div>
      </div>
    )}

</div>

);
}

export default AdminNotices;