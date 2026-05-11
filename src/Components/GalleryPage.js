import { useEffect, useRef, useState } from 'react';
import ArrowSvg from '../pictures/Rodykle.svg';
import PlasmaBg from '../pictures/Plasma3.1.svg';
import MobilePlasmaBg from '../pictures/MobilePlasma3.1.svg';
import PlasmaCorner from '../pictures/Plasma3.2.svg';
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

/* Corner frame */
function CornerFrame() {
  return (
    <>
      <svg className="about-corner about-corner--tl" viewBox="0 0 24 24" fill="none">
        <path d="M2 22V2h20" stroke="var(--red)" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--tr" viewBox="0 0 24 24" fill="none">
        <path d="M2 22V2h20" stroke="var(--red)" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--br" viewBox="0 0 24 24" fill="none">
        <path d="M22 2v20H2" stroke="var(--red)" strokeWidth="2" />
      </svg>
      <svg className="about-corner about-corner--bl" viewBox="0 0 24 24" fill="none">
        <path d="M22 2v20H2" stroke="var(--red)" strokeWidth="2" />
      </svg>
    </>

  );
}

/* Media slot */
function MediaSlot({ src, onUpload, animDelay, type = 'image', style = {}, parallax = false }) {
  const isVideo = type === 'video';
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!parallax || !mediaRef.current) return;
    const el = mediaRef.current;

    const tick = () => {
      const parent = el.closest('[data-hx]');
      if (parent) {
        const hx = parseFloat(parent.getAttribute('data-hx') || 0);
        const panel = el.closest('[data-si]');
        const si = parseInt(panel?.getAttribute('data-si') || 0);
        const panelW = window.innerWidth;

        // Calculate relative position of panel in viewport
        const relX = (si * panelW) - hx;
        // Apply subtle parallax shift
        const shift = relX * 0.15;
        el.style.transform = `translateX(${shift}px) scale(1.15)`;
      }
      requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parallax]);

  return (
    <div
      className="gal-item-anim"
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        animationDelay: `${animDelay}s`,
        background: 'rgba(0,0,0,0.3)',
        ...style,
      }}

    >
      <div
        ref={mediaRef}
        style={{ width: '100%', height: '100%', transition: 'none', willChange: 'transform' }}
      >
        {src ? (
          <>
            {isVideo
              ? <video src={src} autoPlay loop muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              : <img src={src} alt="" draggable="false"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
            }

          </>
        ) : (
          <div className="gal-photo-empty" style={{ width: '100%', height: '100%' }}>
            <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
              <rect x="2" y="2" width="44" height="44" stroke="var(--red)" strokeWidth="1.5" strokeDasharray="5 3" />
              <path d="M24 14v20M14 24h20" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 11, opacity: 0.5 }}>
              {isVideo ? 'Prideti video' : 'Prideti nuotrauka'}
            </span>
          </div>
        )}
      </div>
      {!isVideo && <CornerFrame />}

    </div>
  );
}


/* One horizontal panel — Desktop */
function Panel({ section, si, total, isMobile, onUpload }) {
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
      className="gal-panel-wrapper-tablet"
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderLeft: 'none',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Slide Counter — desktop: absolute; tablet: static (via CSS) */}
      <div className="gal-slide-counter" style={{
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

      {/* Inner row wrapper — tablet makes this column-child */}
      <div className="gal-panel-inner-tablet" style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>

        {/* LEFT: red line + title */}
        <div className="gal-panel-title-col" style={{
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

        {/* RIGHT: media */}
        <div className="gal-panel-media" style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 56px 24px 0',
          boxSizing: 'border-box',
        }}>
          {isGrid ? (
            <div ref={mediaRef} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              width: '100%',
              maxWidth: 920,
            }}>
              {section.photos.map((src, pi) => (
                <MediaSlot
                  key={pi}
                  src={src}
                  animDelay={0.08 + pi * 0.07}
                  type="video"
                  parallax={false}
                  style={{ aspectRatio: '16/10', width: '100%' }}
                />
              ))}
            </div>
          ) : (
            <div ref={mediaRef} style={{ width: '100%', maxWidth: 1000 }}>
              <MediaSlot
                src={section.photos[0]}
                onUpload={() => onUpload(`${si}_0`)}
                animDelay={0.1 + si * 0.07}
                type="image"
                parallax={false}
                style={{ width: '100%', aspectRatio: '16/9' }}
              />
            </div>
          )}
        </div>{/* end gal-panel-media */}

      </div>{/* end gal-panel-inner-tablet */}
    </div>
  );
}

/* One mobile horizontal panel — compact, vertical stack */
function MobilePanel({ section, si }) {
  const isGrid = section.type === 'grid-video';

  return (
    <div
      data-si={si}
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        padding: '20px 20px 12px',
        scrollSnapAlign: 'start',
        overflow: 'hidden',
      }}
    >
      {/* Level title */}
      <h3 style={{
        fontFamily: 'var(--ff-mono)',
        fontSize: '1.8em',
        color: '#fff',
        margin: '4px 0 0 0',
        letterSpacing: '0.05em',
        lineHeight: 1.1,
        alignSelf: 'flex-start',
        flexShrink: 0,
        zIndex: 10,
      }}>
        {section.title}
      </h3>

      {/* Media — centered */}
      <div style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
      }}>
        {isGrid ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
            width: '100%',
          }}>
            {section.photos.map((src, pi) => (
              <MediaSlot
                key={pi}
                src={src}
                animDelay={0.08 + pi * 0.07}
                type="video"
                parallax={false}
                style={{ aspectRatio: '16/10', width: '100%' }}
              />
            ))}
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <MediaSlot
              src={section.photos[0]}
              animDelay={0.1 + si * 0.07}
              type="image"
              parallax={false}
              style={{ width: '100%', aspectRatio: '16/9' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}



/* Scroll hint arrows */
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
          <path d="M1 7h14M10 2l6 5-6 5" stroke="var(--red)" strokeWidth="1.8"
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

export default function GalleryPage({ project, onBack, isMobile }) {
  const [visible, setVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const wrapRef = useRef(null);   // outer wrapper — translated vertically
  const heroRef = useRef(null);   // hero + stats block
  const stripRef = useRef(null);   // horizontal panels — translated horizontally
  const progressRef = useRef(null);   // progress bar fill
  const stateRef = useRef({       // mutable scroll state (no re-render needed)
    targetY: 0,
    currentY: 0,
    raf: null,
  });


  const data = GALLERY_DATA[project.id] || { sections: [] };
  const panelCount = data.sections.length;

  useEffect(() => { setVisible(true); }, []);

  /* ── DESKTOP: scroll hijack via RAF + translateX/Y ── */
  useEffect(() => {
    if (!visible || isMobile) return;

    const wrap = wrapRef.current;
    const hero = heroRef.current;
    const strip = stripRef.current;
    if (!wrap || !hero || !strip) return;

    // Lock page scroll — we drive everything ourselves
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const heroH = hero.offsetHeight;
    const panelW = window.innerWidth;
    const maxHoriz = (panelCount - 1) * panelW; // max translateX for strip
    const maxY = heroH + maxHoriz;           // total fake scroll distance

    const s = stateRef.current;
    s.targetY = 0;
    s.currentY = 0;

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const tick = () => {
      // Smooth ease toward target
      s.currentY += (s.targetY - s.currentY) * 0.1;

      const progress = clamp(s.currentY / maxY, 0, 1);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (s.currentY < heroH) {
        // ── Vertical phase: move scroller UP
        wrap.style.transform = `translate3d(0, ${-s.currentY}px, 0)`;
        strip.style.transform = 'translate3d(0, 0, 0)';
      } else {
        // ── Horizontal phase: lock scroller at hero height, move strip sideways
        wrap.style.transform = `translate3d(0, ${-heroH}px, 0)`;
        const hx = clamp(s.currentY - heroH, 0, maxHoriz);
        strip.style.transform = `translate3d(${-hx}px, 0, 0)`;

        // Pass horizontal offset to panels for parallax
        strip.setAttribute('data-hx', hx);

        if (!showHint) setShowHint(true);
      }

      s.raf = requestAnimationFrame(tick);
    };


    const onWheel = (e) => {
      e.preventDefault();
      // Combine Y and X deltas for trackpad support
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.targetY = clamp(s.targetY + delta, 0, maxY);
    };


    s.raf = requestAnimationFrame(tick);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('wheel', onWheel);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (wrap) wrap.style.transform = '';
      if (strip) strip.style.transform = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isMobile, panelCount]);

  /* ── MOBILE: Native horizontal scroll with snap ── */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !isMobile) return;

    // Show scroll hint initially
    setShowHint(true);

    const onScroll = () => {
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const progress = maxScroll > 0 ? strip.scrollLeft / maxScroll : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      // Hide hint once user starts scrolling
      if (progress > 0.05) {
        setShowHint(false);
      }
    };

    strip.addEventListener('scroll', onScroll, { passive: true });
    // Initialize progress bar
    onScroll();

    return () => strip.removeEventListener('scroll', onScroll);
  }, [visible, isMobile]);


  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    return (
      <>
        <div
          className={`gal-page ${visible ? 'gal-page--vis' : ''}`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'linear-gradient(to bottom, #260801 80%, #59220E 100%)',
          }}
        >
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* ── MobilePlasma3.1: hero image — fits fully, no crop ── */}
            <div style={{
              position: 'relative',
              width: '100%',
              flexShrink: 0,
            }}>
              <img
                src={MobilePlasmaBg}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  objectPosition: 'top right',
                  pointerEvents: 'none',
                }}
              />
              {/* Back button overlaid on Plasma */}
              <button
                className="gal-back-v"
                onClick={onBack}
                style={{ position: 'absolute', top: 16, left: 16, zIndex: 20 }}
              >
                <img src={ArrowSvg} alt="Atgal" style={{ width: 40, height: 40, transform: 'scaleX(-1)' }} />
              </button>
              {/* Red top line */}
              <div style={{
                position: 'absolute',
                top: 64,
                left: 0,
                right: 0,
                height: 1,
                background: 'rgba(216,72,32,0.7)',
                zIndex: 10,
              }} />
            </div>

            {/* ── Info block: title + two red lines + stats ── */}
            <div style={{
              flexShrink: 0,
              padding: '4px 20px 0',
              position: 'relative',
              zIndex: 10,
            }}>
              <h1 style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: '2.55rem',
                fontWeight: 100,
                color: '#fff',
                margin: '0 0 8px 0',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                NUOTRAUKŲ GALERIJA
              </h1>
              <div style={{ height: 1, background: 'rgba(216,72,32,0.6)', marginBottom: 8 }} />
              <div className="project-info-grid" style={{ margin: '6px 0' }}>
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
              <div style={{ height: 1, background: 'rgba(216,72,32,0.6)', marginTop: 8 }} />
            </div>

            {/* ── Horizontal scroll strip ── */}
            <div
              ref={stripRef}
              style={{
                flexShrink: 0,
                display: 'flex',
                overflowX: 'scroll',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                position: 'relative',
                zIndex: 1,
                minHeight: 280,
                paddingBottom: 40,
              }}
            >
              <style>{`.gal-mobile-strip-inner::-webkit-scrollbar { display: none; }`}</style>
              {data.sections.map((section, si) => (
                <MobilePanel
                  key={si}
                  section={section}
                  si={si}
                />
              ))}
            </div>

            {/* ── Plasma3.2: bottom left corner decoration ── */}
            <div style={{ marginTop: 'auto', position: 'relative', width: '100%', height: 0, zIndex: 0 }}>
              <img
                src={PlasmaCorner}
                alt=""
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100vw',
                  maxWidth: 300,
                  pointerEvents: 'none',
                  opacity: 1,
                }}
              />
            </div>

            <ScrollHint visible={showHint} />

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
                  width: '100%',
                  height: '100%',
                  background: '#bf360f',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                  willChange: 'transform',
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* FIXED BACKGROUND & GRADIENT CONTAINER — DESKTOP */}
      <div className={`gal-page ${visible ? 'gal-page--vis' : ''}`} style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #260801 80%, #59220E 100%)',
      }}>
        {/* Plasma bg */}
        <img
          src={PlasmaBg}
          alt=""
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '60%', height: '100%',
            objectFit: 'contain',
            objectPosition: 'right top',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Back button — fixed, always top-left regardless of scroll */}
        <button className="gal-back-v gal-back-fixed" onClick={onBack}>
          <img src={ArrowSvg} alt="Atgal" style={{ width: 48, height: 48, transform: 'scaleX(-1)' }} />
        </button>

        {/* SCROLLER WRAPPER — only translates its content */}
        <div
          ref={wrapRef}
          style={{
            width: '100%',
            willChange: 'transform',
          }}
        >
          {/* ── HERO + STATS ── */}
          <div ref={heroRef} className="gal-hero-wrap-tablet" style={{ position: 'relative', zIndex: 10 }}>
            <div className="gal-hero-v">
              <h1 className="gal-hero-title-v" style={{ fontFamily: 'var(--ff-mono)', letterSpacing: '0.04em' }}>
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

          {/* ── HORIZONTAL STRIP ── */}
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
                isMobile={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint — only desktop */}
      {!isMobile && <ScrollHint visible={showHint} />}

      {/* Progress Bar — Desktop + Tablet */}
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
            background: 'var(--red)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
            willChange: 'transform',
          }}
        />
      </div>
    </>

  );
}