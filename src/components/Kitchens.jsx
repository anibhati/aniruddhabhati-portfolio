import { useRef } from "react";
import { kitchens } from "../data/projects";
import { gsap, useGSAP, calm } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";

export default function Kitchens() {
  const heading = useSplitReveal();
  const listRef = useRef(null);

  // divider lines draw across one by one
  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        gsap.from(".kt-line", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: listRef.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: listRef }
  );

  return (
    <section id="kitchens" className="kt-split kt-wrap kt-section">
      <h2 ref={heading} className="kt-h2">Experience</h2>
      <ul ref={listRef} className="kt-jobs">
        {kitchens.map((k) => (
          <li key={k.role}>
            <span className="kt-line" aria-hidden="true" />
            <div>
              <span className="kt-job-role">{k.role}</span>
              <span className="kt-job-place">{k.place}</span>
            </div>
            <span className="kt-job-when">{k.when}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
