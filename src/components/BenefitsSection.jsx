import React from "react";

const reasons = [
  "Más de 17 años de experiencia.",
  "Atención a proyectos residenciales y comerciales.",
  "Un solo equipo para varias necesidades.",
  "Comunicación clara desde el inicio.",
  "Orden y profesionalismo en cada etapa.",
  "Enfoque en funcionalidad, imagen y resultado.",
];

function BenefitsSection() {
  return (
    <section className="section benefits section-soft" id="por-que-elegirnos">
      <div className="container">
        <div className="about-heading benefits-heading reveal">
          <div className="about-heading-title">
            <h2>¿Por qué elegir Servicios Falcón?</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Orden, claridad y buen resultado.</span>
          </p>
        </div>

        <div className="benefits-layout">
          <article className="benefits-card reveal">
            <ul className="benefits-list" aria-label="Razones para elegirnos">
              {reasons.map((reason) => (
                <li key={reason} className="benefit-item">
                  <strong>{reason}</strong>
                </li>
              ))}
            </ul>
          </article>

          <aside className="process-card reveal">
            <p className="eyebrow">ASÍ APORTAMOS VALOR</p>
            <h3>
              Una forma de trabajo pensada para dar más confianza desde la
              cotización hasta la ejecución.
            </h3>
            <ol>
              <li>
                <span>01</span>
                Buscamos entender el espacio, el objetivo y la mejor forma de
                resolverlo.{" "}
              </li>
              <li>
                <span>02</span>
                No solo mejoramos cómo se ve el espacio, también cómo
                funciona{" "}
              </li>
              <li>
                <span>03</span>
                Desde la cotización hasta la realización del trabajo, mantenemos
                atención y comunicación directa.{" "}
              </li>
            </ol>
          </aside>
        </div>

        <p className="benefits-closing-note reveal">
          Elegir bien a quién confiarle un proyecto también significa elegir
          experiencia, orden y seguimiento.
        </p>
      </div>
    </section>
  );
}

export default React.memo(BenefitsSection);
