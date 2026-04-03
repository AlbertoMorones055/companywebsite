import React, { useEffect, useRef, useState } from "react";

const HERO_FALLBACK_IMAGE = "/assets/projects/remodelaciones1.5.webp";
const HERO_FALLBACK_IMAGE_MOBILE = "/assets/projects/remodelaciones1.5-mobile.webp";
const HERO_VIDEO_DESKTOP = "/assets/videos/videoHero-ios.mp4";
const HERO_VIDEO_MOBILE = "/assets/videos/videoHero-mobile-10s.mp4";
const HERO_VIDEO_START_TIME_DESKTOP = 8;
const HERO_VIDEO_START_TIME_MOBILE = 0;

function HeroSection({ onMediaReady }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
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
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    function handleViewportChange(event) {
      setIsMobileViewport(event.matches);
    }

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
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

    video.load();

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
  }, [startTime]);

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

        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop={false}
          playsInline
          preload="auto"
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
            Haz que tu espacio refleje calidad desde el primer vistazo. <br />
          </h1>

          <div className="hero-divider" aria-hidden="true"></div>

          <span className="hero-badge animate-delay-2">
            Más de 17 años de experiencia en proyectos comerciales y
            residenciales.
          </span>
          <div className="hero-actions">
            <a
              className="btn btn-primary hero-primary-btn animate-delay-3"
              href="#contacto"
            >
              Solicitar cotización
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
