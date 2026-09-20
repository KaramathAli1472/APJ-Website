import { useEffect, useState } from "react";

import {
collection,
doc,
onSnapshot,
setDoc,
serverTimestamp,
} from "firebase/firestore";

import "./AdminSettings.css";

import { db } from "../../services/firestore/firestoreService";

function AdminSettings() {
const [activeTab, setActiveTab] =
useState("profile");

const [loading, setLoading] =
useState(false);

const [saving, setSaving] =
useState(false);

const [message, setMessage] =
useState("");

const [error, setError] =
useState("");

const [profileData, setProfileData] =
useState({
name: "",
email: "",
phone: "",
role: "Administrator",
});

const [websiteData, setWebsiteData] =
useState({
societyName:
"APJ Abdul Kalam Educational Welfare Society",
websiteName: "APJ EDU",
email: "",
phone: "",
address: "",
description: "",
});

// =========================
// LOAD SETTINGS
// =========================

useEffect(() => {
const settingsRef = collection(
db,
"settings"
);

const unsubscribe = onSnapshot(
  settingsRef,
  (snapshot) => {
    let profile = null;
    let website = null;

    snapshot.docs.forEach((item) => {
      if (item.id === "adminProfile") {
        profile = item.data();
      }

      if (item.id === "website") {
        website = item.data();
      }
    });

    if (profile) {
      setProfileData((current) => ({
        ...current,
        ...profile,
      }));
    }

    if (website) {
      setWebsiteData((current) => ({
        ...current,
        ...website,
      }));
    }

    setLoading(false);
    setError("");
  },
  (firebaseError) => {
    console.error(
      "Settings Firestore Error:",
      firebaseError
    );

    setError(
      "Unable to load settings. Please check your Firestore connection."
    );

    setLoading(false);
  }
);

return () => unsubscribe();

}, []);

// =========================
// PROFILE CHANGE
// =========================

const handleProfileChange = (
event
) => {
const { name, value } =
event.target;

setProfileData((current) => ({
  ...current,
  [name]: value,
}));

setMessage("");

};

// =========================
// WEBSITE CHANGE
// =========================

const handleWebsiteChange = (
event
) => {
const { name, value } =
event.target;

setWebsiteData((current) => ({
  ...current,
  [name]: value,
}));

setMessage("");

};

// =========================
// SAVE PROFILE
// =========================

const saveProfile = async (event) => {
event.preventDefault();

try {
  setSaving(true);
  setMessage("");
  setError("");

  await setDoc(
    doc(db, "settings", "adminProfile"),
    {
      ...profileData,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  setMessage(
    "Admin profile saved successfully."
  );
} catch (firebaseError) {
  console.error(
    "Save Profile Error:",
    firebaseError
  );

  setError(
    "Unable to save admin profile."
  );
} finally {
  setSaving(false);
}

};

// =========================
// SAVE WEBSITE
// =========================

const saveWebsite = async (event) => {
event.preventDefault();

try {
  setSaving(true);
  setMessage("");
  setError("");

  await setDoc(
    doc(db, "settings", "website"),
    {
      ...websiteData,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  setMessage(
    "Website information saved successfully."
  );
} catch (firebaseError) {
  console.error(
    "Save Website Error:",
    firebaseError
  );

  setError(
    "Unable to save website information."
  );
} finally {
  setSaving(false);
}

};

// =========================
// SECURITY TAB
// =========================

const handleSecurityInfo = () => {
window.alert(
"Password and authentication are managed securely through Firebase Authentication."
);
};

if (loading) {
return (
<div className="admin-settings-page">

    <div className="settings-loading">
      <span>⏳</span>

      <h2>
        Loading settings...
      </h2>

      <p>
        Please wait while your settings
        are loaded from Firebase.
      </p>
    </div>

  </div>
);

}

return (
<div className="admin-settings-page">

  {/* =========================
      HEADER
  ========================= */}

  <header className="admin-settings-header">

    <div>
      <span>
        SYSTEM CONFIGURATION
      </span>

      <h1>
        Settings
      </h1>

      <p>
        Manage administrator profile,
        website information and security
        settings.
      </p>
    </div>

  </header>

  {/* =========================
      MESSAGE
  ========================= */}

  {message && (
    <div className="settings-success">
      ✓ {message}
    </div>
  )}

  {error && (
    <div className="settings-error">
      {error}
    </div>
  )}

  {/* =========================
      TABS
  ========================= */}

  <div className="settings-tabs">

    <button
      type="button"
      className={
        activeTab === "profile"
          ? "active"
          : ""
      }
      onClick={() =>
        setActiveTab("profile")
      }
    >
      👤 Admin Profile
    </button>

    <button
      type="button"
      className={
        activeTab === "website"
          ? "active"
          : ""
      }
      onClick={() =>
        setActiveTab("website")
      }
    >
      🌐 Website Information
    </button>

    <button
      type="button"
      className={
        activeTab === "security"
          ? "active"
          : ""
      }
      onClick={() =>
        setActiveTab("security")
      }
    >
      🔒 Security
    </button>

  </div>

  {/* =========================
      PROFILE
  ========================= */}

  {activeTab === "profile" && (
    <section className="settings-card">

      <div className="settings-card-header">

        <div>
          <span>
            ADMINISTRATOR
          </span>

          <h2>
            Admin Profile
          </h2>

          <p>
            Update administrator contact
            information.
          </p>
        </div>

        <div className="settings-profile-icon">
          👤
        </div>

      </div>

      <form
        className="settings-form"
        onSubmit={saveProfile}
      >

        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Admin Name
            </label>

            <input
              type="text"
              name="name"
              value={
                profileData.name
              }
              onChange={
                handleProfileChange
              }
              placeholder="Enter admin name"
              required
            />

          </div>

          <div className="settings-field">

            <label>
              Role
            </label>

            <input
              type="text"
              name="role"
              value={
                profileData.role
              }
              onChange={
                handleProfileChange
              }
              placeholder="Administrator"
            />

          </div>

        </div>

        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                profileData.email
              }
              onChange={
                handleProfileChange
              }
              placeholder="admin@example.com"
              required
            />

          </div>

          <div className="settings-field">

            <label>
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={
                profileData.phone
              }
              onChange={
                handleProfileChange
              }
              placeholder="Enter phone number"
            />

          </div>

        </div>

        <div className="settings-actions">

          <button
            type="submit"
            className="settings-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </form>

    </section>
  )}

  {/* =========================
      WEBSITE
  ========================= */}

  {activeTab === "website" && (
    <section className="settings-card">

      <div className="settings-card-header">

        <div>
          <span>
            WEBSITE CONFIGURATION
          </span>

          <h2>
            Website Information
          </h2>

          <p>
            Manage the basic information
            displayed across the website.
          </p>
        </div>

        <div className="settings-profile-icon">
          🌐
        </div>

      </div>

      <form
        className="settings-form"
        onSubmit={saveWebsite}
      >

        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Society Name
            </label>

            <input
              type="text"
              name="societyName"
              value={
                websiteData.societyName
              }
              onChange={
                handleWebsiteChange
              }
              required
            />

          </div>

          <div className="settings-field">

            <label>
              Website Name
            </label>

            <input
              type="text"
              name="websiteName"
              value={
                websiteData.websiteName
              }
              onChange={
                handleWebsiteChange
              }
              required
            />

          </div>

        </div>

        <div className="settings-form-row">

          <div className="settings-field">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                websiteData.email
              }
              onChange={
                handleWebsiteChange
              }
              placeholder="society@example.com"
            />

          </div>

          <div className="settings-field">

            <label>
              Phone / WhatsApp
            </label>

            <input
              type="tel"
              name="phone"
              value={
                websiteData.phone
              }
              onChange={
                handleWebsiteChange
              }
              placeholder="Enter contact number"
            />

          </div>

        </div>

        <div className="settings-field">

          <label>
            Address
          </label>

          <input
            type="text"
            name="address"
            value={
              websiteData.address
            }
            onChange={
              handleWebsiteChange
            }
            placeholder="Enter society address"
          />

        </div>

        <div className="settings-field">

          <label>
            Website Description
          </label>

          <textarea
            name="description"
            value={
              websiteData.description
            }
            onChange={
              handleWebsiteChange
            }
            placeholder="Enter website description..."
            rows="6"
          />

        </div>

        <div className="settings-actions">

          <button
            type="submit"
            className="settings-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Website Information"}
          </button>

        </div>

      </form>

    </section>
  )}

  {/* =========================
      SECURITY
  ========================= */}

  {activeTab === "security" && (
    <section className="settings-card">

      <div className="settings-card-header">

        <div>
          <span>
            ACCOUNT SECURITY
          </span>

          <h2>
            Security
          </h2>

          <p>
            Your administrator account is
            protected through Firebase
            Authentication.
          </p>
        </div>

        <div className="settings-profile-icon">
          🔒
        </div>

      </div>

      <div className="security-content">

        <div className="security-item">

          <div className="security-item-icon">
            🔐
          </div>

          <div>
            <h3>
              Firebase Authentication
            </h3>

            <p>
              Admin login is handled
              securely by Firebase
              Authentication.
            </p>
          </div>

        </div>

        <div className="security-item">

          <div className="security-item-icon">
            🛡️
          </div>

          <div>
            <h3>
              Password Security
            </h3>

            <p>
              Your password is not stored
              inside Firestore or the
              website code.
            </p>
          </div>

        </div>

        <div className="security-item">

          <div className="security-item-icon">
            ⚡
          </div>

          <div>
            <h3>
              Authentication Provider
            </h3>

            <p>
              Email and password
              authentication is enabled
              for the administrator account.
            </p>
          </div>

        </div>

      </div>

      <div className="security-note">

        <strong>
          Important
        </strong>

        <p>
          Do not put Firebase passwords,
          Cloudinary API secrets or other
          private credentials inside your
          React source code.
        </p>

      </div>

      <div className="settings-actions">

        <button
          type="button"
          className="settings-save-button"
          onClick={
            handleSecurityInfo
          }
        >
          View Security Information
        </button>

      </div>

    </section>
  )}

</div>

);
}

export default AdminSettings;