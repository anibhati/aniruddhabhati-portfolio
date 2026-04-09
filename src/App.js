import React, { useState, useEffect, useRef } from 'react';
import { Menu, Mail, Github, Linkedin, X, ExternalLink, ChevronDown } from 'lucide-react';

// ============================================================
// CUSTOM HOOK - useInView
// ============================================================
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const animateIn = (inView, delay = '') =>
  `transition-all duration-1000 ${delay} ${
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
  }`;

// ============================================================
// TYPEWRITER
// ============================================================
const TypewriterEffect = ({ text, speed = 80, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-emerald-400">|</span>
    </span>
  );
};

// ============================================================
// PARTICLE BACKGROUND
// ============================================================
const ParticleBackground = () => {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.8 ? 2 : 1,
    delay: `${Math.random() * 4}s`,
    duration: `${2 + Math.random() * 3}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/20 animate-pulse"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// PHOTO BACKGROUND — Updated for better visibility
// ============================================================
const PhotoBackground = ({ opacity = 0.45 }) => (
  <div
    className="fixed inset-0 pointer-events-none"
    style={{ zIndex: 0 }}
  >
    <img
      src="/jeremy-bishop-uAfZBP-GtiA-unsplash.jpg"
      alt=""
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        opacity: opacity,
        filter: 'saturate(0.9) brightness(0.75)',
      }}
    />
    {/* Lightened gradient overlay to let the photo shine through */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(to bottom,
            rgba(3,13,6,0.65) 0%,
            rgba(3,13,6,0.2) 40%,
            rgba(3,13,6,0.2) 60%,
            rgba(3,13,6,0.7) 100%
          )
        `,
      }}
    />
    {/* Softer Vignette */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at center,
            transparent 50%,
            rgba(3,13,6,0.5) 100%
          )
        `,
      }}
    />
  </div>
);

// ============================================================
// SVG LEAF SILHOUETTES
// ============================================================
const LeafBackground = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0.05,
    }}
  >
    <ellipse cx="80" cy="120" rx="18" ry="55" stroke="#4ade80" strokeWidth="1" fill="none"
      transform="rotate(-30, 80, 120)" />
    <ellipse cx="120" cy="80" rx="14" ry="42" stroke="#34d399" strokeWidth="1" fill="none"
      transform="rotate(15, 120, 80)" />
    <ellipse cx="85%" cy="60" rx="20" ry="60" stroke="#4ade80" strokeWidth="1" fill="none"
      transform="rotate(25, 1200, 60)" />
    <ellipse cx="92%" cy="130" rx="12" ry="38" stroke="#6ee7b7" strokeWidth="1" fill="none"
      transform="rotate(-15, 1270, 130)" />
    <ellipse cx="40" cy="45%" rx="16" ry="50" stroke="#34d399" strokeWidth="1" fill="none"
      transform="rotate(-45, 40, 500)" />
    <ellipse cx="97%" cy="50%" rx="22" ry="65" stroke="#4ade80" strokeWidth="1" fill="none"
      transform="rotate(20, 1300, 500)" />
    <ellipse cx="100" cy="85%" rx="18" ry="52" stroke="#6ee7b7" strokeWidth="1" fill="none"
      transform="rotate(35, 100, 800)" />
    <ellipse cx="55" cy="90%" rx="12" ry="36" stroke="#34d399" strokeWidth="1" fill="none"
      transform="rotate(-20, 55, 850)" />
    <ellipse cx="88%" cy="88%" rx="20" ry="58" stroke="#4ade80" strokeWidth="1" fill="none"
      transform="rotate(-30, 1200, 820)" />
    <ellipse cx="52%" cy="95%" rx="15" ry="44" stroke="#6ee7b7" strokeWidth="1" fill="none"
      transform="rotate(10, 700, 900)" />
    <path d="M 0 400 Q 60 350 40 300 Q 20 250 70 200" stroke="#4ade80" strokeWidth="1" fill="none" />
    <path d="M 100% 300 Q 1240 350 1260 400 Q 1280 450 1230 500" stroke="#34d399" strokeWidth="1" fill="none" />
  </svg>
);

// ============================================================
// SPLASH SCREEN
// ============================================================
const SplashScreen = ({ onEnter }) => (
  <div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
    style={{ background: '#030d06' }}
  >
    <PhotoBackground opacity={0.35} />
    <LeafBackground />

    <div className="relative z-10 text-center px-6">
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <p className="text-emerald-500 text-sm font-semibold tracking-widest uppercase mb-6 opacity-80">
        Welcome
      </p>
      <h1
        className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Hello,
      </h1>
      <h2
        className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-500 bg-clip-text text-transparent">
          Welcome to Aniruddha's Page
        </span>
      </h2>
      <p className="text-gray-300 text-base mb-12 mt-4 font-medium">
        CS & Business · AI/ML · Developer
      </p>
      <button
        onClick={onEnter}
        className="group px-10 py-4 rounded-full font-semibold text-white
          bg-gradient-to-r from-emerald-600 to-emerald-800
          hover:from-emerald-500 hover:to-emerald-700
          hover:shadow-lg hover:shadow-emerald-500/30
          hover:scale-105 transition-all duration-300 text-base tracking-wide"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Enter
        <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
      </button>
      <div className="mt-10 flex justify-center gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"
            style={{ animationDelay: `${i * 300}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// PROJECT DATA
// ============================================================
const projects = [
  {
    id: 1,
    title: "OSU Research Commons Library Website",
    description: "Developing and optimizing the OSU Research Library website with a team to improve user experience and navigation.",
    status: "Completed",
    tags: ["Web Development", "UX/UI", "Team Project"],
    icon: "🏛️",
  },
  {
    id: 2,
    title: "AI Study Website",
    description: "Collaborated at Hack OH/IO Hackathon to develop an AI-powered study website that converts video, image, and text inputs into review guides and flashcards using the Base44 tech stack.",
    status: "Completed",
    tags: ["AI", "React", "Machine Learning"],
    link: "https://neura-learn-2434dc60.base44.app/dashboard",
    icon: "🤖",
  },
  {
    id: 3,
    title: "Deaf-focused safety alert machine learning model",
    description: "Building a deaf safey alert system that uses random forest and urban sound classification to detect emergencies and alert deaf users",
    status: "In Progress",
    tags: ["Machine Learning", "Python", "PyTorch", "LLMs"],
    icon: "🌍",
  },
  {
    id: 4,
    title: "Personal Portfolio Website",
    description: "Created this personal portfolio website to showcase projects and skills using React and Tailwind CSS.",
    status: "Completed",
    tags: ["Web Development", "React", "Tailwind CSS"],
    icon: "💼",
  },
  {
    id: 5,
    title: "iOS Expense Tracker App",
    description: "Developed and designed an iOS expense tracker app using SwiftUI and Xcode to help users manage their finances. Leveraged AI-assisted tools to accelerate SwiftUI best practices.",
    status: "Completed",
    tags: ["iOS Development", "SwiftUI", "Xcode"],
    icon: "📱",
  },
  {
    id: 2,
    title: "NYC Housing Data Analysis Project",
    description: "Analyzed NYC housing sales data using SQL queries in Databricks, performed data cleaning and trend analysis, and built a public web application(HTML/CSS/Javascript) to visualize insights and allow users to explore housing price patters across different categories of their choosing.  ",
    status: "Completed",
    tags: ["AI","Databricks", "SQL", "Data Analysis", "HTML/CSS/JS"],
    link: "https://data-io-2026-dashboard.pages.dev/dashboard",
    icon: "🤖",
  },
];

// ============================================================
// PROJECT CARD
// ============================================================
const ProjectCard = ({ project, index }) => {
  const [ref, inView] = useInView();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const delays = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-[400ms]'];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease',
      }}
      className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10
        hover:border-emerald-400/40 hover:-translate-y-1
        hover:shadow-xl hover:shadow-emerald-500/10
        ${animateIn(inView, delays[index % 5])}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{project.icon}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
            project.status === 'Completed'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
          }`}>
            {project.status}
          </span>
        </div>

        <h3 className="text-lg font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-700/60 rounded-md text-xs text-slate-300 border border-white/5">
              {tag}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20
              border border-emerald-500/30 rounded-lg text-sm font-semibold text-emerald-400
              transition-all hover:gap-3"
          >
            View Project <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

// ============================================================
// SKILLS
// ============================================================
const skills = [
  { name: 'Python', category: 'lang' },
  { name: 'React', category: 'web' },
  { name: 'Machine Learning', category: 'ai' },
  { name: 'Tailwind CSS', category: 'web' },
  { name: 'SwiftUI', category: 'mobile' },
  { name: 'Data Structures', category: 'cs' },
  { name: 'Algorithms', category: 'cs' },
  { name: 'Generative AI', category: 'ai' },
  { name: 'Xcode', category: 'mobile' },
  { name: 'Web Development', category: 'web' },
  { name: 'Problem Solving', category: 'cs' },
  { name: 'JavaScript', category: 'lang' },
];

const categoryColors = {
  lang:   'bg-violet-500/15 text-violet-300 border-violet-500/25',
  web:    'bg-sky-500/15 text-sky-300 border-sky-500/25',
  ai:     'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  mobile: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
  cs:     'bg-rose-500/15 text-rose-300 border-rose-500/25',
};

// ============================================================
// MAIN PORTFOLIO COMPONENT
// ============================================================
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [showSplash, setShowSplash] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  const handleEnter = () => {
    setSplashVisible(false);
    setTimeout(() => {
      setShowSplash(false);
      setPortfolioVisible(true);
    }, 700);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const [heroRef, heroInView] = useInView();
  const [aboutRef, aboutInView] = useInView();
  const [contactRef, contactInView] = useInView();

  return (
    <>
      {showSplash && (
        <div
          className="transition-opacity duration-700"
          style={{ opacity: splashVisible ? 1 : 0 }}
        >
          <SplashScreen onEnter={handleEnter} />
        </div>
      )}

      <div
        className="min-h-screen text-white overflow-x-hidden transition-opacity duration-700"
        style={{
          background: '#030d06',
          opacity: portfolioVisible ? 1 : 0,
          pointerEvents: portfolioVisible ? 'auto' : 'none',
        }}
      >
        <PhotoBackground opacity={0.45} />
        <LeafBackground />

        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled
              ? 'bg-black/60 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => scrollToSection('home')}
                className="text-lg font-bold bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-500 bg-clip-text text-transparent tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                AB
              </button>

              <div className="hidden md:flex items-center gap-1">
                {['home', 'about', 'projects', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                      activeSection === section
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <div className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-1">
              {['home', 'about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-4 py-3 capitalize text-gray-300 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6">
          <ParticleBackground />

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <img
              src="/jeremy-bishop-uAfZBP-GtiA-unsplash.jpg"
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 30%',
                opacity: 0.35,
                filter: 'saturate(0.9) brightness(0.8)',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%)',
              }}
            />
          </div>

          <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm mb-8 backdrop-blur-md ${animateIn(heroInView)}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for opportunities
            </div>

            <h1
              className={`text-6xl md:text-8xl font-black mb-4 tracking-tight ${animateIn(heroInView, 'delay-100')}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <TypewriterEffect text="Aniruddha" speed={90} className="text-white" />
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-500 bg-clip-text text-transparent">
                Bhati
              </span>
            </h1>

            <p className={`text-lg md:text-xl text-gray-200 font-medium mb-2 ${animateIn(heroInView, 'delay-200')}`}>
              Scholars CSE & Business @ The Ohio State University
            </p>
            <p className={`text-base text-gray-300 mb-10 ${animateIn(heroInView, 'delay-300')}`}>
              Aspiring AI/ML Engineer · Emerging Developer · Growth-Driven Learner
            </p>

            <div className={`flex justify-center gap-4 flex-wrap ${animateIn(heroInView, 'delay-[400ms]')}`}>
              <button
                onClick={() => scrollToSection('projects')}
                className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full font-semibold
                  hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-200 text-white"
              >
                View Projects
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-7 py-3 border border-white/30 backdrop-blur-sm rounded-full font-semibold
                  hover:border-emerald-400/50 hover:bg-white/10 hover:scale-105 transition-all duration-200 text-white"
              >
                Get in Touch
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
            <ChevronDown size={24} />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-5xl mx-auto w-full">
            <div ref={aboutRef} className={animateIn(aboutInView)}>
              <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-3 text-center">Who I Am</p>
              <h2
                className="text-4xl md:text-6xl font-black mb-16 text-center tracking-tight text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                About Me
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className={`md:col-span-3 bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 space-y-5 text-gray-100 leading-relaxed ${animateIn(aboutInView, 'delay-100')}`}>
                <p>
                  Hi! I'm a freshman <span className="text-emerald-300 font-bold">Scholars Computer Science & Engineering</span> student
                  with a minor in Business at The Ohio State University.
                </p>
                <p>
                  I'm passionate about technology and how data structures and algorithms shape the systems we use daily.
                  I have a deep interest in{' '}
                  <span className="text-emerald-400 font-bold underline decoration-emerald-500/30">machine learning</span> and{' '}
                  <span className="text-emerald-400 font-bold underline decoration-emerald-500/30">generative AI</span>, and I hope to build a career at that frontier.
                </p>
                <p>
                  I'm constantly learning, building, and expanding my skills — always chasing real-world, impactful solutions.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {[
                    { value: '5+', label: 'Projects' },
                    { value: '2', label: 'Hackathons' },
                    { value: '∞', label: 'Curiosity' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-black text-emerald-400" style={{ fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1 uppercase tracking-tighter font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`md:col-span-2 bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 ${animateIn(aboutInView, 'delay-200')}`}>
                <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-5">Skills & Interests</h3>

                <div className="flex flex-wrap gap-2 mb-5 text-xs">
                  {[
                    { label: 'Languages', color: 'text-violet-300' },
                    { label: 'Web', color: 'text-sky-300' },
                    { label: 'AI/ML', color: 'text-emerald-300' },
                    { label: 'Mobile', color: 'text-teal-300' },
                    { label: 'CS', color: 'text-rose-300' },
                  ].map(c => (
                    <span key={c.label} className={`${c.color} font-bold`}>● {c.label}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={skill.name}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:scale-105 cursor-default ${categoryColors[skill.category]}`}
                      style={{
                        opacity: aboutInView ? 1 : 0,
                        transform: aboutInView ? 'translateY(0)' : 'translateY(8px)',
                        transition: `opacity 0.4s ease ${i * 50}ms, transform 0.4s ease ${i * 50}ms`,
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-16">
              <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-3">What I've Built</p>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tight text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Projects
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-2xl mx-auto w-full text-center">
            <div ref={contactRef}>
              <p className={`text-emerald-400 text-sm font-bold tracking-widest uppercase mb-3 ${animateIn(contactInView)}`}>
                Let's Connect
              </p>
              <h2
                className={`text-4xl md:text-6xl font-black mb-6 tracking-tight text-white ${animateIn(contactInView, 'delay-100')}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Get In Touch
              </h2>
              <p className={`text-gray-200 font-medium text-lg mb-12 ${animateIn(contactInView, 'delay-200')}`}>
                I'm always open to new projects, creative ideas, or opportunities. Let's build something great together.
              </p>
            </div>

            <div className={`bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/20 ${animateIn(contactInView, 'delay-300')}`}>
              <a
                href="mailto:bhati.27@buckeyemail.osu.edu"
                className="group flex items-center justify-between w-full px-6 py-4
                  bg-gradient-to-r from-emerald-500/10 to-emerald-700/10
                  border border-emerald-500/30 rounded-xl hover:border-emerald-400/60
                  hover:bg-emerald-500/20 transition-all mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/30 rounded-lg">
                    <Mail size={18} className="text-emerald-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 font-bold mb-0.5 uppercase tracking-tighter">Email me at</p>
                    <p className="text-sm font-bold text-emerald-300">bhati.27@buckeyemail.osu.edu</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-gray-400 group-hover:text-emerald-300 transition-colors" />
              </a>

              <p className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-widest">Or find me on</p>
              <div className="flex justify-center gap-4">
                {[
                  { href: "https://github.com/anibhati", icon: <Github size={20} />, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/aniruddha-bhati-729771377/", icon: <Linkedin size={20} />, label: "LinkedIn" },
                ].map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20
                      border border-white/20 hover:border-white/40 rounded-xl text-white
                      transition-all hover:scale-105 text-sm font-bold"
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-8 text-center bg-black/20 backdrop-blur-md">
          <p className="text-gray-400 text-sm font-medium">
            © 2025 <span className="text-emerald-400 font-bold">Aniruddha Bhati</span> · Built with React & Tailwind CSS
          </p>
        </footer>
      </div>
    </>
  );
};

export default Portfolio;