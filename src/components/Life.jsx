import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { life, cooking } from "../data/life";
import { gsap, useGSAP, calm } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";
import Rail from "./Rail";
import Photo from "./Photo";

const TILTS = [-2, 1.5, -1, 2.2];

export default function Life() {
  const reduce = useReducedMotion();
  const heading = useSplitReveal();
  const storyHeading = useSplitReveal();
  const scope = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        // polaroids swing onto the rail
        gsap.from(".kt-life-card", {
          yPercent: -110, rotate: -12, opacity: 0, duration: 1.3, ease: "elastic.out(1, 0.5)", stagger: 0.12,
          transformOrigin: "50% 0",
          scrollTrigger: { trigger: ".kt-life-row", start: "top 82%", once: true },
        });
        // cooking photos move at different speeds for depth
        gsap.to(".kt-stack-back", { y: -70, ease: "none", scrollTrigger: { trigger: ".kt-story", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.to(".kt-stack-front", { y: 50, ease: "none", scrollTrigger: { trigger: ".kt-story", start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    },
    { scope }
  );

  return (
    <section id="life" className="kt-section kt-life" ref={scope}>
      <div className="kt-wrap kt-menu-head">
        <div>
          <h2 ref={heading} className="kt-h2">Off the clock</h2>
          <p className="kt-muted">What I&rsquo;m into when I&rsquo;m not building something.</p>
        </div>
      </div>

      <div className="kt-wrap kt-story">
        <div className="kt-stack" aria-hidden={false}>
          <div className="kt-stack-back">
            <Photo src={cooking.photos[0].src} alt={cooking.photos[0].alt} className="kt-stack-img" label="Add /life/cooking-1.jpg" />
          </div>
          <div className="kt-stack-front">
            <Photo src={cooking.photos[1].src} alt={cooking.photos[1].alt} className="kt-stack-img" label="Add /life/cooking-2.jpg" />
          </div>
        </div>
        <div className="kt-story-copy">
          <h3 ref={storyHeading} className="kt-story-h">{cooking.title}</h3>
          {cooking.body.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>

      <Rail />
      <div className="kt-wrap kt-life-row">
        {life.map((item, i) => (
          <div key={item.id} className="kt-life-card">
            <motion.figure
              className="kt-polaroid"
              style={{ rotate: TILTS[i % TILTS.length], transformOrigin: "50% 0" }}
              whileHover={reduce ? undefined : { rotate: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <span className="kt-clip kt-clip-sm" aria-hidden="true" />
              <div className="kt-polaroid-img">
                <Photo src={item.src} alt={item.alt} className="kt-life-img" label={`Add ${item.src}`} />
              </div>
              <figcaption>
                <span className="kt-life-title">{item.title}</span>
                <span className="kt-life-line">{item.line}</span>
              </figcaption>
            </motion.figure>
          </div>
        ))}
      </div>
    </section>
  );
}
