const benefits = [
  ['Experiencia real en distintos tipos de proyecto', 'Hemos trabajado en hogares, negocios, fachadas, instalaciones y espacios comerciales.'],
  ['Buena imagen y funcionalidad', 'No se trata solo de que se vea bien, sino de que funcione mejor para el día a día.'],
  ['Contacto directo y seguimiento', 'Menos vueltas para cotizar, aclarar dudas y avanzar con más claridad.'],
  ['Capacidad para integrar varios servicios', 'Eso reduce fricción y hace más fácil coordinar proyectos con varias necesidades.']
];

function BenefitsSection() {
  return (
    <section className="section benefits section-soft">
      <div className="container">
        <div className="section-heading reveal">
          <p className="eyebrow">¿Por qué elegirnos?</p>
          <h2>Una propuesta de valor pensada para clientes que quieren resolver sin complicarse.</h2>
        </div>
        <div className="benefits-layout">
          <div className="benefits-list">
            {benefits.map(([title, text]) => (
              <article key={title} className="benefit-item reveal"><strong>{title}</strong><p>{text}</p></article>
            ))}
          </div>
          <aside className="process-card reveal">
            <p className="eyebrow">Confianza</p>
            <h3>Lo que más valoran nuestros clientes.</h3>
            <ol>
              <li><span>01</span>Respuesta rápida para cotizar.</li>
              <li><span>02</span>Atención responsable y trato claro.</li>
              <li><span>03</span>Acabados con buena presentación.</li>
              <li><span>04</span>Soluciones completas en un mismo proyecto.</li>
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
