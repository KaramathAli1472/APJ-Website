import { useEffect, useMemo, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./AdminApplications.css";

function AdminApplications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Load Applications from Firestore
  // ==========================================

  useEffect(() => {
    const applicationsRef = collection(
      db,
      "applications"
    );

    const applicationsQuery = query(
      applicationsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        const applicationData = snapshot.docs.map(
          (item) => {
            const data = item.data();

            return {
              id: item.id,
              ...data,
            };
          }
        );

        setApplications(applicationData);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error(
          "Applications loading error:",
          firebaseError
        );

        setError(
          "Applications could not be loaded. Please check Firestore permissions."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // Filter Applications
  // ==========================================

  const filteredApplications = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return applications.filter((application) => {
      const name =
        application.name ||
        application.studentName ||
        "";

      const phone =
        application.phone ||
        application.whatsapp ||
        "";

      const email =
        application.email || "";

      const className =
        application.className ||
        application.class ||
        "";

      const school =
        application.school || "";

      const matchesSearch =
        name.toLowerCase().includes(searchValue) ||
        phone.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        className.toLowerCase().includes(searchValue) ||
        school.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        (application.status || "Pending") ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // ==========================================
  // Statistics
  // ==========================================

  const pendingCount = applications.filter(
    (item) =>
      (item.status || "Pending") === "Pending"
  ).length;

  const approvedCount = applications.filter(
    (item) =>
      item.status === "Approved"
  ).length;

  const rejectedCount = applications.filter(
    (item) =>
      item.status === "Rejected"
  ).length;

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (application) => {
    if (application.date) {
      return application.date;
    }

    if (application.createdAt?.toDate) {
      return application.createdAt
        .toDate()
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
    }

    return "—";
  };

  // ==========================================
  // Update Application Status
  // ==========================================

  const updateStatus = async (
    id,
    newStatus
  ) => {
    try {
      setActionLoading(true);
      setError("");

      const applicationRef = doc(
        db,
        "applications",
        id
      );

      await updateDoc(applicationRef, {
        status: newStatus,
        updatedAt: new Date(),
      });

      setSelectedApplication((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          status: newStatus,
        };
      });
    } catch (firebaseError) {
      console.error(
        "Status update error:",
        firebaseError
      );

      setError(
        "Application status could not be updated."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Delete Application
  // ==========================================

  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const applicationRef = doc(
        db,
        "applications",
        id
      );

      await deleteDoc(applicationRef);

      setSelectedApplication(null);
    } catch (firebaseError) {
      console.error(
        "Application delete error:",
        firebaseError
      );

      setError(
        "Application could not be deleted."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // Get Student Information
  // ==========================================

  const getStudentName = (application) =>
    application.name ||
    application.studentName ||
    "Unknown Student";

  const getFatherName = (application) =>
    application.fatherName ||
    application.fathersName ||
    "—";

  const getClassName = (application) =>
    application.className ||
    application.class ||
    "—";

  const getSchool = (application) =>
    application.school ||
    application.schoolName ||
    "—";

  const getPhone = (application) =>
    application.phone ||
    application.whatsapp ||
    "—";

  const getEmail = (application) =>
    application.email ||
    "—";

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="applications-page">

      {/* Header */}

      <header className="applications-header">
        <div>
          <span>ADMINISTRATION</span>

          <h1>
            Registration Applications
          </h1>

          <p>
            Review and manage student registration
            applications.
          </p>
        </div>

        <div className="applications-header-badge">
          {applications.length} Total
        </div>
      </header>

      {/* Error */}

      {error && (
        <div className="applications-error">
          <span>!</span>
          {error}
        </div>
      )}

      {/* Statistics */}

      <section className="application-stats">

        <div className="application-stat-card">
          <div className="application-stat-icon">
            📋
          </div>

          <div>
            <span>Total Applications</span>
            <strong>
              {applications.length}
            </strong>
          </div>
        </div>

        <div className="application-stat-card pending">
          <div className="application-stat-icon">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {pendingCount}
            </strong>
          </div>
        </div>

        <div className="application-stat-card approved">
          <div className="application-stat-icon">
            ✓
          </div>

          <div>
            <span>Approved</span>
            <strong>
              {approvedCount}
            </strong>
          </div>
        </div>

        <div className="application-stat-card rejected">
          <div className="application-stat-icon">
            ×
          </div>

          <div>
            <span>Rejected</span>
            <strong>
              {rejectedCount}
            </strong>
          </div>
        </div>

      </section>

      {/* Main Card */}

      <section className="applications-card">

        {/* Toolbar */}

        <div className="applications-toolbar">

          <div className="application-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, phone, email, class or school..."
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

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="applications-loading">
            <div className="applications-spinner" />
            <p>
              Loading applications...
            </p>
          </div>
        ) : (

          /* Table */

          <div className="applications-table-wrapper">

            <table className="applications-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>School</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredApplications.length > 0 ? (
                  filteredApplications.map(
                    (application) => {

                      const studentName =
                        getStudentName(
                          application
                        );

                      const status =
                        application.status ||
                        "Pending";

                      return (
                        <tr
                          key={application.id}
                        >

                          {/* Student */}

                          <td>
                            <div className="student-cell">

                              <div className="student-avatar">
                                {studentName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {studentName}
                                </strong>

                                <span>
                                  {getEmail(
                                    application
                                  )}
                                </span>
                              </div>

                            </div>
                          </td>

                          {/* Class */}

                          <td>
                            <span className="class-badge">
                              {getClassName(
                                application
                              )}
                            </span>
                          </td>

                          {/* School */}

                          <td>
                            {getSchool(
                              application
                            )}
                          </td>

                          {/* Contact */}

                          <td>
                            <span className="phone-text">
                              {getPhone(
                                application
                              )}
                            </span>
                          </td>

                          {/* Date */}

                          <td>
                            {formatDate(
                              application
                            )}
                          </td>

                          {/* Status */}

                          <td>
                            <span
                              className={`status-badge ${status.toLowerCase()}`}
                            >
                              {status}
                            </span>
                          </td>

                          {/* Actions */}

                          <td>
                            <div className="application-actions">

                              <button
                                type="button"
                                title="View Application"
                                onClick={() =>
                                  setSelectedApplication(
                                    application
                                  )
                                }
                              >
                                👁
                              </button>

                              <button
                                type="button"
                                title="Delete Application"
                                onClick={() =>
                                  deleteApplication(
                                    application.id
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                              >
                                🗑
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-applications"
                    >
                      <div>
                        <span>📭</span>

                        <h3>
                          No applications found
                        </h3>

                        <p>
                          {applications.length ===
                          0
                            ? "No registration applications have been submitted yet."
                            : "Try changing your search or status filter."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* View Modal */}

      {selectedApplication && (
        <div
          className="application-modal-overlay"
          onClick={() =>
            setSelectedApplication(null)
          }
        >

          <div
            className="application-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="application-modal-header">

              <div>
                <span>
                  APPLICATION DETAILS
                </span>

                <h2>
                  {getStudentName(
                    selectedApplication
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(null)
                }
              >
                ×
              </button>

            </div>

            {/* Details */}

            <div className="application-details">

              <div>
                <span>Father's Name</span>

                <strong>
                  {getFatherName(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Class</span>

                <strong>
                  {getClassName(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>School</span>

                <strong>
                  {getSchool(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {getPhone(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {getEmail(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Application Date</span>

                <strong>
                  {formatDate(
                    selectedApplication
                  )}
                </strong>
              </div>

              <div>
                <span>Current Status</span>

                <span
                  className={`status-badge ${
                    (
                      selectedApplication.status ||
                      "Pending"
                    ).toLowerCase()
                  }`}
                >
                  {selectedApplication.status ||
                    "Pending"}
                </span>
              </div>

            </div>

            {/* Modal Actions */}

            <div className="application-modal-actions">

              <button
                type="button"
                className="reject-button"
                disabled={actionLoading}
                onClick={() =>
                  updateStatus(
                    selectedApplication.id,
                    "Rejected"
                  )
                }
              >
                {actionLoading
                  ? "Updating..."
                  : "Reject"}
              </button>

              <button
                type="button"
                className="approve-button"
                disabled={actionLoading}
                onClick={() =>
                  updateStatus(
                    selectedApplication.id,
                    "Approved"
                  )
                }
              >
                {actionLoading
                  ? "Updating..."
                  : "Approve Application"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminApplications;