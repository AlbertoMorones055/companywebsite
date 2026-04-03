import React from "react";

function Footer({ year }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img
            className="footer-logo"
            src="/assets/logo-full.webp"
            alt="Servicios Falcón"
            width="250"
            height="250"
          />
          <p>Soluciones para hogares, negocios y espacios comerciales.</p>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul className="footer-links">
            <li>
              <a href="tel:+523310893265">33 1089 3265</a>
            </li>
            <li>
              <a href="mailto:servicios_f@hotmail.com">
                servicios_f@hotmail.com
              </a>
            </li>
            <li>Guadalajara, Jalisco</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {year} Servicios Falcón. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default React.memo(Footer);

