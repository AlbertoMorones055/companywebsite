import React from "react";

function ContactSection({
  feedback,
  feedbackType,
  formValues,
  isSubmitting,
  onChange,
  onSubmit,
  onWhatsApp,
}) {
  return (
    <section className="section contact-section" id="contacto">
      <div className="container contact-grid contact-layout">
        <div className="contact-copy reveal">
          <div className="about-heading contact-heading">
            <div className="about-heading-title">
              <h2>Contacto</h2>
            </div>
            <div className="about-heading-line" aria-hidden="true"></div>
            <p className="about-subtitle">
              <span>Cuéntanos qué necesitas</span> y te orientamos.
            </p>
          </div>

          <p className="contact-copy-text">
            Si buscas remodelación, mantenimiento, pintura, electricidad,
            adecuaciones o mejoras de imagen, aquí tienes una vía rápida para
            iniciar tu cotización con la información correcta desde el inicio.
          </p>

          <div className="contact-mini-note">
            <strong>Respuesta más ágil.</strong>
            <p>
              Si compartes el tipo de espacio, el servicio y lo que necesitas,
              será más fácil orientarte y darte seguimiento.
            </p>
          </div>

          <div className="contact-cards">
            <a className="contact-card" href="tel:+523310893265">
              <span className="contact-label">Teléfono</span>
              <strong>33 1089 3265</strong>
              <span>Llamada directa para atención inmediata</span>
            </a>
            <a className="contact-card" href="mailto:servicios_f@hotmail.com">
              <span className="contact-label">Correo</span>
              <strong>servicios_f@hotmail.com</strong>
              <span>Ideal para solicitudes con mayor detalle</span>
            </a>
          </div>
        </div>

        <form
          className="contact-form reveal"
          id="contactForm"
          noValidate
          onSubmit={onSubmit}
        >
          <div className="contact-form-header">
            <span className="contact-form-kicker">Solicitud de contacto</span>
            <p className="contact-form-intro">
              Comparte los datos clave de tu proyecto. Mientras más claro sea el
              contexto, más fácil será darte una orientación útil desde el
              primer mensaje.
            </p>
          </div>

          <div className="form-grid">
            <label htmlFor="nombre">
              <span>Nombre</span>
              <input
                id="nombre"
                type="text"
                name="nombre"
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                placeholder="Tu nombre"
                required
                value={formValues.nombre}
                disabled={isSubmitting}
                onChange={onChange}
              />
            </label>
            <label htmlFor="telefono">
              <span>Teléfono</span>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                autoComplete="tel"
                inputMode="tel"
                enterKeyHint="next"
                placeholder="Tu teléfono"
                required
                value={formValues.telefono}
                disabled={isSubmitting}
                onChange={onChange}
              />
            </label>
            <label className="full-width" htmlFor="correo">
              <span>Correo</span>
              <input
                id="correo"
                type="email"
                name="correo"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                enterKeyHint="next"
                placeholder="tunombre@correo.com"
                required
                value={formValues.correo}
                disabled={isSubmitting}
                onChange={onChange}
              />
            </label>
            <label className="full-width" htmlFor="tipo">
              <span>Tipo de proyecto</span>
              <select
                id="tipo"
                name="tipo"
                required
                autoComplete="off"
                value={formValues.tipo}
                disabled={isSubmitting}
                onChange={onChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="Hogar">Hogar</option>
                <option value="Negocio">Negocio</option>
                <option value="Espacio comercial">Espacio comercial</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </label>
            <label
              className="full-width contact-message-field"
              htmlFor="mensaje"
            >
              <span>Mensaje</span>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="7"
                autoCapitalize="sentences"
                enterKeyHint="send"
                placeholder="Cuéntanos qué necesitas, qué tipo de espacio es y qué servicio te interesa..."
                required
                value={formValues.mensaje}
                disabled={isSubmitting}
                onChange={onChange}
              ></textarea>
            </label>
          </div>

          <p className="form-note">
            Si prefieres atención inmediata, puedes usar WhatsApp. Si quieres
            dejar mejor detallado tu proyecto, envía la solicitud por correo.
          </p>

          <div className="form-actions">
            <button
              className="btn btn-primary contact-mail-btn"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="contact-action-btn-icon" aria-hidden="true">
                <img src="/assets/projects/correoIcono.png" alt="" />
              </span>
              <span>{isSubmitting ? "Enviando..." : "Enviar por correo"}</span>
            </button>
            <button
              className="btn contact-whatsapp-btn"
              type="button"
              disabled={isSubmitting}
              onClick={onWhatsApp}
            >
              <span className="contact-action-btn-icon" aria-hidden="true">
                <img src="/assets/projects/whatsIcono.png" alt="" />
              </span>
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
          <p
            className={`form-feedback ${feedbackType}`.trim()}
            role="status"
            aria-live="polite"
          >
            {feedback}
          </p>
        </form>
      </div>
    </section>
  );
}

export default React.memo(ContactSection);

