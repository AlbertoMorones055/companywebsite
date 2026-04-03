import React, { useEffect, useRef, useState } from "react";

function preloadImageAsset(path) {
  const image = new Image();
  image.decoding = "async";
  image.src = path;
}

function ServicesSection({ services }) {
  const [expandedService, setExpandedService] = useState(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    lockedAxis: null,
    lastDeltaX: 0,
  });
  const visibleServices = services.slice(0, 6);

  const toggleService = (serviceTitle) => {
    setExpandedService((currentTitle) =>
      currentTitle === serviceTitle ? null : serviceTitle,
    );
  };

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

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          visibleServices.forEach((service) => {
            preloadImageAsset(service.mobileImage || service.image);
            preloadImageAsset(service.image);
            preloadImageAsset(service.icon);
          });

          observer.disconnect();
        });
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [visibleServices]);

  function scrollToCard(index) {
    const trackElement = trackRef.current;

    if (!trackElement) return;

    const cards = trackElement.querySelectorAll(".services-card");
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
        ? (activeIndex + 1) % visibleServices.length
        : (activeIndex - 1 + visibleServices.length) % visibleServices.length;

    setActiveIndex(nextIndex);
    scrollToCard(nextIndex);
  }

  function getClosestCardIndex() {
    const trackElement = trackRef.current;

    if (!trackElement) return 0;

    const cards = Array.from(trackElement.querySelectorAll(".services-card"));

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

      if (activeIndex === visibleServices.length - 1 && wantsNext) {
        setActiveIndex(0);
        scrollToCard(0);
      } else if (activeIndex === 0 && wantsPrev) {
        const lastIndex = visibleServices.length - 1;
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
    <section
      ref={sectionRef}
      className="section services-section"
      id="servicios"
    >
      <div className="container services-layout">
        <div className="about-heading services-heading reveal">
          <div className="about-heading-title">
            <h2>Servicios</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Soluciones claras</span> para mejorar tu espacio y su
            funcionamiento.
          </p>
        </div>

        <div className="services-carousel-shell">
          {isMobileViewport ? (
            <div
              className="services-carousel-arrows"
              aria-label="Navegacion lateral de servicios"
            >
              <button
                className="services-carousel-arrow"
                type="button"
                aria-label="Servicio anterior"
                onClick={() => handleArrowNavigation("prev")}
              >
                <span aria-hidden="true">{"<"}</span>
              </button>
              <button
                className="services-carousel-arrow"
                type="button"
                aria-label="Siguiente servicio"
                onClick={() => handleArrowNavigation("next")}
              >
                <span aria-hidden="true">{">"}</span>
              </button>
            </div>
          ) : null}

          <div
            ref={trackRef}
            className="services-cards-grid"
            onScroll={handleTrackScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {visibleServices.map((service) => {
              const isExpanded = expandedService === service.title;
              const detailsId = `service-details-${service.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`;

              return (
                <article
                  className={`services-card ${isExpanded ? "is-expanded" : ""}`}
                  key={service.title}
                >
                  <picture className="services-card-media" aria-hidden="true">
                    <source
                      media="(max-width: 768px)"
                      srcSet={service.mobileImage || service.image}
                    />
                    <img
                      src={service.image}
                      alt=""
                      draggable="false"
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"
                    />
                  </picture>
                  <div className="services-card-body">
                    <div className="services-card-heading">
                      <div
                        className="services-card-icon-shell"
                        aria-hidden="true"
                      >
                        <img
                          src={service.icon}
                          alt=""
                          className="services-card-icon"
                          draggable="false"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <h3>{service.title}</h3>
                    </div>
                    <div className="services-card-copy">
                      <p>{service.text}</p>
                      <button
                        type="button"
                        className="services-card-toggle"
                        onClick={() => toggleService(service.title)}
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                      >
                        {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                      </button>
                      <div
                        className={`services-card-details ${isExpanded ? "is-visible" : ""}`}
                        id={detailsId}
                        aria-hidden={!isExpanded}
                      >
                        <div className="services-card-detail-group">
                          <h4>Aplicaciones comunes:</h4>
                          <ul className="services-card-list">
                            {service.applications?.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {isMobileViewport ? (
            <div className="services-carousel-dots" aria-label="Indicadores del carrusel de servicios">
              {visibleServices.map((service, index) => (
                <button
                  key={service.title}
                  className={`services-carousel-dot${index === activeIndex ? " is-active" : ""}`}
                  type="button"
                  aria-label={`Ir al servicio ${index + 1}`}
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

export default React.memo(ServicesSection);
