import { useRef } from "react";
import { gallery } from "../data/gallery";
import { gsap, useGSAP } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";
import DistortImage from "./DistortImage";

export default function Gallery() {
  const section = useRef(null);
  const track = useRef(null);
  const heading = useSplitReveal();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        const dist = () => el.scrollWidth - window.innerWidth;
        const slide = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => "+=" + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(".kt-shot-frame").forEach((frame) => {
          gsap.fromTo(frame.firstElementChild, { xPercent: -7 }, {
            xPercent: 7, ease: "none",
            scrollTrigger: { trigger: frame, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
        });
      });
    },
    { scope: section }
  );

  return (
    <section id="gallery" ref={section} className="kt-gallery">
      <div ref={track} className="kt-gallery-track">
        <div className="kt-gallery-intro">
          <h2 ref={heading} className="kt-h2">Through my lens</h2>
          <p className="kt-muted">Photos I&rsquo;ve taken. Keep scrolling, and hover one.</p>
        </div>
        {gallery.map((g) => (
          <figure key={g.src} className="kt-shot">
            <div className="kt-shot-frame">
              <DistortImage src={g.src} alt={g.alt} className="kt-shot-img" />
            </div>
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
