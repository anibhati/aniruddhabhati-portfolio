import { useRef } from "react";
import { toolkit } from "../data/profile";
import { gsap, useGSAP, calm } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";

export default function Toolkit() {
  const heading = useSplitReveal();
  const gridRef = useRef(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        gsap.from(".kt-tool", {
          y: 14,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: { each: 0.025, from: "start" },
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: gridRef }
  );

  return (
    <section id="toolkit" className="kt-split kt-wrap kt-section">
      <h2 ref={heading} className="kt-h2">Toolkit</h2>
      <div ref={gridRef} className="kt-toolkit">
        {toolkit.map((g) => (
          <div key={g.group}>
            <h3 className="kt-tool-group">{g.group}</h3>
            <ul className="kt-tools">
              {g.items.map((i) => (
                <li key={i} className="kt-tool">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
