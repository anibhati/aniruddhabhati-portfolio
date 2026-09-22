import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { gsap, SplitText, useGSAP, calm } from "../motion/gsap";
import Magnetic from "../motion/Magnetic";
import Photo from "./Photo";

const facts = [
  ["Studying", "Computer Science & Engineering, AI"],
  ["Minor", "Business"],
  ["School", "The Ohio State University"],
  ["Graduating", "Spring 2029"],
  ["Based in", "Columbus, OH"],
];

function Roll({ children }) {
  return (
    <span className="kt-roll">
      <span data-text={children}>{children}</span>
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const scope = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        const seen = sessionStorage.getItem("kt-intro") === "1";
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => sessionStorage.setItem("kt-intro", "1"),
        });
        tl.timeScale(seen ? 2.2 : 1);

        tl.from(".kt-hero-rail", { scaleX: 0, transformOrigin: "left center", duration: 1, ease: "expo.inOut" })
          .from(".kt-print", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "power2.inOut" }, "-=0.3")
          .from(".kt-hero-ticket", { rotate: 7, duration: 1.6, ease: "elastic.out(1, 0.3)" }, "-=0.45")
          .from(".kt-portrait", { yPercent: -130, rotate: 12, duration: 1.6, ease: "elastic.out(1, 0.4)" }, "-=1.3");

        const split = SplitText.create(".kt-h1", { type: "lines", mask: "lines" });
        tl.from(split.lines, { yPercent: 110, duration: 1, stagger: 0.09 }, "-=1.4")
          .from(".kt-lead, .kt-ctas", { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6");

        // scroll-away depth: each layer moves at its own speed
        const out = { trigger: ".kt-hero", start: "top top", end: "bottom top", scrub: 1 };
        gsap.to(".kt-hero-ticket", { y: 140, ease: "none", scrollTrigger: out });
        gsap.to(".kt-portrait", { y: 220, ease: "none", scrollTrigger: out });
        gsap.to(".kt-hero-copy", { y: -90, opacity: 0.2, ease: "none", scrollTrigger: out });

        return () => split.revert();
      });
    },
    { scope }
  );

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });
  const swayY = useSpring(useTransform(mx, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 12 });
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={scope}>
      <div className="kt-rail kt-hero-rail" aria-hidden="true" />
      <section className="kt-hero kt-hero-wide" id="top" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="kt-paper kt-hero-ticket">
          <motion.div style={{ rotateX, rotateY, transformPerspective: 900 }}>
            <span className="kt-clip" aria-hidden="true" />
            <div className="kt-print">
              <div className="kt-ticket-body">
                <div className="kt-id">
                  <Photo src="/headshot.jpg" alt="Aniruddha Bhati" className="kt-hero-photo" label="Add headshot.jpg" />
                  <div>
                    <div className="kt-ticket-name">Aniruddha Singh Bhati</div>
                    <p className="kt-ticket-sub">Software engineer, full-stack and machine learning</p>
                  </div>
                </div>
                <hr className="kt-dash" />
                <dl className="kt-facts">
                  {facts.map(([k, v]) => (
                    <div key={k} className="kt-row">
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <hr className="kt-dash" />
                <div className="kt-red">Open to internships and interesting projects</div>
              </div>
              <div className="kt-zig" />
            </div>
          </motion.div>
        </div>

        <div className="kt-hero-copy">
          <h1 className="kt-h1">I learn how it&rsquo;s usually done. Then I build it better.</h1>
          <p className="kt-lead">
            I build full-stack apps and machine-learning systems. Right now that&rsquo;s a client portal
            for a law firm and a plain-English search tool over real patient data at OSU&rsquo;s James
            Cancer Center.
          </p>
          <div className="kt-ctas">
            <Magnetic>
              <a href="#menu" className="kt-btn kt-btn-solid" aria-label="See my work"><Roll>See my work</Roll></a>
            </Magnetic>
            <Magnetic>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="kt-btn kt-btn-line" aria-label="Resume"><Roll>Resume</Roll></a>
            </Magnetic>
          </div>
        </div>

        <div className="kt-portrait">
          <motion.figure className="kt-portrait-card" style={{ rotate: swayY }}>
            <span className="kt-clip kt-clip-sm" aria-hidden="true" />
            <div className="kt-portrait-img">
              <Photo src="/headshot.jpg" alt="Aniruddha Bhati" className="kt-portrait-photo" label="Add headshot.jpg" />
            </div>
          </motion.figure>
        </div>
      </section>
    </div>
  );
}
