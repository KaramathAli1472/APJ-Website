import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import societyLogo from "../../assets/logo/logo.png.jpeg";

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

import "./AdminRegistrations.css";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedRegistration, setSelectedRegistration] =
    useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  // ID CARD STATES
  const [showIdCard, setShowIdCard] = useState(false);
  const [idCardStudent, setIdCardStudent] = useState(null);

  // ============================================================
  // LOAD REGISTRATIONS
  // ============================================================

  useEffect(() => {
    const registrationsQuery = query(
      collection(db, "registrations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      registrationsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setRegistrations(data);
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        console.error(
          "Registrations loading error:",
          snapshotError
        );

        setError(
          snapshotError?.message ||
            "Unable to load registrations."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const getShortRegistrationId = (registrationId) => {
    const value = String(registrationId || "");

    return value.length > 13
      ? value.slice(0, 13)
      : value || "—";
  };

  const getDate = (timestamp) => {
    if (!timestamp) {
      return "—";
    }

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    }

    return new Date(timestamp).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredRegistrations = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return registrations.filter((item) => {
      const matchesSearch =
        !searchValue ||
        String(
          item.registrationId || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          item.studentName || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          item.fatherName || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          item.schoolName || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          item.mobile || ""
        )
          .toLowerCase()
          .includes(searchValue);
      const matchesStatus =
        statusFilter === "All" ||
        item.approvalStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    registrations,
    search,
    statusFilter,
  ]);

  // ============================================================
  // STATS
  // ============================================================

  const totalCount = registrations.length;

  const pendingCount = registrations.filter(
    (item) =>
      !item.approvalStatus ||
      item.approvalStatus === "Pending"
  ).length;

  const approvedCount = registrations.filter(
    (item) =>
      item.approvalStatus === "Approved"
  ).length;

  const rejectedCount = registrations.filter(
    (item) =>
      item.approvalStatus === "Rejected"
  ).length;

  // ============================================================
  // APPROVAL STATUS
  // ============================================================

  const updateApprovalStatus = async (
    registration,
    status
  ) => {
    try {
      setActionLoading(true);

      const updateData = {
        approvalStatus: status,
        updatedAt: new Date(),
      };

      // If registration is rejected,
      // ID card must not remain generated.
      if (status !== "Approved") {
        updateData.idCardStatus =
          "Not Generated";

        updateData.idCardUrl = "";

        updateData.idCardGeneratedAt = null;
      }

      await updateDoc(
        doc(
          db,
          "registrations",
          registration.id
        ),
        updateData
      );

      setSelectedRegistration(
        (previous) =>
          previous
            ? {
                ...previous,
                ...updateData,
              }
            : previous
      );

      // If rejected, close ID card preview
      if (status !== "Approved") {
        setShowIdCard(false);
        setIdCardStudent(null);
      }
    } catch (error) {
      console.error(
        "Approval status update error:",
        error
      );

      alert(
        error?.message ||
          "Unable to update registration status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // DELETE REGISTRATION
  // ============================================================

  const deleteRegistration = async (
    registration
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the registration of ${
        registration.studentName ||
        "this student"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteDoc(
        doc(
          db,
          "registrations",
          registration.id
        )
      );

      setSelectedRegistration(null);
    } catch (error) {
      console.error(
        "Registration delete error:",
        error
      );

      alert(
        error?.message ||
          "Unable to delete registration."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // GENERATE ID CARD
  // ============================================================

  const generateIdCard = async (
    registration
  ) => {
    if (
      registration.approvalStatus !==
      "Approved"
    ) {
      alert(
        "Registration must be approved before generating the ID card."
      );
      return;
    }

    try {
      setActionLoading(true);

      const generatedAt = new Date();

      const updateData = {
        idCardStatus: "Generated",
        idCardGeneratedAt: generatedAt,
        updatedAt: generatedAt,
      };

      await updateDoc(
        doc(
          db,
          "registrations",
          registration.id
        ),
        updateData
      );

      const updatedRegistration = {
        ...registration,
        ...updateData,
      };

      setSelectedRegistration(
        updatedRegistration
      );

      setIdCardStudent(
        updatedRegistration
      );

      setShowIdCard(true);
    } catch (error) {
      console.error(
        "ID card generation error:",
        error
      );

      alert(
        error?.message ||
          "Unable to generate ID card."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // OPEN ID CARD
  // ============================================================

  const openIdCard = (registration) => {
    if (
      registration.idCardStatus !==
      "Generated"
    ) {
      alert(
        "Please generate the ID card first."
      );
      return;
    }

    setIdCardStudent(registration);
    setShowIdCard(true);
  };

  // ============================================================
  // DOWNLOAD PNG
  // ============================================================

  const downloadIdCardPNG = async () => {
    const card =
      document.getElementById(
        "student-id-card"
      );

    if (!card) {
      alert("ID card not found.");
      return;
    }

    try {
      const canvas =
        await html2canvas(card, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });

      const image =
        canvas.toDataURL("image/png");

      const link =
        document.createElement("a");

      link.download = `${
        idCardStudent?.registrationId ||
        "student"
      }-ID-Card.png`;

      link.href = image;

      link.click();
    } catch (error) {
      console.error(
        "PNG download error:",
        error
      );

      alert(
        "Unable to download ID card as PNG."
      );
    }
  };

  // ============================================================
  // DOWNLOAD PDF
  // ============================================================

  const downloadIdCardPDF = async () => {
    const card =
      document.getElementById(
        "student-id-card"
      );

    if (!card) {
      alert("ID card not found.");
      return;
    }

    try {
      const canvas =
        await html2canvas(card, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        });

      const image =
        canvas.toDataURL("image/png");

      const pdf =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 15;

      const cardWidth =
        pageWidth - margin * 2;

      const cardHeight =
        (canvas.height *
          cardWidth) /
        canvas.width;

      let y =
        (pageHeight -
          cardHeight) /
        2;

      if (y < margin) {
        y = margin;
      }

      pdf.addImage(
        image,
        "PNG",
        margin,
        y,
        cardWidth,
        cardHeight
      );

      pdf.save(
        `${
          idCardStudent?.registrationId ||
          "student"
        }-ID-Card.pdf`
      );
    } catch (error) {
      console.error(
        "PDF download error:",
        error
      );

      alert(
        "Unable to download ID card as PDF."
      );
    }
  };

  // ============================================================
  // PRINT ID CARD
  // ============================================================

  const printIdCard = () => {
    const card =
      document.getElementById(
        "student-id-card"
      );

    if (!card) {
      alert("ID card not found.");
      return;
    }

    const printWindow =
      window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Please allow popups to print the ID card."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>
            Student ID Card
          </title>

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              background: white;
              font-family: Arial, sans-serif;
            }

            .print-wrapper {
              display: flex;
              justify-content: center;
            }

            @media print {

              body {
                padding: 0;
              }

              .student-id-card {
                box-shadow: none !important;
              }

            }

          </style>

        </head>

        <body>

          <div class="print-wrapper">

            ${card.outerHTML}

          </div>

          <script>

            window.onload = function() {

              window.print();

              window.onafterprint =
                function() {
                  window.close();
                };

            };

          <\/script>

        </body>

      </html>
    `);

    printWindow.document.close();
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="admin-registrations">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-page-label">
            STUDENT MANAGEMENT
          </span>

          <h1>
            Student Registrations
          </h1>

          <p>
            Review and approve student registrations.
          </p>

        </div>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="registration-stats">

        <div className="registration-stat-card">

          <div className="registration-stat-icon">
            #
          </div>

          <div>

            <span>
              Total Registrations
            </span>

            <strong>
              {loading
                ? "..."
                : totalCount}
            </strong>

          </div>

        </div>

        <div className="registration-stat-card">

          <div className="registration-stat-icon pending">
            !
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {loading
                ? "..."
                : pendingCount}
            </strong>

          </div>

        </div>

        <div className="registration-stat-card">

          <div className="registration-stat-icon approved">
            ✓
          </div>

          <div>

            <span>
              Approved
            </span>

            <strong>
              {loading
                ? "..."
                : approvedCount}
            </strong>

          </div>

        </div>

      </div>

      {/* ======================================================
          CONTENT CARD
      ====================================================== */}

      <div className="registrations-card">

        {/* TOOLBAR */}

        <div className="registrations-toolbar">

          <div className="registration-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search ID, student, school or mobile..."
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
              All Registrations
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

        {/* ERROR */}

        {error && (
          <div className="registration-error">

            <strong>
              Unable to load registrations
            </strong>

            <span>
              {error}
            </span>

          </div>
        )}

        {/* LOADING */}

        {loading ? (

          <div className="registration-loading">

            <div className="registration-spinner"></div>

            <p>
              Loading student registrations...
            </p>

          </div>

        ) : filteredRegistrations.length ===
          0 ? (

          <div className="registration-empty">

            <div className="registration-empty-icon">
              📋
            </div>

            <h3>
              No registrations found
            </h3>

            <p>
              Student registrations will appear
              here after students submit the form.
            </p>

          </div>

        ) : (

          <div className="registrations-table-wrapper">

            <table className="registrations-table">

              <thead>

                <tr>

                  <th>
                    Registration ID
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    School
                  </th>

                  <th>
                    Class
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredRegistrations.map(
                  (registration) => (

                    <tr
                      key={
                        registration.id
                      }
                    >

                      <td>

                        <div className="registration-id-cell">

                          <strong>
                            <span
                              title={
                                registration.registrationId ||
                                "—"
                              }
                            >
                              {getShortRegistrationId(
                                registration.registrationId
                              )}
                            </span>
                          </strong>

                          <small>
                            {registration.id}
                          </small>

                        </div>

                      </td>

                      <td>

                        <div className="student-table-cell">

                          {registration.studentPhotoUrl ? (

                            <img
                              src={
                                registration.studentPhotoUrl
                              }
                              alt={
                                registration.studentName ||
                                "Student"
                              }
                            />

                          ) : (

                            <div className="student-avatar">

                              {(
                                registration.studentName ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                          )}

                          <div>

                            <strong>
                              {registration.studentName ||
                                "—"}
                            </strong>

                            <span>
                              {registration.mobile ||
                                "—"}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {registration.schoolName ||
                          "—"}
                      </td>

                      <td>
                        {registration.className ||
                          "—"}
                      </td>

                      <td>

                        <span
                          className={`status-badge approval-${String(
                            registration.approvalStatus ||
                              "Pending"
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >

                          {registration.approvalStatus ||
                            "Pending"}

                        </span>

                      </td>

                      <td>
                        {getDate(
                          registration.createdAt
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          className="view-registration-button"
                          onClick={() =>
                            setSelectedRegistration(
                              registration
                            )
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================================
          DETAILS MODAL
      ====================================================== */}

      {selectedRegistration && (

        <div
          className="registration-modal-overlay"
          onClick={() =>
            setSelectedRegistration(
              null
            )
          }
        >

          <div
            className="registration-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="registration-modal-header">

              <div>

                <span>
                  STUDENT REGISTRATION
                </span>

                <h2>
                  Registration Details
                </h2>

              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedRegistration(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="registration-modal-body">

              {/* ==================================================
                  STUDENT PROFILE
              ================================================== */}

              <div className="registration-profile">

                {selectedRegistration.studentPhotoUrl ? (

                  <img
                    src={
                      selectedRegistration.studentPhotoUrl
                    }
                    alt={
                      selectedRegistration.studentName ||
                      "Student"
                    }
                  />

                ) : (

                  <div className="registration-profile-placeholder">

                    {(
                      selectedRegistration.studentName ||
                      "S"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                )}

                <div>

                  <h3>
                    {selectedRegistration.studentName ||
                      "—"}
                  </h3>

                  <span>
                    Registration ID
                  </span>

                  <strong>
                    {selectedRegistration.registrationId ||
                      "—"}
                  </strong>

                </div>

              </div>

              {/* ==================================================
                  PERSONAL
              ================================================== */}

              <div className="detail-section">

                <h4>
                  Personal Information
                </h4>

                <div className="detail-grid">

                  <div>

                    <span>
                      Father Name
                    </span>

                    <strong>
                      {selectedRegistration.fatherName ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Mother Name
                    </span>

                    <strong>
                      {selectedRegistration.motherName ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Gender
                    </span>

                    <strong>
                      {selectedRegistration.gender ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Date of Birth
                    </span>

                    <strong>
                      {selectedRegistration.dob ||
                        "—"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  ACADEMIC
              ================================================== */}

              <div className="detail-section">

                <h4>
                  Academic Information
                </h4>

                <div className="detail-grid">

                  <div>

                    <span>
                      School Name
                    </span>

                    <strong>
                      {selectedRegistration.schoolName ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Class
                    </span>

                    <strong>
                      {selectedRegistration.className ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Medium
                    </span>

                    <strong>
                      {selectedRegistration.medium ||
                        "—"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  CONTACT
              ================================================== */}

              <div className="detail-section">

                <h4>
                  Contact Information
                </h4>

                <div className="detail-grid">

                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedRegistration.email ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Mobile
                    </span>

                    <strong>
                      {selectedRegistration.mobile ||
                        "—"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      WhatsApp
                    </span>

                    <strong>
                      {selectedRegistration.whatsapp ||
                        "—"}
                    </strong>

                  </div>

                  <div className="detail-full">

                    <span>
                      Address
                    </span>

                    <strong>
                      {selectedRegistration.address ||
                        "—"}
                    </strong>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  APPROVAL
              ================================================== */}

              <div className="detail-section">

                <h4>
                  Registration Approval
                </h4>

                <div className="approval-box">

                  <div>

                    <span>
                      Current Status
                    </span>

                    <strong>
                      {selectedRegistration.approvalStatus ||
                        "Pending"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      ID Card
                    </span>

                    <strong>
                      {selectedRegistration.idCardStatus ||
                        "Not Generated"}
                    </strong>

                  </div>

                </div>

                <div className="approval-actions">

                  <button
                    type="button"
                    className="approve-button"
                    disabled={
                      actionLoading
                    }
                    onClick={() =>
                      updateApprovalStatus(
                        selectedRegistration,
                        "Approved"
                      )
                    }
                  >
                    ✓ Approve Registration
                  </button>

                  <button
                    type="button"
                    className="reject-button"
                    disabled={
                      actionLoading
                    }
                    onClick={() =>
                      updateApprovalStatus(
                        selectedRegistration,
                        "Rejected"
                      )
                    }
                  >
                    ✕ Reject Registration
                  </button>

                </div>

                {/* ==================================================
                    ID CARD SECTION
                ================================================== */}

                <div className="registration-detail-section">

                  <div className="registration-detail-section-header">

                    <div>

                      <span>
                        ID CARD
                      </span>

                      <h3>
                        Student ID Card
                      </h3>

                    </div>

                  </div>

                  <div className="registration-id-card-box">

                    <div>

                      <strong>
                        {selectedRegistration.idCardStatus ||
                          "Not Generated"}
                      </strong>

                      <p>
                        ID Card can only be generated after the
                        registration has been approved.
                      </p>

                    </div>

                    {selectedRegistration.idCardStatus ===
                    "Generated" ? (

                      <button
                        type="button"
                        className="admin-registration-primary-button"
                        onClick={() =>
                          openIdCard(selectedRegistration)
                        }
                      >
                        🎫 View ID Card
                      </button>

                    ) : selectedRegistration.approvalStatus ===
                        "Approved" ? (

                      <button
                        type="button"
                        className="admin-registration-primary-button"
                        disabled={actionLoading}
                        onClick={() =>
                          generateIdCard(selectedRegistration)
                        }
                      >
                        {actionLoading
                          ? "Generating..."
                          : "🎫 Generate ID Card"}
                      </button>

                    ) : (

                      <button
                        type="button"
                        className="admin-registration-disabled-button"
                        disabled
                      >
                        🔒 Generate ID Card
                      </button>

                    )}

                  </div>

                </div>

              </div>

              {/* ==================================================
                  DELETE
              ================================================== */}

              <div className="danger-zone">

                <div>

                  <strong>
                    Delete Registration
                  </strong>

                  <span>
                    This permanently removes this
                    student's registration record.
                  </span>

                </div>

                <button
                  type="button"
                  disabled={
                    actionLoading
                  }
                  onClick={() =>
                    deleteRegistration(
                      selectedRegistration
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          ID CARD MODAL
      ======================================================== */}

      {showIdCard &&
        idCardStudent && (

          <div
            className="id-card-modal-overlay"
            onClick={() =>
              setShowIdCard(false)
            }
          >

            <div
              className="id-card-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* ID CARD MODAL HEADER */}

              <div className="id-card-modal-header">

                <div>

                  <span>
                    STUDENT MANAGEMENT
                  </span>

                  <h2>
                    Student ID Card
                  </h2>

                </div>

                <button
                  type="button"
                  className="id-card-close"
                  onClick={() =>
                    setShowIdCard(false)
                  }
                >
                  ×
                </button>

              </div>

              {/* ==================================================
                  ACTUAL ID CARD
              ================================================== */}

              <div className="id-card-preview">

                <div
                  id="student-id-card"
                  className="student-id-card"
                >

                  {/* HEADER */}

                  <div className="id-card-header">

                    <img
                      src={societyLogo}
                      alt="APJ Abdul Kalam Welfare Society"
                      className="id-card-logo"
                    />

                    <div className="id-card-title">

                      <h1>
                        APJ ABDUL KALAM
                      </h1>

                      <h2>
                        WELFARE SOCIETY
                      </h2>

                      <p>
                        STUDENT ID CARD
                      </p>

                    </div>

                  </div>

                  {/* PHOTO */}

                  <div className="id-card-photo-section">

                    {idCardStudent.studentPhotoUrl ? (

                      <img
                        src={
                          idCardStudent.studentPhotoUrl
                        }
                        alt={
                          idCardStudent.studentName ||
                          "Student"
                        }
                        className="id-card-student-photo"
                        crossOrigin="anonymous"
                      />

                    ) : (

                      <div className="id-card-photo-placeholder">

                        {(
                          idCardStudent.studentName ||
                          "S"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                    )}

                  </div>

                  {/* NAME */}

                  <div className="id-card-student-name">

                    {idCardStudent.studentName ||
                      "STUDENT"}

                  </div>

                  {/* DETAILS */}

                  <div className="id-card-details">

                    <div className="id-detail-row">

                      <span>
                        Registration ID
                      </span>

                      <strong>
                        {idCardStudent.registrationId ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        Father Name
                      </span>

                      <strong>
                        {idCardStudent.fatherName ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        School
                      </span>

                      <strong>
                        {idCardStudent.schoolName ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        Class
                      </span>

                      <strong>
                        {idCardStudent.className ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        Medium
                      </span>

                      <strong>
                        {idCardStudent.medium ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        Date of Birth
                      </span>

                      <strong>
                        {idCardStudent.dob ||
                          "—"}
                      </strong>

                    </div>

                    <div className="id-detail-row">

                      <span>
                        Mobile
                      </span>

                      <strong>
                        {idCardStudent.mobile ||
                          "—"}
                      </strong>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="id-card-status">

                    <span>
                      ✓ ACTIVE STUDENT
                    </span>

                  </div>

                  {/* FOOTER */}

                  <div className="id-card-footer">

                    <span>
                      APJ Abdul Kalam Welfare Society
                    </span>

                    <span>
                      {idCardStudent.registrationId ||
                        "—"}
                    </span>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  ID CARD BUTTONS
              ================================================== */}

              <div className="id-card-actions">

                <button
                  type="button"
                  onClick={
                    downloadIdCardPDF
                  }
                  className="id-card-pdf-button"
                >
                  📄 Download PDF
                </button>

                <button
                  type="button"
                  onClick={
                    downloadIdCardPNG
                  }
                  className="id-card-png-button"
                >
                  🖼️ Download PNG
                </button>

                <button
                  type="button"
                  onClick={
                    printIdCard
                  }
                  className="id-card-print-button"
                >
                  🖨️ Print
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowIdCard(false)
                  }
                  className="id-card-cancel-button"
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

export default AdminRegistrations;