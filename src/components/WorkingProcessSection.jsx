import React from "react";

const processSteps = [
  {
    number: "01",
    title: "Cuéntanos qué necesitas",
    copy: "Compártenos tu proyecto por WhatsApp o formulario y cuéntanos qué tipo de trabajo necesitas.",
  },
  {
    number: "02",
    title: "Revisamos tu proyecto",
    copy: "Analizamos tu necesidad y el tipo de trabajo para entender mejor cómo ayudarte.",
  },
  {
    number: "03",
    title: "Definimos la mejor forma de avanzar",
    copy: "Según el proyecto, avanzamos con información inicial, visita o propuesta.",
  },
  {
    number: "04",
    title: "Te presentamos una propuesta clara",
    copy: "Te orientamos con una propuesta enfocada en lo que tu espacio necesita.",
  },
  {
    number: "05",
    title: "Ejecutamos y damos seguimiento",
    copy: "Realizamos el trabajo cuidando el proceso, la atención y el resultado final.",
  },
];

const commonQuestions = [
  "Qué sigue después del primer contacto",
  "Si primero revisamos tu necesidad",
  "Si hacemos visita según el tipo de trabajo",
  "Cómo empezamos el proceso",
];

function WorkingProcessSection() {
  return (
    <section className="section process-section" id="asi-trabajamos">
      <div className="container">
        <div className="about-heading process-heading reveal">
          <div className="about-heading-title">
            <h2>Así trabajamos</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Te mostramos cómo avanzamos</span> para que tengas más
            claridad desde el inicio.
          </p>
        </div>

        <div className="process-intro-layout">
          <div className="section-copy process-intro-copy reveal">
            <p>
              Sabemos que al iniciar un proyecto pueden surgir dudas sobre cómo
              empieza el proceso, qué sigue o cuál es la mejor forma de avanzar.
              Por eso buscamos darte claridad desde el primer contacto.
            </p>
          </div>

          <aside className="process-friction-card reveal">
            <strong>Dudas comunes al iniciar un proyecto:</strong>
            <ul>
              {commonQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="process-grid">
          {processSteps.map(({ copy, number, title }) => (
            <article className="process-step reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(WorkingProcessSection);
