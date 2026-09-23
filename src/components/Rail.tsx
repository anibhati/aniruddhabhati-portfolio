import { useRef } from "react";
import { gsap, useGSAP, calm } from "../motion/gsap";

// The steel rail draws itself in from the left when it scrolls into view.
export default function Rail() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        gsap.from(ref.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
        });
      });
    },
    { scope: ref }
  );
  return <div ref={ref} className="kt-rail" aria-hidden="true" />;
}
