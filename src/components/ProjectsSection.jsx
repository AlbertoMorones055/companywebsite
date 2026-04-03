import React, { useEffect, useRef } from "react";

function getMobileProjectImage(imagePath) {
  return imagePath.replace(/\.(webp|png|jpe?g)$/i, "-mobile.webp");
}

function preloadImageAsset(path) {
  const image = new Image();
  image.decoding = "async";
  image.src = path;
}

function ProjectsSection({ projects, onOpenLightbox }) {
  const sectionRef = useRef(null);
  const warmedProjectsRef = useRef(new Set());

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          projects.slice(0, isMobileViewport ? 1 : 3).forEach((project) => {
            const firstImage = project.gallery[0]?.image;

            if (!firstImage) return;

            const preferredImage = isMobileViewport
              ? getMobileProjectImage(firstImage)
              : firstImage;

            preloadImageAsset(`/assets/projects/${preferredImage}`);
          });

          observer.disconnect();
        });
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [projects]);

  function warmProjectImages(project) {
    if (warmedProjectsRef.current.has(project.title)) return;

    const firstImage = project.gallery[0]?.image;

    if (!firstImage) return;

    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    const preferredImage = isMobileViewport
      ? getMobileProjectImage(firstImage)
      : firstImage;

    preloadImageAsset(`/assets/projects/${preferredImage}`);
    warmedProjectsRef.current.add(project.title);
  }

  return (
    <section
      ref={sectionRef}
      className="section section-dark projects"
      id="proyectos"
    >
      <div className="container">
        <div className="about-heading projects-heading reveal">
          <div className="about-heading-title">
            <h2>Proyectos</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Referencias visuales</span> del tipo de trabajo que realizamos
            para espacios residenciales y comerciales.
          </p>
        </div>
        <div className="gallery-grid">
          {projects.slice(0, 6).map((project, index) => (
            <button
              key={project.title}
              className={`gallery-item reveal ${project.variant}`.trim()}
              type="button"
              onClick={(event) => onOpenLightbox(index, 0, event.currentTarget)}
              onMouseEnter={() => warmProjectImages(project)}
              onTouchStart={() => warmProjectImages(project)}
              aria-label={`${project.title}. Ver galería de imágenes`}
            >
              <picture>
                <source
                  media="(max-width: 768px)"
                  srcSet={`/assets/projects/${getMobileProjectImage(project.cover)}`}
                />
                <img
                  src={`/assets/projects/${project.cover}`}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"
                />
              </picture>
              <span className="gallery-item-hint">Ver galería</span>
              <span className="gallery-item-title">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default React.memo(ProjectsSection);
