import React, { useEffect, useRef, useState } from "react";

const HEADER_OFFSET_FALLBACK = 0;
const HEADER_ANCHOR_SPACING_DESKTOP = 0;
const HEADER_ANCHOR_SPACING_MOBILE = 0;

const navLinks = [
  {
    href: "#nosotros",
    label: "Nosotros",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.87 0-7 2.02-7 4.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5C19 16.02 15.87 14 12 14Z" />
      </svg>
    ),
  },
  {
    href: "#servicios",
    label: "Servicios",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 7.5 16.5 3 14 5.5l1.6 1.6-3.95 3.95-1.6-1.6L3 16.5 7.5 21l7.05-7.05-1.6-1.6 3.95-3.95 1.6 1.6Z" />
      </svg>
    ),
  },
  {
    href: "#proyectos",
    label: "Galería",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2h14v8.4l-3.2-3.2a1 1 0 0 0-1.4 0l-3.1 3.1-1.6-1.6a1 1 0 0 0-1.4 0L5 16.1Zm3 4.25A1.25 1.25 0 1 0 6.75 9 1.25 1.25 0 0 0 8 10.25Z" />
      </svg>
    ),
  },
  {
    href: "#contacto",
    label: "Contacto",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5Zm2 .5v.3l5.6 4.2a.67.67 0 0 0 .8 0L18 6.3V6Zm12 2.8-4.8 3.6a2.67 2.67 0 0 1-3.2 0L6 8.8v10.7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5Z" />
      </svg>
    ),
  },
  {
    href: "#faq",
    label: "FAQ",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 15.2a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2Zm1.13-4.75-.46.29A1.42 1.42 0 0 0 12 15h-1.5v-.39a2.8 2.8 0 0 1 1.31-2.37l.64-.41a1.64 1.64 0 0 0 .83-1.37 1.78 1.78 0 0 0-3.55-.23H8.22a3.28 3.28 0 0 1 6.53.43 3.05 3.05 0 0 1-1.62 2.79Z" />
      </svg>
    ),
  },
];

function Header({ menuOpen, setMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 18);
      setIsHeaderVisible(menuOpen || currentScrollY < 32);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileViewport, menuOpen]);

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
    const root = document.documentElement;

    function updateHeaderOffset() {
      const spacing = isMobileViewport
        ? HEADER_ANCHOR_SPACING_MOBILE
        : HEADER_ANCHOR_SPACING_DESKTOP;
      const nextOffset = spacing || HEADER_OFFSET_FALLBACK;

      root.style.setProperty("--header-offset", `${nextOffset}px`);
    }

    updateHeaderOffset();

    const resizeObserver = new ResizeObserver(updateHeaderOffset);

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, [isMobileViewport, isScrolled, menuOpen]);

  function handleAnchorNavigation(event, href) {
    if (!href?.startsWith("#")) return;

    event.preventDefault();
    setIsHeaderVisible(true);
    setMenuOpen(false);

    if (href === "#inicio") {
      window.history.pushState(null, "", href);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(href);

    if (!target) return;

    const cssOffset = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-offset",
      ),
    );
    const fallbackSpacing = isMobileViewport
      ? HEADER_ANCHOR_SPACING_MOBILE
      : HEADER_ANCHOR_SPACING_DESKTOP;
    const headerOffset = Number.isFinite(cssOffset)
      ? cssOffset
      : fallbackSpacing || HEADER_OFFSET_FALLBACK;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const targetTop =
          window.scrollY + target.getBoundingClientRect().top - headerOffset;

        window.history.pushState(null, "", href);
        window.scrollTo({
          top: Math.max(targetTop, 0),
          behavior: "smooth",
        });
      });
    });
  }

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header
        ref={headerRef}
        className={`site-header${menuOpen ? " is-open" : ""}${isScrolled ? " is-scrolled" : ""}${!isHeaderVisible && !menuOpen ? " is-hidden" : ""}`}
        id="inicio"
      >
        <div className="header-top-line" aria-hidden="true"></div>
        <div className="container nav-shell">
          <a
            className="brand"
            href="#inicio"
            aria-label="Ir al inicio"
            onClick={(event) => handleAnchorNavigation(event, "#inicio")}
          >
            <img
              src="/assets/logo-navbar.webp"
              alt="Logo de Servicios Falcón"
              width="220"
              height="139"
            />
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className="nav-panel"
            aria-hidden={isMobileViewport && !menuOpen}
          >
            <nav className="main-nav" id="main-nav" aria-label="Principal">
              {navLinks.map(({ href, label, icon }) => (
                <a
                  className="nav-link"
                  key={href}
                  href={href}
                  tabIndex={isMobileViewport && !menuOpen ? -1 : 0}
                  onClick={(event) => handleAnchorNavigation(event, href)}
                >
                  <span className="nav-link-icon">{icon}</span>
                  <span className="nav-link-label">{label}</span>
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <a
                className="btn btn-primary header-cta"
                href="#contacto"
                tabIndex={isMobileViewport && !menuOpen ? -1 : 0}
                onClick={(event) => handleAnchorNavigation(event, "#contacto")}
              >
                <span className="header-cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Zm2 .5v.3l5.6 4.2a.67.67 0 0 0 .8 0L18 7.3V7Zm12 2.8-4.8 3.6a2.67 2.67 0 0 1-3.2 0L6 9.8v7.7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5Z" />
                  </svg>
                </span>
                <span className="header-cta-label">Cotizar ahora</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      {isMobileViewport && menuOpen ? (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Cerrar menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </>
  );
}

export default React.memo(Header);

