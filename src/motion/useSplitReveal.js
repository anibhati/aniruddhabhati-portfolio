import { useRef } from "react";
import { gsap, SplitText, useGSAP, calm } from "./gsap";

// Headline lines rise out of a mask. On load (scroll: false) or when scrolled into view.
export default function useSplitReveal({ scroll = true, delay = 0 } = {}) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(calm, () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: scroll ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );
  return ref;
}
