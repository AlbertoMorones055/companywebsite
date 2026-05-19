import { useEffect, useRef, useState, lazy, Suspense } from "react";
import AboutSection from "./components/AboutSection.jsx";
import BenefitsSection from "./components/BenefitsSection.jsx";
import Collaborators from "./components/Collaborators.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
const Lightbox = lazy(() => import("./components/Lightbox.jsx"));
import ServicesSection from "./components/ServicesSection.jsx";
import WorkingProcessSection from "./components/WorkingProcessSection.jsx";
const ProjectsSection = lazy(() => import("./components/ProjectsSection.jsx"));
const TestimonialsSection = lazy(() =>
  import("./components/TestimonialsSection.jsx"),
);
const FaqSection = lazy(() => import("./components/FaqSection.jsx"));
const ContactSection = lazy(() => import("./components/ContactSection.jsx"));
import { faqs, projects, services } from "./data/siteData.js";
import useBodyScrollLock from "./hooks/useBodyScrollLock.js";
import useEscapeKey from "./hooks/useEscapeKey.js";
import useMediaQuery from "./hooks/useMediaQuery.js";
import useRevealOnScroll from "./hooks/useRevealOnScroll.js";

const initialFormValues = {
  nombre: "",
  telefono: "",
  correo: "",
  tipo: "",
  mensaje: "",
};

const contactEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "/api/contact";

function normalizeFormValues(values) {
  return {
    nombre: values.nombre.trim(),
    telefono: values.telefono.trim(),
    correo: values.correo.trim(),
    tipo: values.tipo.trim(),
    mensaje: values.mensaje.trim(),
  };
}

function DeferredSection({
  children,
  forceLoad = false,
  minHeight = 0,
  rootMargin = "320px 0px",
  sectionId,
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!forceLoad) return undefined;

    setShouldLoad(true);
    return undefined;
  }, [forceLoad]);

  useEffect(() => {
    if (shouldLoad) return undefined;

    if (
      sectionId &&
      typeof window !== "undefined" &&
      window.location.hash === `#${sectionId}`
    ) {
      setShouldLoad(true);
      return undefined;
    }

    const sectionElement = sectionRef.current;

    if (!sectionElement || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setShouldLoad(true);
          observer.disconnect();
        });
      },
      { rootMargin },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [rootMargin, sectionId, shouldLoad]);

  return (
    <div
      ref={sectionRef}
      id={!shouldLoad ? sectionId : undefined}
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
    >
      {shouldLoad ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}

function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isHeroMediaReady, setIsHeroMediaReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldLoadContact, setShouldLoadContact] = useState(false);
  const [contactScrollRequest, setContactScrollRequest] = useState(0);
  const lightboxTriggerRef = useRef(null);
  const introStartRef = useRef(Date.now());
  const isMobileViewport = useMediaQuery("(max-width: 768px)");
  const year = new Date().getFullYear();

  useBodyScrollLock(menuOpen || lightbox);
  useRevealOnScroll();
  useEscapeKey(() => {
    setMenuOpen(false);
    setLightbox(null);
  });

  useEffect(() => {
    if (!isMobileViewport) return;

    setIsIntroVisible(false);
  }, [isMobileViewport]);

  useEffect(() => {
    if (!isIntroVisible) return undefined;

    const maxWaitTimer = window.setTimeout(() => {
      setIsIntroVisible(false);
    }, 900);

    return () => window.clearTimeout(maxWaitTimer);
  }, [isIntroVisible]);

  useEffect(() => {
    if (!isIntroVisible || !isHeroMediaReady) return undefined;

    const elapsed = Date.now() - introStartRef.current;
    const remaining = Math.max(280 - elapsed, 0);
    const revealTimer = window.setTimeout(() => {
      setIsIntroVisible(false);
    }, remaining);

    return () => window.clearTimeout(revealTimer);
  }, [isHeroMediaReady, isIntroVisible]);

  useEffect(() => {
    if (!contactScrollRequest) return undefined;

    let attempts = 0;
    let timerId = 0;

    const scrollToContactForm = () => {
      const contactForm = document.getElementById("contactForm");

      if (contactForm) {
        contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstField = contactForm.querySelector("input, select, textarea");
        firstField?.focus({ preventScroll: true });
        return;
      }

      attempts += 1;

      if (attempts < 12) {
        timerId = window.setTimeout(scrollToContactForm, 120);
      }
    };

    scrollToContactForm();

    return () => window.clearTimeout(timerId);
  }, [contactScrollRequest]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function validate(values) {
    if (
      !values.nombre ||
      !values.telefono ||
      !values.correo ||
      !values.tipo ||
      !values.mensaje
    ) {
      setFeedback("Completa todos los campos antes de continuar.");
      setFeedbackType("is-error");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
      setFeedback("Escribe un correo válido para continuar.");
      setFeedbackType("is-error");
      return false;
    }

    setFeedback("");
    setFeedbackType("");
    return true;
  }

  async function submitContactForm(event) {
    event.preventDefault();
    const values = normalizeFormValues(formValues);

    if (!validate(values)) return;

    setIsSubmitting(true);
    setFeedback("Enviando tu solicitud...");
    setFeedbackType("");

    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseContentType = response.headers.get("content-type") || "";
      let result = null;

      if (responseContentType.includes("application/json")) {
        result = await response.json().catch(() => null);
      } else {
        const responseText = await response.text().catch(() => "");
        throw new Error(
          responseText
            ? "El servicio respondió con un formato inesperado."
            : "No recibimos una respuesta válida del servicio.",
        );
      }

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            "El servicio no confirmó correctamente el envío del formulario.",
        );
      }

      setFeedback(
        "Tu solicitud fue enviada correctamente. Te contactaremos pronto.",
      );
      setFeedbackType("is-success");
      setFormValues(initialFormValues);
    } catch {
      setFeedback(
        "No pudimos enviar el formulario en este momento. Intenta de nuevo o usa el botón de WhatsApp.",
      );
      setFeedbackType("is-error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function sendToWhatsApp() {
    const values = normalizeFormValues(formValues);

    if (!validate(values)) return;

    const text = encodeURIComponent(
      `Hola, me interesa una cotización.

Nombre: ${values.nombre}
Teléfono: ${values.telefono}
Correo: ${values.correo}
Tipo de proyecto: ${values.tipo}

Mensaje:
${values.mensaje}`,
    );

    window.open(
      `https://wa.me/523310893265?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
    setFeedback("Se abrió WhatsApp con tu mensaje listo para enviar.");
    setFeedbackType("is-success");
    setFormValues(initialFormValues);
  }

  function handleLightboxNext() {
    setLightbox((currentLightbox) => {
      if (!currentLightbox) return currentLightbox;

      const currentProject = projects[currentLightbox.projectIndex];
      const nextImageIndex =
        (currentLightbox.imageIndex + 1) % currentProject.gallery.length;

      return {
        ...currentLightbox,
        imageIndex: nextImageIndex,
      };
    });
  }

  function handleLightboxPrevious() {
    setLightbox((currentLightbox) => {
      if (!currentLightbox) return currentLightbox;

      const currentProject = projects[currentLightbox.projectIndex];
      const previousImageIndex =
        (currentLightbox.imageIndex - 1 + currentProject.gallery.length) %
        currentProject.gallery.length;

      return {
        ...currentLightbox,
        imageIndex: previousImageIndex,
      };
    });
  }

  function handleLightboxOpen(projectIndex, imageIndex, triggerElement) {
    lightboxTriggerRef.current = triggerElement;
    setLightbox({ projectIndex, imageIndex });
  }

  function handleHeroQuoteRequest(event) {
    event.preventDefault();
    setShouldLoadContact(true);
    setContactScrollRequest((currentRequest) => currentRequest + 1);
    window.history.replaceState(null, "", "#contacto");
  }

  return (
    <>
      <div
        className={`app-loader${isIntroVisible && !isMobileViewport ? " is-visible" : ""}`}
      >
        <div className="app-loader-panel">
          <img
            className="app-loader-logo"
            src="/assets/logo-navbar.webp"
            alt="Servicios Falcón"
            width="220"
            height="139"
          />
          <div className="app-loader-bar" aria-hidden="true">
            <span className="app-loader-bar-fill"></span>
          </div>
        </div>
      </div>

      <Header
        menuOpen={menuOpen}
        onQuoteRequest={handleHeroQuoteRequest}
        setMenuOpen={setMenuOpen}
      />

      <main id="contenido">
        <HeroSection
          onMediaReady={() => setIsHeroMediaReady(true)}
          onQuoteRequest={handleHeroQuoteRequest}
        />
        <AboutSection onQuoteRequest={handleHeroQuoteRequest} />
        <ServicesSection services={services} />
        <BenefitsSection />
        <Collaborators />
        <DeferredSection sectionId="proyectos" minHeight={720}>
          <ProjectsSection
            projects={projects}
            onOpenLightbox={handleLightboxOpen}
          />
        </DeferredSection>
        <DeferredSection minHeight={420}>
          <TestimonialsSection />
        </DeferredSection>
        <WorkingProcessSection />
        <DeferredSection sectionId="faq" minHeight={640}>
          <FaqSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </DeferredSection>
        <DeferredSection
          forceLoad={shouldLoadContact}
          sectionId="contacto"
          minHeight={920}
        >
          <ContactSection
            feedback={feedback}
            feedbackType={feedbackType}
            formValues={formValues}
            isSubmitting={isSubmitting}
            onChange={handleFormChange}
            onSubmit={submitContactForm}
            onWhatsApp={sendToWhatsApp}
          />
        </DeferredSection>
      </main>

      <Footer year={year} />

      <div className="floating-actions" aria-label="Acciones rápidas">
        <a
          className="float-btn float-whatsapp"
          href="https://wa.me/523310893265?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20servicios."
          target="_blank"
          rel="noreferrer"
          aria-label="Enviar WhatsApp a Servicios Falcón"
        >
          <span className="float-btn-icon" aria-hidden="true">
            <img src="/assets/projects/whatsIcono.png" alt="" />
          </span>
        </a>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Lightbox
          lightbox={lightbox}
          projects={projects}
          onClose={() => setLightbox(null)}
          onNext={handleLightboxNext}
          onPrevious={handleLightboxPrevious}
          returnFocusRef={lightboxTriggerRef}
        />
      </Suspense>
    </>
  );
}

export default App;

