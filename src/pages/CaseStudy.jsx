import { useRef } from "react";
import { projects } from "../data/projects";
import { media } from "../data/media";
import { Link } from "../router";
import { gsap, useGSAP, calm } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";
import Header from "../components/Header";
import Rail from "../components/Rail";
import Photo from "../components/Photo";
import Footer from "../components/Footer";

function Section({ title, children, red }) {
  const heading = useSplitReveal();
  return (
    <section className="kt-cs-section">
      <h2 ref={heading} className={red ? "kt-cs-h kt-signal" : "kt-cs-h"}>{title}</h2>
      <p>{children}</p>
    </section>
  );
}

export default function CaseStudy({ id }) {
  const index = projects.findIndex((p) => p.id === id);
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  const m = media[id] ?? { links: [] };
  const scope = useRef(null);
  const back = () => sessionStorage.setItem("kt-return", "menu");

  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        gsap.from(".kt-cs-intro > *", { y: 24, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.15 });
        gsap.fromTo(".kt-cs-media > *", { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: ".kt-cs-media", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope, dependencies: [id], revertOnUpdate: true }
  );

  return (
    <>
      <Header home={false} delay={0.1} />
      <Rail />
      <article ref={scope} className="kt-wrap kt-cs">
        <Link to="/" className="kt-back" onClick={back}>All projects</Link>

        <div className="kt-cs-head">
          <h1 className="kt-cs-title" style={{ viewTransitionName: `title-${p.id}` }}>{p.name}</h1>
          <div className="kt-cs-intro">
            <p className="kt-cs-meta"><span>{p.started}</span><span>{p.where}</span><span>{p.role}</span></p>
            <p className="kt-cs-lead">{p.mild}</p>
            {m.links.length > 0 && (
              <div className="kt-cs-links">
                {m.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        {m.src && (
          <figure className="kt-cs-media" style={{ viewTransitionName: `media-${p.id}` }}>
            <Photo src={m.src} alt={m.alt} className="kt-cs-img" label={`Add ${m.src} to /public`} />
          </figure>
        )}

        <div className="kt-cs-body">
          <Section title="The problem">{p.recipe}</Section>
          <Section title="What I did differently" red>{p.pot}</Section>
          <Section title="What broke first">{p.burnt}</Section>
          <Section title="Outcome">{p.plated}</Section>
        </div>

        <div className="kt-cs-stack">
          <h2 className="kt-cs-h">Stack</h2>
          <ul className="kt-tools">
            {p.stack.map((s) => <li key={s} className="kt-tool">{s}</li>)}
          </ul>
        </div>

        <Link to={`/work/${next.id}`} className="kt-cs-next" onClick={() => sessionStorage.setItem("kt-picked", next.id)}>
          <span className="kt-muted">Next project</span>
          <span className="kt-cs-next-name">{next.name}</span>
        </Link>
      </article>
      <Footer />
    </>
  );
}
