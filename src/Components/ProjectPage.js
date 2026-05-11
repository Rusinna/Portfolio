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
    return <GalleryPage project={project} onBack={() => setShowGallery(false)} isMobile={isMobile} />;
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
          <div className="project-bg-fallback" style={{ background: project.bgColor || '#131026' }}></div>
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
    </div>
  );
}