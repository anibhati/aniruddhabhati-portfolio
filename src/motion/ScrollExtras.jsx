import { gsap, useGSAP, calm } from "./gsap";

// Page-wide scrubbed effects that don't belong to one component.
export default function ScrollExtras() {
  useGSAP(() => {
    gsap.matchMedia().add(calm, () => {
      // footer headline grows as the footer comes up
      gsap.fromTo(
        ".kt-footer-h",
        { scale: 0.82, opacity: 0.35, transformOrigin: "left bottom" },
        { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ".kt-footer", start: "top bottom", end: "top 30%", scrub: 1 } }
      );
      // project screenshots drift slightly inside their frame
      gsap.utils.toArray(".kt-media").forEach((el) => {
        gsap.fromTo(el.querySelector("img, .kt-ph"), { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });
  });
  return null;
}
