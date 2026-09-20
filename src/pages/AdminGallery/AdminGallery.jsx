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

import "./AdminGallery.css";

import { db } from "../../services/firestore/firestoreService";
import cloudinaryConfig from "../../services/cloudinary/cloudinaryConfig";

function AdminGallery() {
const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] =
useState("All");

const [showForm, setShowForm] = useState(false);
const [showPreview, setShowPreview] =
useState(false);

const [editingId, setEditingId] = useState(null);
const [previewImage, setPreviewImage] =
useState(null);

const [gallery, setGallery] = useState([]);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [uploading, setUploading] = useState(false);
const [error, setError] = useState("");

const [formData, setFormData] = useState({
title: "",
category: "Events",
description: "",
imageUrl: "",
});

// =========================
// FIRESTORE LISTENER
// =========================

useEffect(() => {
const galleryRef = collection(db, "gallery");

const galleryQuery = query(
  galleryRef,
  orderBy("createdAt", "desc")
);

const unsubscribe = onSnapshot(
  galleryQuery,
  (snapshot) => {
    const galleryList = snapshot.docs.map(
      (item) => ({
        id: item.id,
        ...item.data(),
      })
    );

    setGallery(galleryList);
    setLoading(false);
    setError("");
  },
  (firebaseError) => {
    console.error(
      "Gallery Firestore Error:",
      firebaseError
    );

    setError(
      "Unable to load gallery. Please check your Firestore connection."
    );

    setLoading(false);
  }
);

return () => unsubscribe();

}, []);

// =========================
// FILTER
// =========================

const filteredGallery = useMemo(() => {
return gallery.filter((item) => {
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

  const matchesCategory =
    categoryFilter === "All" ||
    item.category === categoryFilter;

  return (
    matchesSearch && matchesCategory
  );
});

}, [
gallery,
search,
categoryFilter,
]);

// =========================
// STATS
// =========================

const totalPhotos = gallery.length;

const eventPhotos = gallery.filter(
(item) => item.category === "Events"
).length;

const studentPhotos = gallery.filter(
(item) => item.category === "Students"
).length;

const achievementPhotos = gallery.filter(
(item) => item.category === "Achievements"
).length;

// =========================
// FORM CHANGE
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
title: "",
category: "Events",
description: "",
imageUrl: "",
});

setEditingId(null);
setShowForm(false);
setSaving(false);
setUploading(false);

};

// =========================
// OPEN ADD
// =========================

const openAddForm = () => {
setEditingId(null);

setFormData({
  title: "",
  category: "Events",
  description: "",
  imageUrl: "",
});

setShowForm(true);

};

// =========================
// CLOUDINARY UPLOAD
// =========================

const handleImageUpload = async (event) => {
const file = event.target.files?.[0];

if (!file) {
  return;
}

if (!file.type.startsWith("image/")) {
  window.alert(
    "Please select a valid image file."
  );

  event.target.value = "";
  return;
}

const maxSize =
  10 * 1024 * 1024;

if (file.size > maxSize) {
  window.alert(
    "Image size must be less than 10 MB."
  );

  event.target.value = "";
  return;
}

try {
  setUploading(true);
  setError("");

  const uploadData = new FormData();

  uploadData.append("file", file);

  uploadData.append(
    "upload_preset",
    cloudinaryConfig.uploadPreset
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary Error:",
      data
    );

    throw new Error(
      data?.error?.message ||
        "Cloudinary upload failed."
    );
  }

  setFormData((current) => ({
    ...current,
    imageUrl: data.secure_url,
  }));
} catch (uploadError) {
  console.error(
    "Image Upload Error:",
    uploadError
  );

  window.alert(
    uploadError.message ||
      "Unable to upload image."
  );
} finally {
  setUploading(false);
  event.target.value = "";
}

};

// =========================
// ADD / UPDATE
// =========================

const handleSubmit = async (event) => {
event.preventDefault();

if (!formData.title.trim()) {
  window.alert(
    "Please enter photo title."
  );
  return;
}

if (!formData.imageUrl.trim()) {
  window.alert(
    "Please upload an image first."
  );
  return;
}

try {
  setSaving(true);
  setError("");

  const galleryData = {
    title: formData.title.trim(),
    category: formData.category,
    description:
      formData.description.trim(),
    imageUrl: formData.imageUrl.trim(),
  };

  // UPDATE
  if (editingId) {
    const galleryRef = doc(
      db,
      "gallery",
      editingId
    );

    await updateDoc(galleryRef, {
      ...galleryData,
      updatedAt: serverTimestamp(),
    });
  }

  // ADD
  else {
    await addDoc(
      collection(db, "gallery"),
      {
        ...galleryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
  }

  resetForm();
} catch (firebaseError) {
  console.error(
    "Save Gallery Error:",
    firebaseError
  );

  window.alert(
    "Unable to save gallery photo. Please try again."
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
    item.category || "Events",
  description:
    item.description || "",
  imageUrl: item.imageUrl || "",
});

setShowForm(true);

};

// =========================
// DELETE
// =========================

const handleDelete = async (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this photo?"
);

if (!confirmed) {
  return;
}

try {
  setError("");

  await deleteDoc(
    doc(db, "gallery", id)
  );
} catch (firebaseError) {
  console.error(
    "Delete Gallery Error:",
    firebaseError
  );

  window.alert(
    "Unable to delete photo. Please try again."
  );
}

};

// =========================
// PREVIEW
// =========================

const openPreview = (item) => {
setPreviewImage(item);
setShowPreview(true);
};

const closePreview = () => {
setPreviewImage(null);
setShowPreview(false);
};

return (
<div className="admin-gallery-page">

  {/* =========================
      HEADER
  ========================= */}

  <header className="admin-gallery-header">
    <div>
      <span>
        CONTENT MANAGEMENT
      </span>

      <h1>
        Gallery Management
      </h1>

      <p>
        Manage society events, student
        activities, achievements and
        gallery photos.
      </p>
    </div>

    <button
      type="button"
      className="gallery-add-button"
      onClick={openAddForm}
    >
      <span>+</span>
      Add Photo
    </button>
  </header>

  {/* =========================
      STATS
  ========================= */}

  <section className="gallery-stats">

    <div className="gallery-stat-card">
      <div className="gallery-stat-icon">
        🖼️
      </div>

      <div>
        <span>
          Total Photos
        </span>

        <strong>
          {totalPhotos}
        </strong>
      </div>
    </div>

    <div className="gallery-stat-card">
      <div className="gallery-stat-icon">
        🎉
      </div>

      <div>
        <span>
          Events
        </span>

        <strong>
          {eventPhotos}
        </strong>
      </div>
    </div>

    <div className="gallery-stat-card">
      <div className="gallery-stat-icon">
        👨‍🎓
      </div>

      <div>
        <span>
          Students
        </span>

        <strong>
          {studentPhotos}
        </strong>
      </div>
    </div>

    <div className="gallery-stat-card">
      <div className="gallery-stat-icon">
        🏆
      </div>

      <div>
        <span>
          Achievements
        </span>

        <strong>
          {achievementPhotos}
        </strong>
      </div>
    </div>

  </section>

  {/* =========================
      CONTENT
  ========================= */}

  <section className="gallery-content-card">

    <div className="gallery-toolbar">

      <div className="gallery-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search photos..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(event) =>
          setCategoryFilter(
            event.target.value
          )
        }
      >
        <option value="All">
          All Categories
        </option>

        <option value="Events">
          Events
        </option>

        <option value="Students">
          Students
        </option>

        <option value="Achievements">
          Achievements
        </option>

        <option value="Society">
          Society
        </option>

        <option value="Other">
          Other
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
      <div className="gallery-empty">
        <span>⏳</span>

        <h3>
          Loading gallery...
        </h3>

        <p>
          Please wait while gallery
          photos are loaded.
        </p>
      </div>
    ) : (
      <div className="gallery-admin-grid">

        {filteredGallery.length > 0 ? (
          filteredGallery.map(
            (item) => (
              <article
                className="gallery-admin-card"
                key={item.id}
              >

                <div
                  className="gallery-image-wrapper"
                  onClick={() =>
                    openPreview(item)
                  }
                >
                  <img
                    src={item.imageUrl}
                    alt={
                      item.title ||
                      "Gallery photo"
                    }
                  />

                  <div className="gallery-image-overlay">
                    <span>
                      View
                    </span>
                  </div>
                </div>

                <div className="gallery-card-body">

                  <div className="gallery-card-heading">

                    <span className="gallery-category">
                      {item.category}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                  </div>

                  {item.description && (
                    <p>
                      {item.description}
                    </p>
                  )}

                  <div className="gallery-card-footer">

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

                </div>

              </article>
            )
          )
        ) : (
          <div className="gallery-empty">

            <span>🖼️</span>

            <h3>
              No photos found
            </h3>

            <p>
              Add a photo or change your
              search/category filter.
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
      className="gallery-modal-overlay"
      onClick={resetForm}
    >
      <div
        className="gallery-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="gallery-modal-header">

          <div>
            <span>
              CONTENT MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Edit Photo"
                : "Add Photo"}
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
          className="gallery-form"
          onSubmit={handleSubmit}
        >

          <div className="gallery-field">

            <label>
              Photo Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter photo title..."
              required
            />

          </div>

          <div className="gallery-field">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Events">
                Events
              </option>

              <option value="Students">
                Students
              </option>

              <option value="Achievements">
                Achievements
              </option>

              <option value="Society">
                Society
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          <div className="gallery-field">

            <label>
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageUpload
              }
              disabled={uploading}
            />

            {uploading && (
              <small>
                Uploading image to
                Cloudinary...
              </small>
            )}

            {formData.imageUrl && (
              <div
                style={{
                  marginTop: "12px",
                }}
              >
                <img
                  src={
                    formData.imageUrl
                  }
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    display: "block",
                  }}
                />
              </div>
            )}

          </div>

          <div className="gallery-field">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Enter photo description..."
              rows="4"
            />

          </div>

          <div className="gallery-form-actions">

            <button
              type="button"
              className="cancel"
              onClick={resetForm}
              disabled={
                saving || uploading
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save"
              disabled={
                saving || uploading
              }
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Photo"
                : "Add Photo"}
            </button>

          </div>

        </form>

      </div>
    </div>
  )}

  {/* =========================
      IMAGE PREVIEW
  ========================= */}

  {showPreview &&
    previewImage && (
      <div
        className="gallery-preview-overlay"
        onClick={closePreview}
      >
        <div
          className="gallery-preview-modal"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <button
            type="button"
            className="gallery-preview-close"
            onClick={closePreview}
          >
            ×
          </button>

          <img
            src={
              previewImage.imageUrl
            }
            alt={
              previewImage.title ||
              "Gallery photo"
            }
          />

          <div className="gallery-preview-info">

            <span>
              {previewImage.category}
            </span>

            <h2>
              {previewImage.title}
            </h2>

            {previewImage.description && (
              <p>
                {
                  previewImage.description
                }
              </p>
            )}

          </div>

        </div>
      </div>
    )}

</div>

);
}

export default AdminGallery;