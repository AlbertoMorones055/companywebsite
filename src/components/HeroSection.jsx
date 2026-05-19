import React, { useEffect, useRef, useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery.js";

const HERO_FALLBACK_IMAGE = "/assets/projects/remodelaciones1.5.webp";
const HERO_FALLBACK_IMAGE_MOBILE =
  "/assets/projects/remodelaciones1.5-mobile.webp";
const HERO_VIDEO_DESKTOP = "/assets/videos/videoHero-ios.mp4";
const HERO_VIDEO_MOBILE = "/assets/videos/videoHero-mobile-10s.mp4";
const HERO_VIDEO_START_TIME_DESKTOP = 8;
const HERO_VIDEO_START_TIME_MOBILE = 0;
const HERO_WHATSAPP_HREF =
  "https://wa.me/523310893265?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20servicios.";

function HeroSection({ onMediaReady, onQuoteRequest }) {
  const videoRef = useRef(null);
  const idleTimerRef = useRef(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const isMobileViewport = useMediaQuery("(max-width: 768px)");
  const fallbackImage = isMobileViewport
    ? HERO_FALLBACK_IMAGE_MOBILE
    : HERO_FALLBACK_IMAGE;
  const startTime = isMobileViewport
    ? HERO_VIDEO_START_TIME_MOBILE
    : HERO_VIDEO_START_TIME_DESKTOP;
  const videoSource = isMobileViewport
    ? HERO_VIDEO_MOBILE
    : `${HERO_VIDEO_DESKTOP}#t=${startTime}`;

  useEffect(() => {
    if (!onMediaReady) return;
    if (!videoReady && !videoFailed) return;

    onMediaReady();
  }, [onMediaReady, videoFailed, videoReady]);

  useEffect(() => {
    setShouldLoadVideo(false);

    idleTimerRef.current = window.setTimeout(() => {
      setShouldLoadVideo(true);
    }, isMobileViewport ? 120 : 260);

    return () => window.clearTimeout(idleTimerRef.current);
  }, [isMobileViewport]);

  useEffect(() => {
    if (!shouldLoadVideo) return undefined;

    const video = videoRef.current;

    if (!video) return undefined;

    video.muted = true;
    video.defaultMuted = true;
    let isCancelled = false;

    const applyStartTime = () => {
      if (video.duration && startTime >= video.duration) {
        return false;
      }

      if (Math.abs(video.currentTime - startTime) < 0.25) {
        return false;
      }

      video.currentTime = startTime;
      return true;
    };

    const playVideo = () => {
      if (isCancelled) return;

      video
        .play()
        .then(() => {
          if (isCancelled) return;
          setVideoFailed(false);
        })
        .catch(() => {
          if (isCancelled) return;
          setVideoFailed(true);
        });
    };

    const seekThenPlay = () => {
      const didSeek = applyStartTime();

      if (didSeek) {
        const handleSeeked = () => {
          video.removeEventListener("seeked", handleSeeked);
          if (!isCancelled) {
            setVideoReady(true);
          }
          playVideo();
        };

        video.addEventListener("seeked", handleSeeked, { once: true });
        return;
      }

      if (!isCancelled) {
        setVideoReady(true);
      }
      playVideo();
    };

    const handleEnded = () => {
      seekThenPlay();
    };

    if (video.readyState >= 1) {
      seekThenPlay();
    } else {
      video.addEventListener("loadedmetadata", seekThenPlay, {
        once: true,
      });
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      isCancelled = true;
      video.pause();
      video.removeEventListener("loadedmetadata", seekThenPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [shouldLoadVideo, startTime]);

  return (
    <section className="hero section-dark">
      <div
        className={`hero-media${videoReady ? " is-video-ready" : ""}${videoFailed ? " has-video-fallback" : ""}`}
        aria-hidden="true"
      >
        <div
          className="hero-media-fallback"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        ></div>

        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop={false}
            playsInline
            preload="metadata"
            poster={fallbackImage}
            onLoadStart={() => {
              setVideoReady(false);
              setVideoFailed(false);
            }}
            onPlaying={() => {
              if (videoRef.current?.currentTime >= startTime - 0.25) {
                setVideoReady(true);
              }
              setVideoFailed(false);
            }}
            onError={() => setVideoFailed(true)}
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        ) : null}

        <div className="hero-video-overlay"></div>
        <div className="hero-video-gradient"></div>
      </div>

      <div className="hero-backdrop" aria-hidden="true">
        <span className="hero-gridlines"></span>
        <span className="hero-dots hero-dots-left"></span>
        <span className="hero-dots hero-dots-center"></span>
        <span className="hero-sweep hero-sweep-one"></span>
        <span className="hero-sweep hero-sweep-two"></span>
        <span className="hero-sweep hero-sweep-three"></span>
        <span className="hero-spark hero-spark-one"></span>
        <span className="hero-spark hero-spark-two"></span>
        <span className="hero-spark hero-spark-three"></span>
      </div>

      <div className="container hero-shell">
        <div className="hero-copy reveal">
          <h1 className="animate-delay-1">
            Remodelación, mantenimiento e imagen comercial para hogares y
            negocios.
          </h1>

          <div className="hero-divider" aria-hidden="true"></div>

          <p className="hero-subtitle animate-delay-2">
            Ayudamos a empresas y clientes particulares a mejorar, adaptar y
            mantener sus espacios con atención profesional, experiencia y
            respuesta rápida en Guadalajara y zona metropolitana.
          </p>

          <div className="hero-actions">
            <a
              className="btn btn-primary hero-primary-btn animate-delay-3"
              href="#contacto"
              onClick={onQuoteRequest}
            >
              Solicitar cotización
            </a>
            <a
              className="btn btn-outline hero-secondary-btn animate-delay-3"
              href="#proyectos"
            >
              <span>Ver proyectos</span>
              <span className="hero-btn-arrow" aria-hidden="true">
                {"->"}
              </span>
            </a>
            <a
              className="btn btn-ghost hero-contact-btn animate-delay-3"
              href={HERO_WHATSAPP_HREF}
              target="_blank"
              rel="noreferrer"
            >
              <span className="hero-whatsapp-icon" aria-hidden="true">
                <img src="/assets/projects/whatsIcono.png" alt="" />
              </span>
              <span>WhatsApp directo</span>
            </a>
          </div>
        </div>

        <div className="hero-showcase reveal">
          <div className="hero-stage">
            <div className="hero-stage-panel hero-stage-plan">
              <div className="hero-blueprint" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="hero-stage-panel hero-stage-vertical">
              <div className="hero-stage-vertical-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(HeroSection);
