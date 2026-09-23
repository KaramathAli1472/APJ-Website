import { useState } from "react";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";
import cloudinaryConfig from "../../services/cloudinary/cloudinaryConfig";
import {
  createStudentAccount,
  logoutAdmin,
} from "../../services/auth/authService";

import "./Admission.css";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dob: "",
    schoolName: "",
    className: "",
    medium: "",
    email: "",
    mobile: "",
    whatsapp: "",
    address: "",
    studentPhoto: null,
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        studentPhoto: "Please select a valid image.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        studentPhoto:
          "Student photo must be less than 5 MB.",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      studentPhoto: file,
    }));

    setPhotoPreview(URL.createObjectURL(file));

    setErrors((previous) => ({
      ...previous,
      studentPhoto: "",
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName =
        "Student name is required.";
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName =
        "Father name is required.";
    }

    if (!formData.motherName.trim()) {
      newErrors.motherName =
        "Mother name is required.";
    }

    if (!formData.gender) {
      newErrors.gender =
        "Please select gender.";
    }

    if (!formData.dob) {
      newErrors.dob =
        "Date of birth is required.";
    }

    if (!formData.schoolName.trim()) {
      newErrors.schoolName =
        "School name is required.";
    }

    if (!formData.className) {
      newErrors.className =
        "Please select class.";
    }

    if (!formData.medium) {
      newErrors.medium =
        "Please select medium.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile =
        "Mobile number must contain 10 digits.";
    }

    if (!/^\d{10}$/.test(formData.whatsapp)) {
      newErrors.whatsapp =
        "WhatsApp number must contain 10 digits.";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required.";
    }

    if (!formData.studentPhoto) {
      newErrors.studentPhoto =
        "Student photo is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const uploadStudentPhoto = async (file) => {
    if (
      !cloudinaryConfig.cloudName ||
      !cloudinaryConfig.uploadPreset
    ) {
      throw new Error(
        "Cloudinary configuration is missing."
      );
    }

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

    if (!response.ok || !data.secure_url) {
      throw new Error(
        data?.error?.message ||
          "Student photo upload failed."
      );
    }

    return data.secure_url;
  };

  /*
   * Create a unique student registration ID.
   *
   * Firestore generates a unique document ID first.
   * That document ID is then used to create the
   * student's Registration ID.
   *
   * Example:
   * APJ-2026-DZW8
   */
  const createRegistrationId = (firestoreDocumentId) => {
    const currentYear = new Date().getFullYear();
    const shortDocumentId = firestoreDocumentId
      .slice(0, 4)
      .toUpperCase();

    return `APJ-${currentYear}-${shortDocumentId}`;
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      fatherName: "",
      motherName: "",
      gender: "",
      dob: "",
      schoolName: "",
      className: "",
      medium: "",
      email: "",
      mobile: "",
      whatsapp: "",
      address: "",
      studentPhoto: null,
    });

    setPhotoPreview("");
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(false);
    setSubmitError("");
    setRegistrationId("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Upload student photo to Cloudinary.
       */

      const studentPhotoUrl =
        await uploadStudentPhoto(
          formData.studentPhoto
        );

      /*
       * STEP 2
       * Create a new Firestore document reference.
       *
       * Firestore generates a unique document ID
       * before the document is actually saved.
       */

      const registrationRef = doc(
        collection(db, "registrations")
      );

      /*
       * STEP 3
       * Create the student's unique Registration ID
       * using the unique Firestore document ID.
       */

      const generatedRegistrationId =
        createRegistrationId(
          registrationRef.id
        );

      const studentUser =
        await createStudentAccount(
          generatedRegistrationId,
          formData.dob
        );

      /*
       * STEP 4
       * Prepare registration data.
       */

      const registrationData = {
        registrationId:
          generatedRegistrationId,

        studentUid:
          studentUser.uid,

        studentName:
          formData.studentName.trim(),

        fatherName:
          formData.fatherName.trim(),

        motherName:
          formData.motherName.trim(),

        gender:
          formData.gender,

        dob:
          formData.dob,

        schoolName:
          formData.schoolName.trim(),

        className:
          formData.className,

        medium:
          formData.medium,

        email:
          formData.email.trim(),

        mobile:
          formData.mobile.trim(),

        whatsapp:
          formData.whatsapp.trim(),

        address:
          formData.address.trim(),

        studentPhotoUrl:
          studentPhotoUrl,

        /*
         * Payment is not completed at the initial
         * registration stage, but the field is needed
         * to satisfy the Firestore rules and downstream
         * admin workflows.
         */

        transactionNumber:
          "",

        paymentStatus:
          "Pending",

        /*
         * Registration approval is also pending
         * until admin checks the details.
         */

        approvalStatus:
          "Pending",

        /*
         * ID card will NOT be generated at submission.
         */

        idCardStatus:
          "Not Generated",

        idCardUrl:
          "",

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      /*
       * STEP 5
       * Save the registration using the generated
       * Firestore document reference.
       */

      await setDoc(
        registrationRef,
        registrationData
      );

      await setDoc(
        doc(db, "studentProfiles", studentUser.uid),
        {
          registrationId:
            generatedRegistrationId,
          registrationDocId:
            registrationRef.id,
          studentUid:
            studentUser.uid,
          createdAt:
            serverTimestamp(),
        }
      );

      await logoutAdmin();

      /*
       * STEP 6
       * Registration successfully saved.
       */

      setRegistrationId(
        generatedRegistrationId
      );

      setSubmitted(true);

      resetForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error(
        "Registration submission error:",
        error
      );

      setSubmitError(
        error?.message ||
          "Unable to submit registration. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">

      {/* HERO */}

      <section className="registration-hero">

        <div className="registration-container">

          <span className="registration-label">
            APJ EDU
          </span>

          <h1>
            Student Registration
          </h1>

          <p>
            Register your student details with
            APJ Abdul Kalam Welfare Society.
          </p>

        </div>

      </section>

      {/* FORM SECTION */}

      <section className="registration-section">

        <div className="registration-container">

          <div className="registration-heading">

            <span>
              REGISTRATION FORM
            </span>

            <h2>
              Student Registration Form
            </h2>

            <p>
              Please enter the student's information
              carefully. All required fields must be
              completed before submission.
            </p>

          </div>

          {/* SUCCESS MESSAGE */}

          {submitted && (
            <div className="registration-success">

              <strong>
                Registration Submitted Successfully
              </strong>

              <span>
                Your registration has been received
                and is currently pending review.
              </span>

              {registrationId && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "18px",
                    borderRadius: "12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                  }}
                >

                  <div
                    style={{
                      marginBottom: "8px",
                      color: "#166534",
                      fontSize: "12px",
                      fontWeight: "700",
                      letterSpacing: "0.8px",
                    }}
                  >
                    YOUR REGISTRATION ID
                  </div>

                  <div
                    style={{
                      color: "#0f2747",
                      fontSize: "22px",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      wordBreak: "break-all",
                    }}
                  >
                    {registrationId}
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      color: "#526174",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    Please save this Registration ID.
                    You will need it to check your
                    registration status and download
                    your Student ID Card after approval.
                  </div>

                  <a
                    href="/student/login"
                    style={{
                      display: "inline-block",
                      marginTop: "12px",
                      color: "#2563eb",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    Student Login
                  </a>

                </div>
              )}

              <span
                style={{
                  marginTop: "12px",
                }}
              >
                Your Student ID Card will be generated
                after your registration details are
                verified and approved by the administration.
              </span>

            </div>
          )}

          {/* ERROR MESSAGE */}

          {submitError && (
            <div
              style={{
                marginBottom: "24px",
                padding: "16px 18px",
                borderRadius: "12px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >

              <strong>
                Registration could not be submitted.
              </strong>

              <div>
                {submitError}
              </div>

            </div>
          )}

          <form
            className="registration-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* 01 */}

            <div className="form-section-title">

              <span>
                01
              </span>

              <div>

                <h3>
                  Student Information
                </h3>

                <p>
                  Enter the student's basic details.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="studentName">
                  Student Name
                  <span>*</span>
                </label>

                <input
                  id="studentName"
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                />

                {errors.studentName && (
                  <small>
                    {errors.studentName}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="fatherName">
                  Father Name
                  <span>*</span>
                </label>

                <input
                  id="fatherName"
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father name"
                />

                {errors.fatherName && (
                  <small>
                    {errors.fatherName}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="motherName">
                  Mother Name
                  <span>*</span>
                </label>

                <input
                  id="motherName"
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="Enter mother name"
                />

                {errors.motherName && (
                  <small>
                    {errors.motherName}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="gender">
                  Gender
                  <span>*</span>
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                {errors.gender && (
                  <small>
                    {errors.gender}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="dob">
                  D.O.B
                  <span>*</span>
                </label>

                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />

                {errors.dob && (
                  <small>
                    {errors.dob}
                  </small>
                )}

              </div>

            </div>

            {/* 02 */}

            <div className="form-section-title">

              <span>
                02
              </span>

              <div>

                <h3>
                  School & Academic Details
                </h3>

                <p>
                  Enter the student's current
                  educational information.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group form-full">

                <label htmlFor="schoolName">
                  School Name
                  <span>*</span>
                </label>

                <input
                  id="schoolName"
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                />

                {errors.schoolName && (
                  <small>
                    {errors.schoolName}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="className">
                  Class
                  <span>*</span>
                </label>

                <select
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                >

                  <option value="">
                    Select class
                  </option>

                  <option value="Class 4">
                    Class 4
                  </option>

                  <option value="Class 5">
                    Class 5
                  </option>

                  <option value="Class 6">
                    Class 6
                  </option>

                  <option value="Class 7">
                    Class 7
                  </option>

                  <option value="Class 8">
                    Class 8
                  </option>

                  <option value="Class 9">
                    Class 9
                  </option>

                  <option value="Class 10">
                    Class 10
                  </option>

                  <option value="Class 11">
                    Class 11
                  </option>

                  <option value="Class 12">
                    Class 12
                  </option>

                </select>

                {errors.className && (
                  <small>
                    {errors.className}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="medium">
                  Medium
                  <span>*</span>
                </label>

                <select
                  id="medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                >

                  <option value="">
                    Select medium
                  </option>

                  <option value="English">
                    English
                  </option>

                  <option value="Telugu">
                    Telugu
                  </option>

                  <option value="Urdu">
                    Urdu
                  </option>

                </select>

                {errors.medium && (
                  <small>
                    {errors.medium}
                  </small>
                )}

              </div>

            </div>

            {/* 03 */}

            <div className="form-section-title">

              <span>
                03
              </span>

              <div>

                <h3>
                  Contact Information
                </h3>

                <p>
                  Provide valid contact details.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label htmlFor="email">

                  Email

                  <span className="optional">
                    Optional
                  </span>

                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

                {errors.email && (
                  <small>
                    {errors.email}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="mobile">
                  Mobile Number
                  <span>*</span>
                </label>

                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  inputMode="numeric"
                  maxLength="10"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                />

                {errors.mobile && (
                  <small>
                    {errors.mobile}
                  </small>
                )}

              </div>

              <div className="form-group">

                <label htmlFor="whatsapp">
                  WhatsApp Number
                  <span>*</span>
                </label>

                <input
                  id="whatsapp"
                  type="tel"
                  name="whatsapp"
                  inputMode="numeric"
                  maxLength="10"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="10 digit WhatsApp number"
                />

                {errors.whatsapp && (
                  <small>
                    {errors.whatsapp}
                  </small>
                )}

              </div>

              <div className="form-group form-full">

                <label htmlFor="address">
                  Address
                  <span>*</span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows="4"
                />

                {errors.address && (
                  <small>
                    {errors.address}
                  </small>
                )}

              </div>

            </div>

            {/* 04 */}

            <div className="form-section-title">

              <span>
                04
              </span>

              <div>

                <h3>
                  Student Photo
                </h3>

                <p>
                  Upload a clear recent photograph.
                </p>

              </div>

            </div>

            <div className="photo-upload-area">

              <div className="photo-preview">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Student preview"
                  />
                ) : (
                  <div className="photo-placeholder">

                    <span>
                      📷
                    </span>

                    <p>
                      Student Photo
                    </p>

                  </div>
                )}

              </div>

              <div className="photo-upload-content">

                <label
                  htmlFor="studentPhoto"
                  className="upload-button"
                >
                  Choose Photo
                </label>

                <input
                  id="studentPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />

                <p>
                  JPG, JPEG or PNG • Maximum 5 MB
                </p>

                {errors.studentPhoto && (
                  <small>
                    {errors.studentPhoto}
                  </small>
                )}

              </div>

            </div>

            {/* SUBMIT */}

            <div className="registration-submit">

              <p>
                By submitting this form, you confirm
                that the information provided is correct.
              </p>

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Submitting Registration..."
                  : "Submit Registration →"}

              </button>

            </div>

          </form>

        </div>

      </section>

    </div>
  );
}

export default Admission;