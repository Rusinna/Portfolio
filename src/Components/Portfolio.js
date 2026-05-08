import { useState, useEffect, useRef } from 'react';
import PlasmaCanvas from './PlasmaCanvas';
import GameMonitor from './GameMonitor';
import MarqueeStrip from './MarqueeStrip';
import ProjectPage from './ProjectPage';
import Logo from '../pictures/LOGO.svg';
import Zvaigzde from '../pictures/Zvaigzde.svg';
import Profile from '../pictures/profile.png';
import img2d from '../pictures/2d2.png';
import imgKeeper from '../pictures/Keeper_plakatas.png';
import img3d from '../pictures/3d2.png';
import IconMail from '../pictures/Gmail.svg';
import IconLinkedIn from '../pictures/LinkedIn.svg';

// Videos
import vidPlatformer from '../pictures/2D_platformeris.mp4';
import vidMaze from '../pictures/Tamsusis_labirintas.mp4';
import vidKeeper from '../pictures/Keeper_filmukas.mp4';

// SVG Titles
import titlePlatformer from '../pictures/PLATFORMINIS ŽAIDIMAS.svg';
import titleMaze from '../pictures/TAMSUSIS LABIRINTAS.svg';
import titleKeeper from '../pictures/KEEPER.svg';


// ── DATA ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '#about', label: 'Apie' },
  { href: '#projects', label: 'Projektai' },
  { href: '#contact', label: 'Kontaktai' },
];

const PROJECTS = [
  {
    id: 'p1', cat: '2d',
    title: '2D Platforminis Žaidimas',
    titleSvg: titlePlatformer,
    desc: "Dviejų lygių 2D platforminis žaidimas, sukurtas savarankiškai.",
    fullDesc: "Savarankiškai sukūriau dviejų lygių 2D platforminį žaidimą. Projekte kūriau žaidimo koncepciją, mechanikas, lygių dizainą ir programavimo logiką.\nVizualiniams elementams daugiausia naudojau sprite'us iš viešai prieinamų šaltinių, o dalį jų sukūriau pati.\nŠis projektas leido giliau suprasti žaidėjo patirties formavimą, fizikos principų taikymą ir lygių balansavimo procesą.",
    bgColor: '#0c161a',
    image: img2d,
    video: vidPlatformer,
    year: '2023',
    genre: 'PLATFORMERIS',
    levels: '2',
    gallery: [],
  },
  {
    id: 'p3', cat: '3d',
    title: 'Tamsusis Labirintas',
    titleSvg: titleMaze,
    desc: "Dviejų lygių pirmojo asmens 3D žaidimas, vykstantis tamsioje, riboto matomumo labirinto aplinkoje.",
    fullDesc: "„Tamsusis labirintas“ – 2 lygių pirmojo asmens 3D žaidimas, vykstantis tamsioje, riboto matomumo labirinto aplinkoje. Veikėjas turi pabėgti iš labirinto, kol yra sekamas pabaisos – šliaužiko.\nMano pagrindinis indėlis projekte apėmė 2 lygių žaidimo sukūrimą: programavimą ir tam tikrų vizualinių elementų kūrimą. Programavau pagrindines žaidimo sistemas: veikėjo judėjimą, labirinto logiką, susidūrimų sistemą bei žaidimo būsenų valdymą.\nDirbant komandoje integruoti Unity NavMesh komponentai, skirti šliaužiko navigacijai - veikėjo sekimui.",
    bgColor: '#0b0909',
    image: img3d,
    video: vidMaze,
    year: '2024',
    genre: 'GALVOSŪKIŲ',
    levels: '2',
    gallery: [],
  },
  {
    id: 'p2', cat: '3d',
    title: 'Keeper',
    titleSvg: titleKeeper,
    desc: 'Trijų lygių 3D galvosūkių žaidimas 2035 m. požeminėje sėklų saugykloje.',
    fullDesc: "„Keeper“ – trijų lygių 3D galvosūkių žaidimas, kurio veiksmas vyksta 2035 metais požeminėje kapsulėje. Žaidėjas valdo robotą Keep, kurio tikslas – sustabdyti dirbtinį intelektą Aurą ir išgelbėti vertingas augalų sėklas. Žaidimas turi naratyvą.\nKomandoje kūriau kai kuriuos 3D modelius bei programavau visą žaidimą.",
    bgColor: '#090d10',
    image: imgKeeper,
    video: vidKeeper,
    year: '2025',
    genre: 'GALVOSŪKIŲ',
    levels: '3',
    gallery: [],
  },
];


// ── PROJECT CARD ──────────────────────────────────────────────────────────────

function ProjectCard({ project, hidden, onClick }) {
  const [bgImg, setBgImg] = useState(project.image || null);

  return (
    <div
      className={`pcard${hidden ? ' pcard--hidden' : ''}`}
      onClick={() => !hidden && onClick(project)}
      role="button"
    >
      {/* SVG kampų rėmeliai */}
      <svg className="pcard-corner pcard-corner--tl" viewBox="0 0 24 24" fill="none">
        <path d="M2 22V2h20" stroke="#d84820" strokeWidth="2">
        </path>
      </svg>
      <svg className="pcard-corner pcard-corner--br" viewBox="0 0 24 24" fill="none">
        <path d="M22 2v20H2" stroke="#d84820" strokeWidth="2">
        </path>
      </svg>

      {/* Fonas */}
      <div className="pcard-bg" style={{
        backgroundColor: project.bgColor,
        backgroundImage: bgImg ? `url(${bgImg})` : 'none',
      }} />

      {/* Info */}
      <div className="pcard-info">
        <div className="pcard-cat">
          {project.catLabel}
        </div>
        <h3 className="pcard-title">{project.title}</h3>
        <p className="pcard-desc">{project.desc}</p>
      </div>


    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const curRef = useRef(null);
  const ringRef = useRef(null);
  const aPhotoRef = useRef(null);
  const aLayerRef = useRef(null);

  // Loader
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(id);
  }, []);



  // Nav scroll
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Custom cursor
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, rafId;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx + 'px';
        curRef.current.style.top = my + 'px';
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    const loop = () => {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); document.removeEventListener('mousemove', onMove); };
  }, []);

  // Cursor hover
  useEffect(() => {
    if (!loaded || activeProject) return;
    const add = () => { curRef.current?.classList.add('hov'); ringRef.current?.classList.add('hov'); };
    const rem = () => { curRef.current?.classList.remove('hov'); ringRef.current?.classList.remove('hov'); };
    document.querySelectorAll('a,button,.pcard,.pfbtn').forEach(el => {
      el.addEventListener('mouseenter', add);
      el.addEventListener('mouseleave', rem);
    });
  }, [loaded, activeProject]);

  // Scroll reveal
  useEffect(() => {
    if (!loaded || activeProject) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('vis')),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('vis');
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [loaded, activeProject]);

  // About photo parallax

  useEffect(() => {
    const wrap = aPhotoRef.current, layer = aLayerRef.current;
    if (!wrap || !layer) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, rafId;
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      tx = -((e.clientX - r.left) / r.width - 0.5) * 18;
      ty = -((e.clientY - r.top) / r.height - 0.5) * 12;
    };
    const loop = () => {
      cx = lerp(cx, tx, 0.08); cy = lerp(cy, ty, 0.08);
      layer.style.transform = `translate(${cx}px,${cy}px) scale(1.07)`;
      rafId = requestAnimationFrame(loop);
    };
    const onEnter = () => { rafId = requestAnimationFrame(loop); };
    const onLeave = () => { tx = 0; ty = 0; cancelAnimationFrame(rafId); };
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, []);


  // Jei aktyvus projektas – rodome ProjectPage
  if (activeProject) {
    return (
      <ProjectPage
        project={activeProject}
        onBack={() => setActiveProject(null)}
      />
    );
  }

  return (
    <>
      {/* LOADER */}
      <div className={`loader${loaded ? ' loader--done' : ''}`}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="34" stroke="#d84820" strokeWidth="1" strokeDasharray="8 5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 40 40" to="360 40 40" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="40" r="20" stroke="#b8cdd8" strokeWidth="0.5" strokeDasharray="3 7">
            <animateTransform attributeName="transform" type="rotate"
              from="360 40 40" to="0 40 40" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="40" r="5" fill="#d84820">
            <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div className="loader-bar"><div className="loader-bar-fill" /></div>
        <span className="loader-txt">Loading</span>
      </div>

      {/* CURSOR */}
      <div ref={curRef} id="cur" />
      <div ref={ringRef} id="cur-ring" />

      {/* ── NAV ── */}
      <nav className={`pnav${navScrolled ? ' pnav--sc' : ''}${navOpen ? ' pnav--open' : ''}`}>
        <div className="container-fluid pnav-inner">

          {/* Left: Logo */}
          <div className="pnav-left">
            <img src={Logo} alt="logo" style={{ height: 80, width: 80, objectFit: 'contain' }} />
          </div>

          {/* Center: Links */}
          <ul className={`pnav-links${navOpen ? ' open' : ''}`}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} onClick={() => setNavOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: Hamburger */}
          <div className="pnav-right">
            <button
              className={`pnav-hbg${navOpen ? ' open' : ''}`}
              onClick={() => setNavOpen(v => !v)}
              aria-label="Meniu"
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </nav>


      {/* ── HERO ── */}
      <section id="hero" style={{ position: 'relative' }}>
        {/* Plasma fonas */}
        <div className="hero-plasma">
          <PlasmaCanvas />
        </div>
        {/* Gradientai */}
        <div className="hero-grad-left" />
        <div className="hero-grad-bottom" />

        {/* Hero turinys */}
        <div className="container-fluid hero-container">
          <div className="hero-wrapper">
            <div className="row align-items-end hero-row">

              {/* KAIRĖ – tekstas */}
              <div className="col-lg-5 hero-left">

                <h1 className="hero-name">
                  RUSNĖ<br /><em>STANKEVIČIŪTĖ</em>
                </h1>
                <div className="px-3 px-lg-0">
                  <div className="hero-specs">
                    {['Žaidimų kūrėja', 'Programuotoja', '3D Modeliuotoja'].map((s, i) => (
                      <span key={i} className="hero-spec">
                        {i !== 0 && <img src={Zvaigzde} alt="" width="30" height="30" />}
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="hero-desc">
                    Kuriu interaktyvias 2D ir 3D žaidimų patirtis, jungiančias žaidimo
                    mechanikas, aplinkų kūrimą ir vizualinį pasakojimą.
                  </p>
                  <div className="hero-cta">
                    <a href="#projects" className="pbtn pbtn--fill">
                      Žiūrėti darbus
                    </a>
                    <a href="#contact" className="pbtn pbtn--outline">Susisiekti</a>
                  </div>
                </div>
              </div>

              {/* DEŠINĖ – žaidimas */}
              <div className="col-lg-7 hero-right">
                <GameMonitor />
              </div>
            </div>
          </div>
        </div>
        {/* ── MARQUEE (bottom) ── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 3 }}>
          <MarqueeStrip />
        </div>
      </section>



      {/* ── CONTENT WRAPPER ── */}
      <div className="content-bg-wrap">

        {/* ── APIE ── */}
        <section id="about">
          <div className="container-fluid" style={{ paddingLeft: 48, paddingRight: 48 }}>
            <div className="row">
              <div className="col-12">
                <h2 className="sec-title reveal">Apie mane</h2>
              </div>
            </div>
            <div className="row g-5">

              {/* Nuotrauka */}
              <div className="col-md-6 col-lg-5 reveal">
                <div className="about-photo-wrap" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                  {/* SVG kampų rėmeliai */}
                  <svg className="about-corner about-corner--tl" viewBox="0 0 24 24" fill="none">
                    <path d="M2 22V2h20" stroke="#d84820" strokeWidth="2"></path>
                  </svg>
                  <svg className="about-corner about-corner--br" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2v20H2" stroke="#d84820" strokeWidth="2"></path>
                  </svg>
                  <img src={Profile} alt="Rusnė Stankevičiūtė" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>


              {/* Tekstas */}
              <div className="col-lg-7 reveal" style={{ transitionDelay: '0.15s' }}>
                <div className="about-text">
                  <p>Esu Rusnė Stankevičiūtė – multimedijos ir kompiuterinio dizaino studentė Vilnius Tech universitete.</p>
                  <p>Domiuosi žaidimų kūrimo procesu nuo pirminės koncepcijos ir scenarijaus iki dvimatės ir trimatės aplinkos kūrimo bei žaidimo mechanikų.</p>
                  <p>Mano kūrybiniame kelyje yra tiek individualių, tiek komandinių projektų. Komandiniame darbe išmokau vertinti kiekvieno nario indėlį ir bendradarbiavimo svarbą, o savarankiški projektai padėjo atrasti savitą stilių – tamsų, minimalistinį ir futuristinį.</p>
                  <p>Laisvalaikiu giliniuosi į žaidimų dizaino teoriją ir ieškau įkvėpimo ten, kur susilieja technologijos ir menas.</p>
                </div>


              </div>
            </div>
          </div>
        </section>





        {/* ── PROJEKTAI ── */}
        <section id="projects">
          <div className="container-fluid" style={{ paddingLeft: 48, paddingRight: 48 }}>
            <h2 className="sec-title reveal">Projektai</h2>

            {/* Kortelės */}
            <div className="row g-4">
              {PROJECTS.map((p, i) => (
                <div key={p.id} className="col-md-6 col-lg-4 reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ProjectCard
                    project={p}
                    hidden={filter !== 'all' && filter !== p.cat}
                    onClick={setActiveProject}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── KONTAKTAI ── */}
        <section id="contact">
          <div className="container-fluid" style={{ paddingLeft: 48, paddingRight: 48 }}>
            {/* Title — full width */}
            <div className="row">
              <div className="col-12 reveal">
                <h2 className="contact-title">Susisiekime</h2>
              </div>
            </div>
            {/* Desc + Icons — same row, aligned top */}
            <div className="row align-items-start g-3 g-lg-5 flex-nowrap">
              <div className="col reveal">
                <p className="contact-desc">
                  Esu atvira komandiniams projektams, praktikai ir bet kokiam bendradarbiavimui
                  žaidimų dizaino, 3D modeliavimo ar vizualinio dizaino srityse. Rašykite – atsakysiu.
                </p>
              </div>

              <div className="col-auto reveal" style={{ transitionDelay: '0.15s' }}>
                <div className="contact-links-horizontal">
                  <a href="mailto:[www.rusnstan@gmail.com]" className="contact-link-button btn-mail">
                    <span className="contact-text">EL.PAŠTAS</span>
                    <img src={IconMail} alt="email" className="contact-icon" />
                  </a>

                  <a href="https://www.linkedin.com/in/rusn%C4%97-stankevi%C4%8Di%C5%ABt%C4%97-946b90261/" target="_blank" rel="noreferrer" className="contact-link-button btn-linkedin">
                    <span className="contact-text">LINKEDIN</span>
                    <img src={IconLinkedIn} alt="LinkedIn" className="contact-icon" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>
  );
}