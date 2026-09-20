import { useState } from "react";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import faqData from "../../data/faq/faqData";

import "./FAQ.css";

function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId((currentId) =>
      currentId === id ? null : id
    );
  };

  return (
    <div className="faq-page">

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-container">

          <span className="faq-hero-badge">
            APJ EDU
          </span>

          <h1>Frequently Asked Questions</h1>

          <p>
            Find answers to common questions about
            APJ EDU, academics and admissions.
          </p>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">

          <SectionTitle
            eyebrow="Help Center"
            title="How Can We Help?"
            description="Find quick answers to some of the most common questions asked by students and parents."
          />

          <div className="faq-layout">

            {/* Left Info */}
            <div className="faq-intro">

              <div className="faq-intro-icon">
                ?
              </div>

              <span>
                Need Help?
              </span>

              <h2>
                Have a Question?
              </h2>

              <p>
                Browse the questions below to find
                useful information. If you cannot find
                what you are looking for, please contact
                us directly.
              </p>

              <a
                href="/contact"
                className="faq-contact-button"
              >
                Contact Us
                <span>→</span>
              </a>

            </div>

            {/* Questions */}
            <div className="faq-list">

              {faqData.map((faq, index) => {
                const isOpen = openId === faq.id;

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "open" : ""
                    }`}
                    key={faq.id}
                  >

                    <button
                      type="button"
                      className="faq-question"
                      onClick={() =>
                        toggleFAQ(faq.id)
                      }
                      aria-expanded={isOpen}
                    >

                      <span className="faq-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="faq-question-text">
                        {faq.question}
                      </span>

                      <span className="faq-toggle">
                        {isOpen ? "−" : "+"}
                      </span>

                    </button>

                    <div
                      className={`faq-answer ${
                        isOpen ? "show" : ""
                      }`}
                    >
                      <p>
                        {faq.answer}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="faq-bottom">
        <div className="faq-container">

          <div className="faq-bottom-content">

            <span>
              APJ EDU
            </span>

            <h2>
              Still Have Questions?
            </h2>

            <p>
              Our team is here to help you with
              additional information and guidance.
            </p>

          </div>

          <a
            href="/contact"
            className="faq-bottom-button"
          >
            Get in Touch
            <span>→</span>
          </a>

        </div>
      </section>

    </div>
  );
}

export default FAQ;