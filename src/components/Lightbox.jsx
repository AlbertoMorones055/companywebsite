import { useEffect, useRef } from "react";

function getMobileProjectImage(imagePath) {
  return imagePath.replace(/\.(webp|png|jpe?g)$/i, "-mobile.webp");
}

function preloadImageAsset(path) {
  const image = new Image();
  image.decoding = "async";
  image.src = path;
}

function Lightbox({
  lightbox,
  projects,
  onClose,
  onNext,
  onPrevious,
  returnFocusRef,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const activeProject = lightbox ? projects[lightbox.projectIndex] : null;
  const activeImage = activeProject ? activeProject.gallery[lightbox.imageIndex] : null;
  const nextImage =
    activeProject && lightbox
      ? activeProject.gallery[
          (lightbox.imageIndex + 1) % activeProject.gallery.length
        ]
      : null;
  const previousImage =
    activeProject && lightbox
      ? activeProject.gallery[
          (lightbox.imageIndex - 1 + activeProject.gallery.length) %
            activeProject.gallery.length
        ]
      : null;

  useEffect(() => {
    if (!lightbox) return undefined;

    const focusTarget = returnFocusRef?.current;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      focusTarget?.focus?.();
    };
  }, [lightbox, onNext, onPrevious, returnFocusRef]);

  useEffect(() => {
    if (!lightbox || !activeImage) return;

    [activeImage, nextImage, previousImage].forEach((imageItem) => {
      if (!imageItem?.image) return;

      preloadImageAsset(`/assets/projects/${imageItem.image}`);
      preloadImageAsset(
        `/assets/projects/${getMobileProjectImage(imageItem.image)}`,
      );
    });
  }, [activeImage, lightbox, nextImage, previousImage]);

  if (!lightbox || !activeProject || !activeImage) return null;

  return (
    <div
      ref={dialogRef}
      className="lightbox is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightboxCaption"
      aria-describedby="lightboxDescription"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <button
        ref={closeButtonRef}
        className="lightbox-close"
        type="button"
        aria-label="Cerrar galeria"
        onClick={onClose}
      >
        ×
      </button>
      <figure className="lightbox-content">
        <div className="lightbox-media-shell">
          <button
            className="lightbox-nav lightbox-nav-prev"
            type="button"
            aria-label="Ver imagen anterior"
            onClick={onPrevious}
          >
            ‹
          </button>
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={`/assets/projects/${getMobileProjectImage(activeImage.image)}`}
            />
            <img
              src={`/assets/projects/${activeImage.image}`}
              alt={activeProject.title}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 920px"
            />
          </picture>
          <button
            className="lightbox-nav lightbox-nav-next"
            type="button"
            aria-label="Ver imagen siguiente"
            onClick={onNext}
          >
            ›
          </button>
        </div>
        <figcaption id="lightboxCaption">{activeProject.title}</figcaption>
        <p className="lightbox-description" id="lightboxDescription">
          {activeImage.description}
        </p>
        <p className="lightbox-counter" aria-live="polite">
          {lightbox.imageIndex + 1} / {activeProject.gallery.length}
        </p>
      </figure>
    </div>
  );
}

export default Lightbox;
