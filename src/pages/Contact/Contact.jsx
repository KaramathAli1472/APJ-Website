import { useState } from "react";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SOCIETY_NAME,
  SOCIETY_LOCATION,
} from "../../utils/constants/appConstants";

import {
  isRequired,
  isValidEmail,
  isValidPhone,
} from "../../utils/validation/formValidation";

import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isRequired(formData.name)) {
      newErrors.name = "Please enter your name.";
    }

    if (!isRequired(formData.email)) {
      newErrors.email = "Please enter your email.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!isRequired(formData.phone)) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number.";
    }

    if (!isRequired(formData.subject)) {
      newErrors.subject =
        "Please enter a subject.";
    }

    if (!isRequired(formData.message)) {
      newErrors.message =
        "Please enter your message.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(
      "Contact form submitted:",
      formData
    );

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-container">

          <span className="contact-hero-badge">
            APJ EDU
          </span>

          <h1>Contact Us</h1>

          <p>
            Have a question or need more information?
            We would be happy to hear from you.
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">

          <SectionTitle
            eyebrow="Get In Touch"
            title="We Are Here to Help"
            description="Reach out to APJ Abdul Kalam Welfare Society for information, enquiries and assistance."
          />

          <div className="contact-layout">

            {/* Contact Information */}
            <div className="contact-info">

              <div className="contact-info-heading">
                <span>
                  Contact Information
                </span>

                <h2>
                  Let's Start a Conversation
                </h2>

                <p>
                  For registration enquiries, academic
                  information or general questions,
                  you can contact us through the
                  details below.
                </p>
              </div>

              <div className="contact-details">

                <div className="contact-detail-item">

                  <div className="contact-detail-icon">
                    📍
                  </div>

                  <div>
                    <span>
                      Address
                    </span>

                    <p>
                      {SOCIETY_NAME}
                      <br />
                      {SOCIETY_LOCATION}
                    </p>
                  </div>

                </div>

                <div className="contact-detail-item">

                  <div className="contact-detail-icon">
                    📞
                  </div>

                  <div>
                    <span>
                      Phone
                    </span>

                    <a
                      href={`tel:${CONTACT_PHONE.replace(
                        /\s+/g,
                        ""
                      )}`}
                    >
                      {CONTACT_PHONE}
                    </a>
                  </div>

                </div>

                <div className="contact-detail-item">

                  <div className="contact-detail-icon">
                    ✉️
                  </div>

                  <div>
                    <span>
                      Email
                    </span>

                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>

                </div>

              </div>

              <div className="contact-note">
                <strong>
                  Office Hours
                </strong>

                <p>
                  Monday – Saturday
                  <br />
                  9:00 AM – 8:00 PM
                </p>
              </div>

            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">

              <div className="contact-form-heading">

                <span>
                  Send Us a Message
                </span>

                <h2>
                  How Can We Help?
                </h2>

              </div>

              {submitted && (
                <div className="contact-success">
                  Thank you! Your message has been
                  submitted successfully.
                </div>
              )}

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                <div className="contact-form-row">

                  <div className="contact-field">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />

                    {errors.name && (
                      <small>
                        {errors.name}
                      </small>
                    )}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />

                    {errors.email && (
                      <small>
                        {errors.email}
                      </small>
                    )}
                  </div>

                </div>

                <div className="contact-form-row">

                  <div className="contact-field">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                    />

                    {errors.phone && (
                      <small>
                        {errors.phone}
                      </small>
                    )}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="subject">
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                    />

                    {errors.subject && (
                      <small>
                        {errors.subject}
                      </small>
                    )}
                  </div>

                </div>

                <div className="contact-field">

                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                  />

                  {errors.message && (
                    <small>
                      {errors.message}
                    </small>
                  )}

                </div>

                <button
                  type="submit"
                  className="contact-submit"
                >
                  Send Message
                  <span>→</span>
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="contact-bottom">
        <div className="contact-container">

          <div>
            <span>
              APJ EDU
            </span>

            <h2>
              We Would Love to Hear From You
            </h2>

            <p>
              Contact us for more information about
              APJ EDU and the services provided by
              APJ Abdul Kalam Welfare Society.
            </p>
          </div>

          <a
            href={`tel:${CONTACT_PHONE.replace(
              /\s+/g,
              ""
            )}`}
            className="contact-bottom-button"
          >
            Call Us
            <span>→</span>
          </a>

        </div>
      </section>

    </div>
  );
}

export default Contact;