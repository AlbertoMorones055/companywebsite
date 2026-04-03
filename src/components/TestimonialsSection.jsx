import React, { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote:
      "Realizaron trabajos de remodelación en mi Modelorama, principalmente en electricidad, pintura y fachada. Fue un servicio rápido y el lugar mejoró mucho en funcionalidad.",
    service: "Adecuación de local",
    client: "María G.",
  },
  {
    quote:
      "Fueron claros desde el inicio con lo que se iba a hacer y con la cotización, y cumplieron con lo acordado.",
    service: "Cliente residencial",
    client: "Leopoldo M.",
  },
  {
    quote:
      "Lo que más nos gustó fue que pudieron atender varios servicios a la vez, lo que hizo todo más rápido y práctico para nosotros.",
    service: "Adecuación de local",
    client: "Propietario de local",
  },
];

function TestimonialsSection() {
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    lockedAxis: null,
    lastDeltaX: 0,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 920px)");

    function handleViewportChange(event) {
      setIsMobileViewport(event.matches);
    }

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) {
      setActiveIndex(0);
    }
  }, [isMobileViewport]);

  function scrollToCard(index) {
    const trackElement = trackRef.current;

    if (!trackElement) return;

    const cards = trackElement.querySelectorAll(".testimonial-card");
    const nextCard = cards[index];

    if (!nextCard) return;

    nextCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function handleArrowNavigation(direction) {
    const nextIndex =
      direction === "next"
        ? (activeIndex + 1) % testimonials.length
        : (activeIndex - 1 + testimonials.length) % testimonials.length;

    setActiveIndex(nextIndex);
    scrollToCard(nextIndex);
  }

  function getClosestCardIndex() {
    const trackElement = trackRef.current;

    if (!trackElement) return 0;

    const cards = Array.from(trackElement.querySelectorAll(".testimonial-card"));

    if (!cards.length) return 0;

    const trackBounds = trackElement.getBoundingClientRect();
    const trackCenter = trackBounds.left + trackBounds.width / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardBounds = card.getBoundingClientRect();
      const cardCenter = cardBounds.left + cardBounds.width / 2;
      const distance = Math.abs(cardCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleTrackScroll() {
    if (!isMobileViewport || !trackRef.current) return;
    const closestIndex = getClosestCardIndex();

    setActiveIndex((currentIndex) =>
      currentIndex === closestIndex ? currentIndex : closestIndex,
    );
  }

  function handleTouchStart(event) {
    if (!isMobileViewport || !trackRef.current) return;

    const touch = event.touches[0];

    if (!touch) return;

    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startScrollLeft: trackRef.current.scrollLeft,
      lockedAxis: null,
      lastDeltaX: 0,
    };
  }

  function handleTouchMove(event) {
    if (!isMobileViewport || !trackRef.current) return;

    const touch = event.touches[0];

    if (!touch) return;

    const touchState = touchStateRef.current;
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    if (!touchState.lockedAxis) {
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      touchState.lockedAxis =
        Math.abs(deltaX) >= Math.abs(deltaY) * 0.35 ? "x" : "y";
    }

    if (touchState.lockedAxis !== "x") return;

    if (event.cancelable) {
      event.preventDefault();
    }
    touchState.lastDeltaX = deltaX;
    trackRef.current.scrollLeft = touchState.startScrollLeft - deltaX;
  }

  function handleTouchEnd() {
    if (!isMobileViewport || !trackRef.current) return;

    const touchState = touchStateRef.current;

    if (touchState.lockedAxis === "x") {
      const swipeThreshold = 28;
      const wantsNext = touchState.lastDeltaX <= -swipeThreshold;
      const wantsPrev = touchState.lastDeltaX >= swipeThreshold;

      if (activeIndex === testimonials.length - 1 && wantsNext) {
        setActiveIndex(0);
        scrollToCard(0);
      } else if (activeIndex === 0 && wantsPrev) {
        const lastIndex = testimonials.length - 1;
        setActiveIndex(lastIndex);
        scrollToCard(lastIndex);
      } else {
        const closestIndex = getClosestCardIndex();
        setActiveIndex(closestIndex);
        scrollToCard(closestIndex);
      }
    }

    touchStateRef.current.lockedAxis = null;
    touchStateRef.current.lastDeltaX = 0;
  }

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="about-heading testimonials-heading reveal">
          <div className="about-heading-title">
            <h2>Confianza</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Mensajes que ayudan</span> a reducir dudas antes de cotizar.
          </p>
        </div>

        <div className="testimonials-carousel-shell">
          {isMobileViewport ? (
            <div
              className="testimonials-carousel-arrows"
              aria-label="Navegación lateral de testimonios"
            >
              <button
                className="testimonials-carousel-arrow"
                type="button"
                aria-label="Testimonio anterior"
                onClick={() => handleArrowNavigation("prev")}
              >
                <span aria-hidden="true">{"<"}</span>
              </button>
              <button
                className="testimonials-carousel-arrow"
                type="button"
                aria-label="Siguiente testimonio"
                onClick={() => handleArrowNavigation("next")}
              >
                <span aria-hidden="true">{">"}</span>
              </button>
            </div>
          ) : null}

          <div
            ref={trackRef}
            className="testimonial-grid"
            onScroll={handleTrackScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {testimonials.map(({ quote, service, client }) => (
              <article className="testimonial-card" key={`${service}-${client}`}>
                <div className="testimonial-card-content">
                  <span className="testimonial-quote-mark" aria-hidden="true">
                    "
                  </span>
                  <p>{quote}</p>
                </div>

                <div className="testimonial-author">
                  <img
                    src="/assets/projects/resena.png"
                    alt=""
                    aria-hidden="true"
                    className="testimonial-author-icon"
                    draggable="false"
                  />
                  <div className="testimonial-author-copy">
                    <strong>{client}</strong>
                    <span>{service}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {isMobileViewport ? (
            <div
              className="testimonials-carousel-dots"
              aria-label="Indicadores del carrusel de testimonios"
            >
              {testimonials.map(({ service, client }, index) => (
                <button
                  key={`${service}-${client}`}
                  className={`testimonials-carousel-dot${index === activeIndex ? " is-active" : ""}`}
                  type="button"
                  aria-label={`Ir al testimonio ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => {
                    setActiveIndex(index);
                    scrollToCard(index);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default React.memo(TestimonialsSection);
