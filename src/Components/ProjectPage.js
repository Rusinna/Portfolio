import { useEffect, useRef, useState } from 'react';
import GalleryPage from './GalleryPage';
import ArrowSvg from '../pictures/Rodykle.svg';

export default function ProjectPage({ project, onBack }) {
  const [showGallery, setShowGallery] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const videoRef = useRef(null);

  useEffect(() => {
    setLoaded(true);
    setEntered(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (showGallery) {
    return <GalleryPage project={project} onBack={() => setShowGallery(false)} />;
  }

  return (
    <div className={`project-page ${loaded ? 'loaded' : ''} ${isMobile ? 'is-mobile' : ''}`}>
      {/* Background for Desktop / Fallback for Mobile */}
      <div className="project-bg">
        {project.video && !isMobile ? (
          <video
            ref={videoRef}
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            className="project-bg-video"
          />
        ) : (
          <div className="project-bg-fallback" style={{ background: project.bgColor || '#0c161a' }}>
            {/* Animuotas SVG fonas */}
            <svg width="100%" height="100%" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="pgrd" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#d84820" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#080b1a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1200" height="700" fill="url(#pgrd)" />
              {Array.from({ length: 6 }, (_, i) => (
                <circle key={i} cx={200 + i * 160} cy={350} r={80 + i * 20}
                  stroke="#d84820" strokeWidth="0.5" fill="none" opacity="0.1">
                  <animate attributeName="r" values={`${80 + i * 20};${110 + i * 20};${80 + i * 20}`}
                    dur={`${4 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.05;0.2;0.05"
                    dur={`${4 + i}s`} repeatCount="indefinite" />
                </circle>
              ))}
              {/* Grid */}
              {Array.from({ length: 20 }, (_, i) => (
                <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="700"
                  stroke="rgba(184,205,216,0.04)" strokeWidth="1" />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 64} x2="1200" y2={i * 64}
                  stroke="rgba(184,205,216,0.04)" strokeWidth="1" />
              ))}
            </svg>
          </div>
        )}
        {/* Overlay */}
        <div className="project-bg-overlay" />
      </div>

      {/* Turinys */}
      <div className="project-content">
        {/* Atgal mygtukas (Top Left Arrow) */}
        <button className={`project-back ${entered ? 'anim-in' : ''}`} onClick={onBack}>
          <img
            src={ArrowSvg}
            alt="Atgal"
            className="project-back-arrow"
            style={{
              width: 48,
              height: 48,
              filter: isMobile ? 'sepia(1) saturate(10) hue-rotate(-30deg)' : 'none'
            }}
          />
        </button>

        {/* Red top line — mobile only */}
        <div className={`project-top-line ${entered ? 'anim-in' : ''}`} />

        <div className={`project-title-container ${entered ? 'anim-in' : ''}`}>
          {project.titleSvg ? (
            <img
              src={project.titleSvg}
              alt={project.title}
              className={`project-title-img ${project.id === 'p2' ? 'project-title-img--small' : ''}`}
            />
          ) : (
            <h1 className="project-title">{project.title}</h1>
          )}
        </div>

        {/* Mobile Inline Video */}
        {isMobile && project.video && (
          <div className={`project-mobile-video-wrap ${entered ? 'anim-in' : ''}`}>
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              className="project-mobile-video"
            />
          </div>
        )}

        <div className={`project-separator ${entered ? 'anim-in' : ''}`} />

        <div className={`project-info-grid ${entered ? 'anim-in' : ''}`}>
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

        <div className={`project-desc-full ${entered ? 'anim-in' : ''}`}>
          {(project.fullDesc || project.desc || '').split('\n').map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
        </div>


        {/* Link to Gallery + Original Arrow (Bottom Right) */}
        <div className={`project-gallery-link-wrap ${entered ? 'anim-in' : ''}`}>
          <span className="project-gallery-label">NUOTRAUKŲ GALERIJA</span>
          <button className="project-gallery-nav-btn" onClick={() => setShowGallery(true)}>
            <img
              src={ArrowSvg}
              alt="Į galeriją"
              className="project-gallery-arrow"
              style={{
                width: 48,
                height: 48,
                filter: isMobile ? 'sepia(1) saturate(10) hue-rotate(-30deg)' : 'none'
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile background decor */}
      {isMobile && (
        <div className="project-mobile-decor">
          <svg viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0,150 Q100,100 200,150 T400,150 V200 H0 Z" fill="#bf300f" opacity="0.1" />
            <path d="M0,170 Q150,120 300,170 T400,170 V200 H0 Z" fill="#bf300f" opacity="0.2" />
          </svg>
        </div>
      )}
    </div>
  );
}