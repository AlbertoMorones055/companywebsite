import React, { useEffect, useMemo, useRef, useState } from "react";

const collaborators = [
  {
    name: "Modelo",
    logo: "/assets/projects/logoModelo.png",
    width: 186,
  },
  {
    name: "Pemex",
    logo: "/assets/projects/logoPemex.png",
    width: 174,
  },
  {
    name: "Tecate",
    logo: "/assets/projects/tecateLogoNuevo.png",
    width: 560,
    height: 210,
  },
  {
    name: "Coca-Cola",
    logo: "/assets/projects/logoCocca.png",
    width: 196,
  },
  {
    name: "Corona",
    logo: "/assets/projects/logoCorona.png",
    width: 176,
  },
];

function getUniqueCollaborators(items) {
  const seenNames = new Set();

  return items.filter(({ name }) => {
    if (seenNames.has(name)) {
      return false;
    }

    seenNames.add(name);
    return true;
  });
}

function CollaboratorSet({ items, duplicate = false, copyIndex = 0 }) {
  return (
    <div className="collaborators-set" aria-hidden={duplicate}>
      {items.map(({ name, logo, width, height }) => (
        <article
          className="collaborator-logo-item"
          key={`${name}-${copyIndex}`}
          aria-label={!duplicate ? `Empresa colaboradora: ${name}` : undefined}
        >
          <img
            src={logo}
            alt={duplicate ? "" : name}
            className="collaborator-logo"
            loading="lazy"
            style={{
              maxWidth: `${width}px`,
              maxHeight: height ? `${height}px` : undefined,
            }}
          />
        </article>
      ))}
    </div>
  );
}

function CollaboratorTrack({ items }) {
  const marqueeRef = useRef(null);
  const setRef = useRef(null);
  const uniqueItems = useMemo(() => getUniqueCollaborators(items), [items]);
  const [trackMetrics, setTrackMetrics] = useState({
    setWidth: 0,
    copies: 3,
  });

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    const setElement = setRef.current;

    if (!marqueeElement || !setElement) {
      return undefined;
    }

    const updateMeasurements = () => {
      const nextSetWidth = setElement.scrollWidth;
      const viewportWidth = marqueeElement.offsetWidth || window.innerWidth;
      const nextCopies = Math.max(
        3,
        Math.ceil(viewportWidth / Math.max(nextSetWidth, 1)) + 2,
      );

      setTrackMetrics({
        setWidth: nextSetWidth,
        copies: nextCopies,
      });
    };

    updateMeasurements();

    const resizeObserver = new ResizeObserver(() => {
      updateMeasurements();
    });

    resizeObserver.observe(marqueeElement);
    resizeObserver.observe(setElement);
    window.addEventListener("resize", updateMeasurements);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [uniqueItems]);

  return (
    <div className="collaborators-marquee" ref={marqueeRef}>
      <div
        className="collaborators-track"
        style={{
          "--collaborators-scroll-distance": `${trackMetrics.setWidth}px`,
        }}
      >
        <div ref={setRef}>
          <CollaboratorSet items={uniqueItems} copyIndex={0} />
        </div>

        {Array.from({ length: trackMetrics.copies - 1 }, (_, index) => (
          <CollaboratorSet
            key={`duplicate-set-${index + 1}`}
            items={uniqueItems}
            duplicate
            copyIndex={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

function Collaborators() {
  return (
    <section className="section collaborators-section section-soft">
      <div className="container">
        <div className="about-heading collaborators-copy reveal">
          <div className="about-heading-title">
            <h2>Empresas atendidas</h2>
          </div>
          <div className="about-heading-line" aria-hidden="true"></div>
          <p className="about-subtitle">
            <span>Marcas que han confiado</span> en nuestro trabajo y en la
            calidad de nuestros proyectos.
          </p>
        </div>
      </div>

      <div
        className="collaborators-stage reveal"
        aria-label="Carrusel continuo de colaboradores"
      >
        <CollaboratorTrack items={collaborators} />
      </div>
    </section>
  );
}

export default React.memo(Collaborators);
