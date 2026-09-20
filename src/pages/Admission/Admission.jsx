import { useState } from "react";
import "./Admission.css";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

function Admission() {
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    className: "",
    schoolName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove old messages when user starts editing again.
    if (successMessage) {
      setSuccessMessage("");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const studentName = formData.studentName.trim();
    const fatherName = formData.fatherName.trim();
    const schoolName = formData.schoolName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    // Required field validation
    if (
      !studentName ||
      !fatherName ||
      !formData.className ||
      !phone
    ) {
      setErrorMessage(
        "Please fill in all required fields."
      );
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setErrorMessage(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    // Email validation only when entered
    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setErrorMessage(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "applications"), {
        // Student details
        studentName: studentName,
        name: studentName,

        // Parent details
        fatherName: fatherName,

        // Academic details
        className: formData.className,
        class: `Class ${formData.className}`,

        schoolName: schoolName,
        school: schoolName,

        // Contact details
        phone: cleanPhone,
        whatsapp: cleanPhone,
        email: email,

        // Enquiry
        message: message,

        // Admin status
        status: "Pending",

        // Firebase server timestamp
        createdAt: serverTimestamp(),
      });

      setSuccessMessage(
        "Your admission enquiry has been submitted successfully. Our administration team will contact you soon."
      );

      // Clear form after successful submission
      setFormData({
        studentName: "",
        fatherName: "",
        className: "",
        schoolName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Admission enquiry submission error:",
        error
      );

      setErrorMessage(
        "Unable to submit your enquiry right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-page">

      {/* Hero */}
      <section className="admission-hero">
        <div className="admission-container">
          <span className="admission-hero-label">
            ADMISSIONS
          </span>

          <h1>
            Start Your
            <span> Educational Journey</span>
          </h1>

          <p>
            Explore the admission process and submit your
            enquiry to APJ EDU.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="admission-process">
        <div className="admission-container">

          <div className="admission-heading">
            <span className="admission-section-label">
              HOW IT WORKS
            </span>

            <h2>
              Simple Admission Process
            </h2>

            <p>
              Follow these simple steps to begin your
              admission journey.
            </p>
          </div>

          <div className="admission-steps">

            <div className="admission-step">
              <div className="step-number">01</div>

              <div className="step-icon">📝</div>

              <h3>
                Submit Enquiry
              </h3>

              <p>
                Fill in the admission enquiry form with
                the student's basic information.
              </p>
            </div>

            <div className="admission-step">
              <div className="step-number">02</div>

              <div className="step-icon">📞</div>

              <h3>
                Get Information
              </h3>

              <p>
                Our team can provide the required
                admission information and guidance.
              </p>
            </div>

            <div className="admission-step">
              <div className="step-number">03</div>

              <div className="step-icon">🎓</div>

              <h3>
                Begin Learning
              </h3>

              <p>
                Complete the required process and
                begin your educational journey.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Application */}
      <section className="admission-application">
        <div className="admission-container admission-application-grid">

          <div className="admission-info">

            <span className="admission-section-label">
              ADMISSION ENQUIRY
            </span>

            <h2>
              Tell Us About the Student
            </h2>

            <p>
              Submit your details through the form. The
              information can be used by the administration
              team to respond to your admission enquiry.
            </p>

            <div className="admission-info-list">

              <div className="admission-info-item">
                <span>✓</span>

                <div>
                  <strong>
                    Student Information
                  </strong>

                  <p>
                    Provide the student's basic details.
                  </p>
                </div>
              </div>

              <div className="admission-info-item">
                <span>✓</span>

                <div>
                  <strong>
                    Academic Details
                  </strong>

                  <p>
                    Select the class and provide school
                    information.
                  </p>
                </div>
              </div>

              <div className="admission-info-item">
                <span>✓</span>

                <div>
                  <strong>
                    Contact Details
                  </strong>

                  <p>
                    Provide a phone number or email for
                    communication.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="admission-form-card">

            <div className="admission-form-header">
              <span>
                APPLICATION FORM
              </span>

              <h3>
                Admission Enquiry
              </h3>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#ecfdf3",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                ✓ {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                ⚠ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="admission-form-row">

                <div className="admission-form-group">
                  <label htmlFor="studentName">
                    Student Name
                  </label>

                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="fatherName">
                    Father's Name
                  </label>

                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

              </div>

              <div className="admission-form-row">

                <div className="admission-form-group">
                  <label htmlFor="className">
                    Class
                  </label>

                  <select
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">
                      Select class
                    </option>

                    <option value="4">
                      Class 4
                    </option>

                    <option value="5">
                      Class 5
                    </option>

                    <option value="6">
                      Class 6
                    </option>

                    <option value="7">
                      Class 7
                    </option>

                    <option value="8">
                      Class 8
                    </option>

                    <option value="9">
                      Class 9
                    </option>

                    <option value="10">
                      Class 10
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>
                  </select>
                </div>

                <div className="admission-form-group">
                  <label htmlFor="schoolName">
                    School Name
                  </label>

                  <input
                    id="schoolName"
                    name="schoolName"
                    type="text"
                    placeholder="Enter school name"
                    value={formData.schoolName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

              </div>

              <div className="admission-form-row">

                <div className="admission-form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="admission-form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

              </div>

              <div className="admission-form-group">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your enquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="submit"
                className="admission-submit-button"
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Enquiry →"}
              </button>

            </form>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="admission-bottom">
        <div className="admission-container">

          <div>
            <span>
              NEED MORE INFORMATION?
            </span>

            <h2>
              Have Questions About Admission?
            </h2>

            <p>
              Visit our FAQ or contact us for more
              information.
            </p>
          </div>

          <div className="admission-bottom-buttons">

            <a
              href="tel:+918500212306"
              className="admission-call-button"
            >
              Call Us
            </a>

            <a
              href="mailto:apjedu2001@gmail.com"
              className="admission-email-button"
            >
              Email Us
            </a>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Admission;