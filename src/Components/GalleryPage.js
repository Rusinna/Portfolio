import { useEffect, useRef, useState } from 'react';
import ArrowSvg from '../pictures/Rodykle.svg';
import PlasmaBg from '../pictures/Plasma3.1.svg';
import Plasma32 from '../pictures/Plasma3.2.svg';
import Keeper1 from '../pictures/Keeper1.png';
import Keeper2 from '../pictures/Keeper2.png';
import Keeper3 from '../pictures/Keeper3.png';
import P2d1 from '../pictures/2d1.png';
import P2d from '../pictures/2d.png';
import P3d1 from '../pictures/3d1.png';
import P3d from '../pictures/3d.png';
import V125 from '../pictures/0001-0125.mp4';
import V250 from '../pictures/0001-0250.mp4';
import V060 from '../pictures/0001-0060.mp4';
import V240 from '../pictures/0001-0240.mp4';

const GALLERY_DATA = {
  p1: {
    sections: [
      { title: '1 LYGIS', photos: [P2d1], type: 'image' },
      { title: '2 LYGIS', photos: [P2d], type: 'image' },
    ]
  },
  p3: {
    sections: [
      { title: '1 LYGIS', photos: [P3d1], type: 'image' },
      { title: '2 LYGIS', photos: [P3d], type: 'image' },
    ]
  },
  p2: {
    sections: [
      { title: '3D OBJEKTAI', photos: [V125, V250, V060, V240], type: 'grid-video' },
      { title: '1 LYGIS', photos: [Keeper1], type: 'image' },
      { title: '2 LYGIS', photos: [Keeper2], type: 'image' },
      { title: '3 LYGIS', photos: [Keeper3], type: 'image' },
    ]
  },
};

/* ── Corner frame ──────────────────────────────────────────────────────────── */
function CornerFrame() {
  return (
    <>
      <svg className="about-corner about-corner--tl" viewBox="0 0 24 24" fill="none">
        <path d="M2 22V2h20" stroke="#d84820" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--tr" viewBox="0 0 24 24" fill="none">
        <path d="M2 22V2h20" stroke="#d84820" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--br" viewBox="0 0 24 24" fill="none">
        <path d="M22 2v20H2" stroke="#d84820" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--bl" viewBox="0 0 24 24" fill="none">
        <path d="M22 2v20H2" stroke="#d84820" strokeWidth="2" />
      </svg>
    </>
  );
}

/* ── Desktop MediaSlot — no parallax, solid black bg, objectFit contain ─────── */
function MediaSlot({ src, animDelay, type = 'image', style = {} }) {
  const isVideo = type === 'video';

  return (
    <div
      className="gal-item-anim"
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        animationDelay: `${animDelay}s`,
        /* Solid black so letterbox areas are clean black fill */
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {src ? (
        isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          /* objectFit: contain → full image always visible, black bars fill the rest */
          <img
            src={src}
            alt=""
            draggable="false"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        )
      ) : (
        <div
          className="gal-photo-empty"
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
            <rect x="2" y="2" width="44" height="44" stroke="#bf360f" strokeWidth="1.5" strokeDasharray="5 3" />
            <path d="M24 14v20M14 24h20" stroke="#bf360f" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, opacity: 0.5 }}>
            {isVideo ? 'Prideti video' : 'Prideti nuotrauka'}
          </span>
        </div>
      )}
      {!isVideo && <CornerFrame />}
    </div>
  );
}

/* ── Desktop Panel — one horizontal slide ─────────────────────────────────── */
function Panel({ section, si, total }) {
  const isGrid = section.type === 'grid-video';
  const mediaRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      if (mediaRef.current && lineRef.current) {
        lineRef.current.style.height = mediaRef.current.offsetHeight + 'px';
      }
    };
    const t = setTimeout(sync, 80);
    window.addEventListener('resize', sync);
    const els = mediaRef.current?.querySelectorAll('img,video') || [];
    els.forEach(el => {
      el.addEventListener('load', sync);
      el.addEventListener('loadedmetadata', sync);
    });
    return () => { clearTimeout(t); window.removeEventListener('resize', sync); };
  }, []);

  return (
    <div
      data-si={si}
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderLeft: si === 0 ? 'none' : '2px solid rgba(191,54,15,0.45)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Slide Counter */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 64,
        fontFamily: 'var(--ff-mono)',
        fontSize: 18,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.1em',
        zIndex: 5,
      }}>
        <span style={{ color: '#fff' }}>{(si + 1).toString().padStart(2, '0')}</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{total.toString().padStart(2, '0')}</span>
      </div>

      {/* LEFT: red line + title */}
      <div style={{
        width: '28%',
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px 0 64px',
        gap: 22,
        boxSizing: 'border-box',
      }}>
        <div ref={lineRef} style={{
          width: 1,
          height: 200,
          background: '#bf300f',
          flexShrink: 0,
          boxShadow: '0 0 15px rgba(191, 48, 15, 0.4)',
        }} />
        <h3 style={{
          fontFamily: 'var(--ff-mono)',
          fontSize: '3.5em',
          color: '#fff',
          margin: 0,
          letterSpacing: '0.05em',
          lineHeight: 1.1,
        }}>
          {section.title}
        </h3>
      </div>

      {/* RIGHT: media — centered with equal horizontal padding */}
      <div style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* Equal padding on both sides keeps media centred in the remaining space */
        padding: '24px 48px',
        boxSizing: 'border-box',
      }}>
        {isGrid ? (
          /* Videos: reduced max-width + smaller gap → drawn tighter together toward centre */
          <div ref={mediaRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            width: '100%',
            maxWidth: 700,
          }}>
            {section.photos.map((src, pi) => (
              <MediaSlot
                key={pi}
                src={src}
                animDelay={0.08 + pi * 0.07}
                type="video"
                style={{ aspectRatio: '16/10', width: '100%' }}
              />
            ))}
          </div>
        ) : (
          /* Images: no parallax, full image visible with black letterbox */
          <div ref={mediaRef} style={{
            width: '100%',
            maxWidth: 980,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MediaSlot
              src={section.photos[0]}
              animDelay={0.1 + si * 0.07}
              type="image"
              style={{ width: '100%', aspectRatio: '16/9' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Scroll hint arrows ────────────────────────────────────────────────────── */
function ScrollHint({ visible }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 4,
      opacity: visible ? 0.7 : 0,
      transition: 'opacity 0.5s',
      pointerEvents: 'none',
      zIndex: 310,
    }}>
      {[0, 1, 2].map(i => (
        <svg key={i} width="20" height="14" viewBox="0 0 20 14" fill="none"
          style={{
            animation: 'galHintBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        >
          <path d="M1 7h14M10 2l6 5-6 5" stroke="#d84820" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
      <style>{`
        @keyframes galHintBounce {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50%       { transform: translateX(5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function GalleryPage({ project, onBack, isMobile: isMobileProp }) {
  /* Self-detect isMobile if the prop is not passed from parent */
  const [isMobile, setIsMobile] = useState(() =>
    isMobileProp !== undefined ? isMobileProp : window.innerWidth <= 768
  );

  const [visible, setVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [, setPhotos] = useState({});

  const wrapRef     = useRef(null);
  const heroRef     = useRef(null);
  const stripRef    = useRef(null);
  const progressRef = useRef(null);
  const stateRef    = useRef({ targetY: 0, currentY: 0, raf: null });

  const data       = GALLERY_DATA[project.id] || { sections: [] };
  const panelCount = data.sections.length;

  useEffect(() => { setVisible(true); }, []);

  /* Keep isMobile in sync with prop changes or window resize */
  useEffect(() => {
    if (isMobileProp !== undefined) {
      setIsMobile(isMobileProp);
      return;
    }
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileProp]);

  /* ── DESKTOP: scroll hijack via RAF + translateX/Y ──────────────────────── */
  useEffect(() => {
    if (!visible || isMobile) return;

    const wrap  = wrapRef.current;
    const hero  = heroRef.current;
    const strip = stripRef.current;
    if (!wrap || !hero || !strip) return;

    document.body.style.overflow        = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const heroH    = hero.offsetHeight;
    const panelW   = window.innerWidth;
    const maxHoriz = (panelCount - 1) * panelW;
    const maxY     = heroH + maxHoriz;

    const s = stateRef.current;
    s.targetY  = 0;
    s.currentY = 0;

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const tick = () => {
      s.currentY += (s.targetY - s.currentY) * 0.1;

      const progress = clamp(s.currentY / maxY, 0, 1);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (s.currentY < heroH) {
        /* Vertical phase: scroll hero section up */
        wrap.style.transform  = `translate3d(0, ${-s.currentY}px, 0)`;
        strip.style.transform = 'translate3d(0, 0, 0)';
      } else {
        /* Horizontal phase: lock scroller, move strip sideways */
        wrap.style.transform = `translate3d(0, ${-heroH}px, 0)`;
        const hx = clamp(s.currentY - heroH, 0, maxHoriz);
        /*
         * Images stay fixed inside their panel — no extra translateX applied
         * to media elements (parallax removed). The strip itself moves left;
         * individual panels are stationary within the strip.
         */
        strip.style.transform = `translate3d(${-hx}px, 0, 0)`;
        strip.setAttribute('data-hx', hx);
        if (!showHint) setShowHint(true);
      }

      s.raf = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.targetY = clamp(s.targetY + delta, 0, maxY);
    };

    s.raf = requestAnimationFrame(tick);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('wheel', onWheel);
      document.body.style.overflow        = '';
      document.documentElement.style.overflow = '';
      if (wrap)  wrap.style.transform  = '';
      if (strip) strip.style.transform = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isMobile, panelCount]);

  /* ══════════════════════════════════════════════════════════════════════════
     MOBILE RENDER
     — Single fixed page, no scrolling, all sections visible at once.
     — Back arrow identical to ProjectPage.js (red filter, no scaleX flip).
     — Level titles above their photo, left-aligned.
     — Images centred and fully visible (objectFit: contain + black bg).
     — PlasmaBg reduced to ~50 % width (top-right).
     — Plasma3.2 added bottom-left.
  ══════════════════════════════════════════════════════════════════════════ */
  if (isMobile) {
    const videoSections = data.sections.filter(s => s.type === 'grid-video');
    const imageSections = data.sections.filter(s => s.type === 'image');

    return (
      <div
        className={`gal-page ${visible ? 'gal-page--vis' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #260801 80%, #59220E 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* PlasmaBg — top-right, reduced to ~50 % width */}
        <img
          src={PlasmaBg}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: 'auto',
            maxHeight: '45vh',
            objectFit: 'contain',
            objectPosition: 'right top',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Plasma3.2 — bottom-left corner */}
        <img
          src={Plasma32}
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '45%',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'left bottom',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Hero area ──────────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 10, flexShrink: 0, padding: '0 24px' }}>
          {/* Back button — same styling as ProjectPage.js mobile arrow */}
          <button
            className="project-back"
            onClick={onBack}
            style={{ position: 'absolute', top: 20, left: 20 }}
          >
            <img
              src={ArrowSvg}
              alt="Atgal"
              className="project-back-arrow"
              style={{
                width: 48,
                height: 48,
                /* Red/orange tint — identical to ProjectPage.js mobile filter */
                filter: 'sepia(1) saturate(10) hue-rotate(-30deg)',
              }}
            />
          </button>

          {/* Red top line (same as ProjectPage mobile) */}
          <div style={{
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(216,72,32,0.7)',
            zIndex: 10,
          }} />

          <h1 style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: '1.9rem',
            color: '#fff',
            marginTop: 84,
            marginBottom: 6,
            letterSpacing: '0.04em',
          }}>NUOTRAUKŲ GALERIJA</h1>

          {/* Stats between red lines */}
          <div style={{ height: 1, background: 'rgba(216,72,32,0.6)', marginBottom: 4 }} />
          <div className="project-info-grid" style={{ margin: '4px 0' }}>
            <div className="project-info-item">
              <span className="project-info-label">Žanras</span>
              <span className="project-info-val">{project.genre}</span>
            </div>
            <div className="project-info-item">
              <span className="project-info-label">Metai</span>
              <span className="project-info-val">{project.year}</span>
            </div>
            <div className="project-info-item">
              <span className="project-info-label">Lygiai</span>
              <span className="project-info-val">{project.levels}</span>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(216,72,32,0.6)', marginTop: 4 }} />
        </div>

        {/* ── Sections area — fills remaining height, no overflow ─────────── */}
        <div style={{
          flex: 1,
          position: 'relative',
          zIndex: 10,
          padding: '8px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflow: 'hidden',
          minHeight: 0,
        }}>

          {/* Video grid sections (e.g. 3D OBJEKTAI) */}
          {videoSections.map((section, i) => (
            <div key={i} style={{ flexShrink: 0 }}>
              <div style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: '0.8rem',
                color: '#fff',
                marginBottom: 4,
                letterSpacing: '0.05em',
                textAlign: 'left',
              }}>
                {section.title}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 5,
              }}>
                {section.photos.map((src, pi) => (
                  <video
                    key={pi}
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      objectFit: 'contain',
                      background: '#000',
                      display: 'block',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Image sections — side-by-side columns, titles above on the left */}
          {imageSections.length > 0 && (
            <div style={{
              flex: 1,
              display: 'flex',
              gap: 8,
              minHeight: 0,
              alignItems: 'stretch',
            }}>
              {imageSections.map((section, i) => (
                <div key={i} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  minHeight: 0,
                }}>
                  {/* Title above image, left-aligned */}
                  <div style={{
                    fontFamily: 'var(--ff-mono)',
                    fontSize: '0.75rem',
                    color: '#fff',
                    marginBottom: 4,
                    letterSpacing: '0.05em',
                    textAlign: 'left',
                    flexShrink: 0,
                  }}>
                    {section.title}
                  </div>

                  {/* Image — centred, full image visible, black letterbox */}
                  <div style={{
                    flex: 1,
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                  }}>
                    <img
                      src={section.photos[0]}
                      alt=""
                      draggable="false"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     DESKTOP RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* Fixed background + main container */}
      <div
        className={`gal-page ${visible ? 'gal-page--vis' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #260801 80%, #59220E 100%)',
        }}
      >
        {/* Plasma bg — desktop (unchanged size) */}
        <img
          src={PlasmaBg}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right top',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* SCROLLER WRAPPER — translates vertically, then horizontally */}
        <div
          ref={wrapRef}
          style={{ width: '100%', willChange: 'transform' }}
        >
          {/* ── HERO + STATS ────────────────────────────────────────────── */}
          <div ref={heroRef} style={{ position: 'relative', zIndex: 10 }}>
            <div className="gal-hero-v">
              <button className="gal-back-v" onClick={onBack}>
                <img
                  src={ArrowSvg}
                  alt="Atgal"
                  style={{ width: 48, height: 48, transform: 'scaleX(-1)' }}
                />
              </button>
              {/* Red top line — mobile only (CSS hides on desktop) */}
              <div className="gal-top-line" />
              <h1
                className="gal-hero-title-v"
                style={{ fontFamily: 'var(--ff-mono)', letterSpacing: '0.04em' }}
              >
                NUOTRAUKŲ GALERIJA
              </h1>
            </div>

            <div className="gal-stats-lines-wrap">
              <div className="gal-red-line" />
              <div className="project-info-grid" style={{ margin: '16px 0' }}>
                <div className="project-info-item">
                  <span className="project-info-label">Žanras</span>
                  <span className="project-info-val">{project.genre}</span>
                </div>
                <div className="project-info-item">
                  <span className="project-info-label">Metai</span>
                  <span className="project-info-val">{project.year}</span>
                </div>
                <div className="project-info-item">
                  <span className="project-info-label">Lygiai</span>
                  <span className="project-info-val">{project.levels}</span>
                </div>
              </div>
              <div className="gal-red-line" />
            </div>
          </div>

          {/* ── HORIZONTAL STRIP ────────────────────────────────────────── */}
          <div
            ref={stripRef}
            style={{
              display: 'flex',
              width: `${panelCount * 100}vw`,
              height: '100vh',
              overflow: 'hidden',
              willChange: 'transform',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {data.sections.map((section, si) => (
              <Panel
                key={si}
                section={section}
                si={si}
                total={panelCount}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint — desktop only */}
      <ScrollHint visible={showHint} />

      {/* Progress bar — desktop only */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 3,
        background: 'rgba(216, 72, 32, 0.1)',
        zIndex: 400,
      }}>
        <div
          ref={progressRef}
          style={{
            height: '100%',
            width: '100%',
            background: '#d84820',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
            willChange: 'transform',
          }}
        />
      </div>
    </>
  );
}