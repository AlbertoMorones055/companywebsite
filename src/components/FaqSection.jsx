import React from "react";

function FaqSection({ faqs, openFaq, setOpenFaq }) {
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-layout">
        <div className="about-heading faq-heading reveal">
          <div className="about-heading-title">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Información rápida</span> para facilitar el primer contacto.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article
              key={question}
              className={`faq-item reveal${openFaq === index ? " is-open" : ""}`}
            >
              <button
                className="faq-question"
                type="button"
                aria-expanded={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{question}</span>
                <span className="faq-plus" aria-hidden="true"></span>
              </button>
              <div className="faq-answer">
                <p>{answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(FaqSection);
