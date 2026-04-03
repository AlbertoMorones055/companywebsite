import React from "react";

const aboutImage = "/assets/projects/nostros.webp";
const aboutMobileImage = aboutImage.replace(/\.webp$/i, "-mobile.webp");

const aboutFeatures = [
  {
    title: "Experiencia comprobada",
    copy: "Más de 17 años resolviendo proyectos residenciales y comerciales.",
    icon: "/assets/projects/estrella.png",
  },
  {
    title: "Trabajo profesional",
    copy: "Planeación, orden y atención al detalle en cada etapa.",
    icon: "/assets/projects/escudo.png",
  },
  {
    title: "Compromiso y confianza",
    copy: "Acompañamiento cercano desde la cotización hasta la entrega.",
    icon: "/assets/projects/apreton.png",
  },
];

const aboutStats = [
  { value: "17+", label: "años de experiencia" },
  { value: "300+", label: "servicios realizados" },
];

function AboutSection() {
  return (
    <section className="section about-section" id="nosotros">
      <div className="container about-wrapper">
        <div className="about-heading reveal">
          <div className="about-heading-title">
            <h2>Nosotros</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Transformamos espacios</span> con experiencia, calidad y
            confianza.
          </p>
        </div>

        <div className="about-showcase reveal">
          <div className="about-image-shell">
            <picture>
              <source media="(max-width: 768px)" srcSet={aboutMobileImage} />
              <img
                src={aboutImage}
                alt="Equipo de Servicios Falcón trabajando en un proyecto"
                className="about-image"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </picture>
            <div className="about-image-overlay" aria-hidden="true"></div>
            <div
              className="about-image-stats"
              aria-label="Resumen de experiencia"
            >
              {aboutStats.map(({ value, label }) => (
                <article className="about-stat-item" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="about-content-card">
            <span className="about-kicker">
              Soluciones con criterio técnico y visual{" "}
            </span>

            <h3>Un equipo que cuida el resultado y también el proceso.</h3>

            <p className="about-content-copy">
              Combinamos remodelación, mantenimiento e imagen comercial para
              mejorar hogares, negocios y espacios comerciales con una ejecución
              clara, ordenada y pensada para durar.
            </p>

            <div className="about-trust-note">
              <strong>Un mismo equipo, menos fricción.</strong>
              <p>Coordinación más simple, mejor seguimiento y menos vueltas.</p>
            </div>

            <div className="about-feature-list">
              {aboutFeatures.map(({ title, copy, icon }) => (
                <article className="about-feature-item" key={title}>
                  <span className="about-feature-icon">
                    <img src={icon} alt="" aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(AboutSection);

