import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Github, Linkedin, Mail, ArrowUpRight, ArrowDown,
  Award, MapPin, GraduationCap, Cpu, Briefcase, Sparkles,
} from 'lucide-react';

/* ============================================================
   THEME + GLOBAL CSS
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root{
      --bg:#08080b;
      --panel:rgba(255,255,255,0.025);
      --line:rgba(255,255,255,0.10);
      --line-soft:rgba(255,255,255,0.06);
      --ink:#f1f1f5;
      --muted:#8b8b96;
      --faint:#5b5b66;
      --accent:#f3b34a;
      --accent-bright:#ffc566;
      --accent-soft:rgba(243,179,74,0.13);
      /* live, scroll-driven hue (updated from JS) */
      --live:#f3b34a;
      --live-2:#5e9eff;
      --display:'Syne',system-ui,sans-serif;
      --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    }
    .ab-root{background:var(--bg);color:var(--ink);font-family:var(--sans);}
    .ab-root ::selection{background:var(--accent);color:#1a1300;}
    .ab-display{font-family:var(--display);}
    .ab-mono{font-family:var(--mono);}
    .ab-link{position:relative;}
    .ab-link::after{content:'';position:absolute;left:0;bottom:-2px;height:1px;width:0;background:var(--accent);transition:width .3s ease;}
    .ab-link:hover::after{width:100%;}

    @keyframes ab-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes ab-pulse{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes ab-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.12)}100%{transform:translate(0,0) scale(1)}}
    @keyframes ab-drift2{0%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,40px) scale(1.18)}100%{transform:translate(0,0) scale(1)}}
    @keyframes ab-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes ab-marquee-rev{from{transform:translateX(-50%)}to{transform:translateX(0)}}
    @keyframes ab-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes ab-rise{from{opacity:0;transform:translateY(110%)}to{opacity:1;transform:translateY(0)}}

    .ab-marquee-track{display:inline-flex;white-space:nowrap;will-change:transform;}
    .ab-shine{
      background:linear-gradient(100deg,var(--ink) 0%,var(--ink) 40%,var(--accent-bright) 50%,var(--ink) 60%,var(--ink) 100%);
      background-size:200% 100%;
      -webkit-background-clip:text;background-clip:text;color:transparent;
      animation:ab-shimmer 5s linear infinite;
    }

    .ab-root::-webkit-scrollbar{width:10px}
    .ab-root::-webkit-scrollbar-track{background:var(--bg)}
    .ab-root::-webkit-scrollbar-thumb{background:#23232a;border-radius:8px;border:2px solid var(--bg)}
    .ab-root::-webkit-scrollbar-thumb:hover{background:#33333d}

    @media (prefers-reduced-motion: reduce){ *{animation:none!important;} }
  `}</style>
);

/* ============================================================
   SHARED LIVE STATE (no re-render spam)
   - view.scroll: 0..1 scroll progress -> drives background color
   ============================================================ */
const view = { scroll: 0 };

/* color journey the background travels as you scroll */
const PALETTE = [
  [243, 179, 74],   // gold            (top — brand anchor)
  [214, 158, 92],   // warm bronze
  [120, 150, 168],  // muted steel
  [78, 132, 150],   // deep slate-teal (bottom)
];

const lerpColor = (t) => {
  const c = Math.max(0, Math.min(1, t)) * (PALETTE.length - 1);
  const i = Math.floor(c);
  const f = c - i;
  const a = PALETTE[i];
  const b = PALETTE[Math.min(i + 1, PALETTE.length - 1)];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
};
const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`;

/* ============================================================
   LIVE BACKGROUND — drifting glows + particle constellation
   that both recolor based on scroll position.
   ============================================================ */
const LiveBackground = () => {
  const canvasRef = useRef(null);
  const blobA = useRef(null);
  const blobB = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts = [], raf;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      // current scroll-driven color (kept in one tonal family)
      const cA = lerpColor(view.scroll);
      const cB = lerpColor(Math.min(view.scroll + 0.25, 1));

      // recolor ambient glows — soft and atmospheric, never loud
      if (blobA.current) blobA.current.style.background = `radial-gradient(circle, ${rgba(cA, 0.11)}, transparent 70%)`;
      if (blobB.current) blobB.current.style.background = `radial-gradient(circle, ${rgba(cB, 0.07)}, transparent 72%)`;
      document.documentElement.style.setProperty('--live', `rgb(${cA[0]},${cA[1]},${cA[2]})`);

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.fill();

        // whisper-faint links between nearby dots (no cursor interaction)
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const lx = p.x - q.x, ly = p.y - q.y;
          const ld = lx * lx + ly * ly;
          if (ld < 9000) {
            ctx.strokeStyle = rgba(cA, (1 - ld / 9000) * 0.09);
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {/* grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(ellipse 120% 80% at 50% 30%, #000 30%, transparent 95%)',
        WebkitMaskImage: 'radial-gradient(ellipse 120% 80% at 50% 30%, #000 30%, transparent 95%)',
      }} />
      {/* recoloring glows */}
      <div ref={blobA} style={{ position: 'absolute', top: '-14%', right: '-10%', width: 720, height: 720, borderRadius: '50%', filter: 'blur(10px)', animation: 'ab-drift 28s ease-in-out infinite' }} />
      <div ref={blobB} style={{ position: 'absolute', bottom: '-18%', left: '-12%', width: 640, height: 640, borderRadius: '50%', filter: 'blur(10px)', animation: 'ab-drift2 34s ease-in-out infinite' }} />
      {/* constellation */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
};

/* ============================================================
   SCROLL PROGRESS BAR (tints with the live color)
   ============================================================ */
const ScrollProgress = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2.5, zIndex: 60, background: 'transparent' }}>
      <div style={{ height: '100%', width: `${p}%`, background: 'linear-gradient(90deg,var(--accent),var(--live))', boxShadow: '0 0 12px var(--live)', transition: 'width .1s linear' }} />
    </div>
  );
};

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Reveal = ({ children, delay = 0, y = 24, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================
   COUNT-UP
   ============================================================ */
const CountUp = ({ value }) => {
  const [ref, inView] = useInView(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const target = parseInt(value, 10) || 0;
    if (!target) { setN(value); return; }
    let start = null;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 1100, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return <span ref={ref}>{n}</span>;
};

/* ============================================================
   MAGNETIC
   ============================================================ */
const Magnetic = ({ children, strength = 0.4, className = '', style = {} }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={reset}
      style={{ display: 'inline-block', transition: 'transform .25s cubic-bezier(.2,.7,.2,1)', ...style }}>
      {children}
    </div>
  );
};

/* ============================================================
   DATA
   ============================================================ */
const NAV = ['home', 'about', 'experience', 'projects', 'contact'];

const EXPERIENCES = [
  {
    role: 'IT Intern · Software Development',
    org: 'Winterset Law Group',
    meta: 'Special Counsel to the Ohio Attorney General · Powell, OH',
    date: 'May 2026 — Present',
    current: true,
    bullets: [
      'Built a client-facing progressive web app (React, Node.js, Vercel) that turns Ohio state tax-debt resolution into a 3-minute online intake, replacing a multi-form, in-office process.',
      'Implemented payment-plan enrollment, dispute submission, and attorney scheduling with secure authentication, status tracking, and account lookup that pre-populates client data.',
      'Architected the app to be installable on mobile as the foundation for a planned native iOS rollout in SwiftUI.',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    org: 'The OSU James Cancer Center',
    meta: 'Columbus, OH',
    date: 'Apr 2026 — Present',
    current: true,
    bullets: [
      'Developing the LifeScale platform to streamline access to large-scale hospital and clinical data.',
      'Writing SQL against de-identified Epic Cosmos datasets to surface trends and make insights accessible to physicians.',
      'Collaborating with research scientists to translate clinical data into decision-ready findings.',
    ],
  },
  {
    role: 'Student Assistant · Research Commons',
    org: 'The Ohio State University',
    meta: 'Columbus, OH',
    date: 'Aug 2025 — Present',
    current: false,
    bullets: [
      'Redesigned and rebuilt the research library website in a two-person team, improving usability and accessibility.',
      'Coordinated in-person and online research & technology events for the university community.',
      'Ran concierge desk operations, helping students and faculty navigate research resources.',
    ],
  },
  {
    role: 'Server · Team Member',
    org: "Aladdin's Eatery",
    meta: 'Powell, OH',
    date: 'Jun 2024 — Aug 2025',
    current: false,
    bullets: [
      'Took orders, ran the register, and supported food prep in a fast-paced environment.',
      'Resolved customer concerns with professionalism to keep service smooth and guests satisfied.',
    ],
  },
];

const PROJECTS = [
  {
    title: 'Winterset Law Group Web App',
    desc: 'Client-facing PWA that streamlines Ohio state tax-debt resolution into a 3-minute online intake — payment plans, disputes, and attorney scheduling, with secure auth and account lookup.',
    tags: ['React', 'Node.js', 'Vercel', 'PWA'],
    status: 'In Progress',
    featured: true,
  },
  {
    title: 'SignalSpace — Safety Alert System',
    desc: 'Real-time, deaf-focused safety system that classifies urban sounds to detect emergencies and alert users with hearing loss to nearby danger.',
    tags: ['Machine Learning', 'Python', 'Random Forest', 'Audio'],
    status: 'Completed',
    award: '1st Place · BDAA Research Gala',
    link: 'https://safety-alert-website.vercel.app/',
    featured: true,
  },
  {
    title: 'AI Study Website',
    desc: 'Built at HackOhio: an AI study tool that turns video, image, and text inputs into review guides and flashcards.',
    tags: ['AI', 'React', 'Base44'],
    status: 'Completed',
    link: 'https://neura-learn-2434dc60.base44.app/dashboard',
  },
  {
    title: 'NYC Housing Data Analysis',
    desc: 'Cleaned and analyzed NYC housing-sales data in Databricks + SQL, then shipped a public dashboard to explore price patterns across neighborhoods.',
    tags: ['Databricks', 'SQL', 'Data Analysis', 'JS'],
    status: 'Completed',
    link: 'https://data-io-2026-dashboard.pages.dev/dashboard',
  },
  {
    title: 'iOS Expense Tracker',
    desc: 'A SwiftUI app to add, categorize, and review personal expenses, with local storage and a clean, intuitive interface.',
    tags: ['SwiftUI', 'Swift', 'Xcode'],
    status: 'Completed',
    link: 'https://github.com/anibhati/expense-tracker-ios',
  },
  {
    title: 'Personal Portfolio',
    desc: 'This site — a React + Tailwind portfolio built to showcase my work and keep it current.',
    tags: ['React', 'Tailwind CSS'],
    status: 'Completed',
    link: 'https://github.com/anibhati/aniruddhabhati-portfolio',
  },
];

const SKILL_GROUPS = [
  { label: 'Languages', items: ['Python', 'Java', 'Swift', 'SQL'] },
  { label: 'Web', items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'] },
  { label: 'AI & Data', items: ['Machine Learning', 'Databricks', 'Data Analysis'] },
  { label: 'Mobile', items: ['SwiftUI', 'Xcode'] },
];

const SPECS = [
  { icon: Cpu, label: 'Focus', value: 'AI / ML · Full-stack' },
  { icon: GraduationCap, label: 'Education', value: 'B.S. CSE (AI) @ The Ohio State University' },
  { icon: MapPin, label: 'Location', value: 'Columbus, OH' },
  { icon: Briefcase, label: 'Currently', value: 'Intern @ Winterset · Research @ James' },
];

const SOCIAL = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/anibhati' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/aniruddha-singh-bhati-729771377/' },
  { icon: Mail, label: 'Email', href: 'mailto:bhati.27@osu.edu' },
];

const MARQUEE_WORDS = ['MACHINE LEARNING', 'FULL-STACK', 'REACT', 'SWIFT', 'PYTHON', 'AUDIO AI', 'SQL', 'iOS'];

/* ============================================================
   SMALL PIECES
   ============================================================ */
const Kicker = ({ children }) => (
  <span className="ab-mono" style={{ color: 'var(--accent)', fontSize: 12, letterSpacing: '0.18em' }}>{children}</span>
);

const SectionHeader = ({ index, kicker, title }) => (
  <Reveal>
    <div className="flex items-baseline gap-4 mb-12">
      <span className="ab-mono" style={{ color: 'var(--faint)', fontSize: 14 }}>{index}</span>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="ab-display" style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 8 }}>{title}</h2>
      </div>
    </div>
  </Reveal>
);

/* ============================================================
   KINETIC MARQUEE
   ============================================================ */
const Marquee = ({ words, reverse = false, speed = 28 }) => (
  <div style={{ overflow: 'hidden', borderTop: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)', padding: '22px 0', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
    <span className="ab-marquee-track" style={{ animation: `${reverse ? 'ab-marquee-rev' : 'ab-marquee'} ${speed}s linear infinite` }}>
      {[...words, ...words].map((wd, i) => (
        <span key={i} className="ab-display inline-flex items-center" style={{ fontSize: 'clamp(2rem,6vw,4.5rem)', fontWeight: 800, letterSpacing: '-0.02em', padding: '0 26px', color: 'transparent', WebkitTextStroke: '1px var(--line)' }}>
          {wd}
          <span style={{ margin: '0 26px', color: 'var(--accent)', WebkitTextStroke: '0', fontSize: '0.5em' }}>✦</span>
        </span>
      ))}
    </span>
  </div>
);

/* ============================================================
   NAV
   ============================================================ */
const Nav = ({ active, go }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const jump = (s) => { go(s); setOpen(false); };
  return (
    <nav className="fixed top-0 left-0 w-full z-50" style={{
      transition: 'all .4s ease',
      background: scrolled ? 'rgba(8,8,11,0.72)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--line-soft)' : '1px solid transparent',
    }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between" style={{ height: 68 }}>
        <Magnetic strength={0.5}>
          <button onClick={() => jump('home')} className="ab-display" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>
            AB<span style={{ color: 'var(--accent)' }}>.</span>
          </button>
        </Magnetic>
        <div className="hidden md:flex items-center" style={{ gap: 4 }}>
          {NAV.map((s, i) => (
            <button key={s} onClick={() => jump(s)} className="ab-mono"
              style={{ padding: '8px 14px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: active === s ? 'var(--accent)' : 'var(--muted)', transition: 'color .25s' }}
              onMouseEnter={(e) => { if (active !== s) e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={(e) => { if (active !== s) e.currentTarget.style.color = 'var(--muted)'; }}>
              <span style={{ color: 'var(--faint)', marginRight: 6 }}>0{i + 1}</span>{s}
            </button>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: 'var(--ink)' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="md:hidden overflow-hidden" style={{ transition: 'all .3s ease', maxHeight: open ? 320 : 0, background: 'rgba(8,8,11,0.95)', borderTop: open ? '1px solid var(--line-soft)' : 'none' }}>
        {NAV.map((s) => (
          <button key={s} onClick={() => jump(s)} className="ab-mono block w-full text-left" style={{ padding: '14px 28px', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s}</button>
        ))}
      </div>
    </nav>
  );
};

/* ============================================================
   HERO
   ============================================================ */
const Hero = ({ go }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-9">
            <Reveal delay={0}>
              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mb-7">
                <Kicker>{'// COLUMBUS, OH'}</Kicker>
                <span className="inline-flex items-center gap-2 ab-mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', animation: 'ab-pulse 2s infinite' }} />
                  Open to internships &amp; opportunities
                </span>
              </div>
            </Reveal>

            <h1 className="ab-display" style={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.92, fontSize: 'clamp(3rem,11vw,6.5rem)' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span style={{ display: 'inline-block', animation: 'ab-rise .9s cubic-bezier(.2,.8,.2,1) .15s both' }}>Aniruddha </span>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span style={{ display: 'inline-block', animation: 'ab-rise .9s cubic-bezier(.2,.8,.2,1) .27s both' }}>Bhati<span style={{ color: 'var(--accent)' }}>.</span></span>
              </span>
            </h1>

            <Reveal delay={240}>
              <p className="ab-mono" style={{ marginTop: 26, fontSize: 14, letterSpacing: '0.04em', color: 'var(--ink)' }}>
                Computer Science &amp; Business <span style={{ color: 'var(--faint)' }}>@</span> Ohio State
              </p>
            </Reveal>

            <Reveal delay={340}>
              <p style={{ marginTop: 18, maxWidth: 560, color: 'var(--muted)', fontSize: 18, lineHeight: 1.6 }}>
                I build full-stack web apps and machine-learning tools. Lately that's a client portal for a
                law firm and an audio safety system for people who are deaf or hard of hearing.
              </p>
            </Reveal>

            <Reveal delay={440}>
              <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 36 }}>
                <Magnetic strength={0.35}>
                  <button onClick={() => go('projects')} className="ab-mono inline-flex items-center gap-2"
                    style={{ padding: '14px 26px', borderRadius: 999, background: 'var(--accent)', color: '#1a1300', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background .25s, box-shadow .25s', boxShadow: '0 0 0 rgba(243,179,74,0)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-bright)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(243,179,74,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 rgba(243,179,74,0)'; }}>
                    View Work <ArrowUpRight size={16} />
                  </button>
                </Magnetic>
                <Magnetic strength={0.35}>
                  <button onClick={() => go('contact')} className="ab-mono inline-flex items-center gap-2"
                    style={{ padding: '14px 26px', borderRadius: 999, border: '1px solid var(--line)', color: 'var(--ink)', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all .25s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink)'; }}>
                    Get in Touch
                  </button>
                </Magnetic>
                <div className="flex items-center gap-1" style={{ marginLeft: 6 }}>
                  {SOCIAL.map(({ icon: Icon, href, label }) => (
                    <Magnetic key={label} strength={0.5}>
                      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                        style={{ padding: 11, color: 'var(--muted)', transition: 'color .25s', display: 'inline-flex' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>
                        <Icon size={19} />
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="hidden lg:flex lg:col-span-3 justify-end">
            <Reveal delay={300}>
              <div className="ab-display" aria-hidden="true" style={{ fontSize: 200, fontWeight: 800, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px var(--line)', animation: 'ab-float 7s ease-in-out infinite' }}>AB</div>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 28, color: 'var(--faint)', animation: 'ab-float 3s ease-in-out infinite' }}>
        <ArrowDown size={20} />
      </div>
    </section>
  );
};

/* ============================================================
   ABOUT
   ============================================================ */
const About = () => (
  <section id="about" className="px-6 lg:px-8 py-28">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader index="01" kicker="WHO I AM" title="About" />
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <Reveal delay={80}>
            <div style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--muted)' }} className="space-y-5">
              <p>
                I'm a Computer Science &amp; Engineering student at Ohio State
                <span style={{ color: 'var(--ink)' }}> (Engineering Scholars, AI specialization)</span>. Most of my
                time goes into building software — right now a client-facing web app for a firm serving as Special
                Counsel to the Ohio Attorney General, and SQL-driven clinical research at the James Cancer Center.
              </p>
              <p>
                I'm most drawn to <span style={{ color: 'var(--accent)' }}>machine learning and AI</span> — especially
                audio and safety systems. My team's safety model for people with hearing loss, SignalSpace, took
                <span style={{ color: 'var(--ink)' }}> 1st place</span> at OSU's BDAA Research Gala.
              </p>
              <p>When I'm not in class, I'm usually working on a side project or picking up something new.</p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="grid grid-cols-3 gap-4" style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--line-soft)' }}>
              {[{ v: '1st', l: 'BDAA Research Gala' }, { v: '6', l: 'Projects built' }, { v: '2', l: 'Hackathons' }].map((s) => (
                <div key={s.l}>
                  <div className="ab-display" style={{ fontSize: 40, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}><CountUp value={s.v} /></div>
                  <div className="ab-mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={120}>
            <div style={{ border: '1px solid var(--line)', borderRadius: 18, padding: 26, background: 'var(--panel)' }}>
              {SPECS.map(({ icon: Icon, label, value }, i) => (
                <div key={label} className="flex items-start gap-3" style={{ padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line-soft)' }}>
                  <Icon size={17} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div className="ab-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--faint)' }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'var(--ink)', marginTop: 3 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div style={{ marginTop: 22 }}>
              {SKILL_GROUPS.map((g) => (
                <div key={g.label} style={{ marginBottom: 16 }}>
                  <div className="ab-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 9 }}>{g.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s} className="ab-mono" style={{ fontSize: 12, padding: '6px 11px', borderRadius: 8, border: '1px solid var(--line)', color: 'var(--ink)', background: 'rgba(255,255,255,0.02)', transition: 'all .2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink)'; }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   EXPERIENCE
   ============================================================ */
const Experience = () => (
  <section id="experience" className="px-6 lg:px-8 py-28">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader index="02" kicker="MY JOURNEY" title="Experience" />
      <div className="relative" style={{ marginLeft: 6 }}>
        <div className="absolute" style={{ left: 5, top: 6, bottom: 6, width: 1, background: 'var(--line)' }} />
        {EXPERIENCES.map((e, i) => (
          <Reveal key={e.role} delay={i * 80}>
            <div className="relative" style={{ paddingLeft: 34, paddingBottom: i === EXPERIENCES.length - 1 ? 0 : 44 }}>
              <div className="absolute" style={{ left: 0, top: 4, width: 11, height: 11, borderRadius: '50%', background: e.current ? 'var(--accent)' : 'var(--bg)', border: `2px solid ${e.current ? 'var(--accent)' : 'var(--faint)'}`, boxShadow: e.current ? '0 0 0 4px var(--accent-soft)' : 'none', animation: e.current ? 'ab-pulse 2.4s infinite' : 'none' }} />
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="ab-mono" style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.05em' }}>{e.date}</span>
                {e.current && <span className="ab-mono" style={{ fontSize: 10, padding: '3px 9px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Now</span>}
              </div>
              <h3 className="ab-display" style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em' }}>{e.role}</h3>
              <p style={{ color: 'var(--ink)', fontSize: 15, marginTop: 2 }}>{e.org}</p>
              <p style={{ color: 'var(--faint)', fontSize: 13, marginTop: 2 }}>{e.meta}</p>
              <ul className="space-y-2" style={{ marginTop: 14, maxWidth: 760 }}>
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-3" style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>
                    <span style={{ marginTop: 9, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />{b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================
   PROJECTS
   ============================================================ */
const ProjectCard = ({ p, index }) => {
  const [hover, setHover] = useState(false);
  const cardRef = useRef(null);
  const onMove = (e) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', height: '100%', padding: 26, borderRadius: 18, overflow: 'hidden', background: 'var(--panel)',
        border: `1px solid ${hover ? 'var(--accent)' : p.featured ? 'rgba(243,179,74,0.28)' : 'var(--line)'}`,
        transform: hover ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform .3s cubic-bezier(.2,.7,.2,1), border-color .3s',
        boxShadow: hover ? '0 18px 40px rgba(0,0,0,0.35)' : 'none' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(260px circle at var(--mx,50%) var(--my,0%), rgba(243,179,74,0.10), transparent 70%)', opacity: hover ? 1 : 0, transition: 'opacity .3s' }} />
      <div style={{ position: 'relative' }}>
        <div className="flex items-start justify-between mb-5">
          <span className="ab-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>0{index + 1}</span>
          {p.award ? (
            <span className="ab-mono inline-flex items-center gap-1.5" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}><Award size={11} /> {p.award}</span>
          ) : (
            <span className="ab-mono" style={{ fontSize: 10, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', background: p.status === 'Completed' ? 'rgba(255,255,255,0.05)' : 'var(--accent-soft)', color: p.status === 'Completed' ? 'var(--muted)' : 'var(--accent)', border: '1px solid var(--line-soft)' }}>{p.status}</span>
          )}
        </div>
        <h3 className="ab-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: hover ? 'var(--accent)' : 'var(--ink)', transition: 'color .25s' }}>{p.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, marginTop: 12 }}>{p.desc}</p>
        <div className="flex flex-wrap gap-2" style={{ marginTop: 18 }}>
          {p.tags.map((t) => (<span key={t} className="ab-mono" style={{ fontSize: 11, padding: '4px 9px', borderRadius: 7, color: 'var(--faint)', border: '1px solid var(--line-soft)' }}>{t}</span>))}
        </div>
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="ab-mono inline-flex items-center gap-1.5" style={{ marginTop: 20, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: hover ? 'var(--accent)' : 'var(--muted)', transition: 'all .25s' }}>
            View Project <ArrowUpRight size={14} style={{ transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'transform .25s' }} />
          </a>
        )}
      </div>
    </div>
  );
};

const Projects = () => (
  <section id="projects" className="px-6 lg:px-8 py-28">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader index="03" kicker="WHAT I'VE BUILT" title="Projects" />
      <div className="grid md:grid-cols-2 gap-5">
        {PROJECTS.map((p, i) => (<Reveal key={p.title} delay={(i % 2) * 80}><ProjectCard p={p} index={i} /></Reveal>))}
      </div>
    </div>
  </section>
);

/* ============================================================
   CONTACT
   ============================================================ */
const Contact = () => (
  <section id="contact" className="px-6 lg:px-8 py-28">
    <div className="max-w-6xl mx-auto w-full">
      <SectionHeader index="04" kicker="LET'S CONNECT" title="Get in Touch" />
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <Reveal delay={80}>
            <p className="ab-display" style={{ fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              <span className="ab-shine">Have a project, a role, or just want to chat?</span><br />
              <span style={{ color: 'var(--muted)' }}>My inbox is always open.</span>
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={160}>
            <a href="mailto:bhati.27@osu.edu" className="flex items-center justify-between" style={{ padding: '18px 22px', borderRadius: 14, border: '1px solid var(--line)', background: 'var(--panel)', transition: 'border-color .25s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}>
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="ab-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--faint)' }}>Email</div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', marginTop: 2 }}>bhati.27@osu.edu</div>
                </div>
              </div>
              <ArrowUpRight size={16} style={{ color: 'var(--muted)' }} />
            </a>
            <div className="flex gap-3" style={{ marginTop: 14 }}>
              {SOCIAL.filter((s) => s.label !== 'Email').map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ab-mono flex-1 inline-flex items-center justify-center gap-2"
                  style={{ padding: '14px', borderRadius: 14, border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all .25s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink)'; }}>
                  <Icon size={16} /> {label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================================
   ROOT
   ============================================================ */
const Portfolio = () => {
  const [active, setActive] = useState('home');

  // track scroll progress (drives the live background color)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      view.scroll = max > 0 ? h.scrollTop / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (s) => { setActive(s); document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' }); };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -45% 0px' });
    NAV.forEach((s) => { const el = document.getElementById(s); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="ab-root min-h-screen overflow-x-hidden" style={{ position: 'relative' }}>
      <GlobalStyle />
      <ScrollProgress />
      <LiveBackground />

      {/* grain overlay */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.04, mixBlendMode: 'overlay',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav active={active} go={go} />
        <Hero go={go} />
        <About />
        <Marquee words={MARQUEE_WORDS} speed={32} />
        <Experience />
        <Projects />
        <Marquee words={MARQUEE_WORDS} reverse speed={36} />
        <Contact />
        <footer style={{ borderTop: '1px solid var(--line-soft)', padding: '28px 0', textAlign: 'center' }}>
          <p className="ab-mono inline-flex items-center gap-2" style={{ fontSize: 12, color: 'var(--faint)', letterSpacing: '0.04em' }}>
            <Sparkles size={12} style={{ color: 'var(--accent)' }} />
            © 2026 Aniruddha Bhati · Built with React &amp; Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;