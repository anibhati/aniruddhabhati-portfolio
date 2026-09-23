import { useRef, useState } from "react";
import { projects } from "../data/projects";
import { gsap, useGSAP, calm } from "../motion/gsap";
import useSplitReveal from "../motion/useSplitReveal";
import Rail from "./Rail";
import Ticket from "./Ticket";
import SpiceToggle from "./SpiceToggle";
import ProjectPanel from "./ProjectPanel";
import type { Spice } from "./SpiceToggle";
import type { Project } from "../data/types";

const isProjectId = (v: string | null): v is Project["id"] => projects.some((p) => p.id === v);

export default function Menu() {
  const [picked, setPickedState] = useState<Project["id"]>(() => {
    const saved = sessionStorage.getItem("kt-picked");
    return isProjectId(saved) ? saved : "signalspace";
  });
  const [spice, setSpice] = useState<Spice>("hot");
  const setPicked = (id: Project["id"]) => {
    sessionStorage.setItem("kt-picked", id);
    setPickedState(id);
  };
  const current = projects.find((p) => p.id === picked) ?? projects[0];
  const heading = useSplitReveal();
  const ticketsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(calm, () => {
        gsap.from(".kt-drop", {
          yPercent: -130, rotate: -10, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)", stagger: 0.12,
          transformOrigin: "50% 0",
          scrollTrigger: { trigger: ticketsRef.current, start: "top 82%", once: true },
        });
      });
    },
    { scope: ticketsRef }
  );

  return (
    <section id="menu" className="kt-section kt-menu">
      <div className="kt-wrap kt-menu-head">
        <div>
          <h2 ref={heading} className="kt-h2">Selected work</h2>
          <p className="kt-muted">Pick a project to see how it was built.</p>
        </div>
        <SpiceToggle spice={spice} setSpice={setSpice} />
      </div>
      <Rail />
      <div ref={ticketsRef} className="kt-wrap kt-tickets">
        {projects.map((p, i) => (
          <Ticket key={p.id} project={p} index={i} selected={p.id === picked} onPick={() => setPicked(p.id)} />
        ))}
      </div>
      <div className="kt-wrap">
        <ProjectPanel project={current} spice={spice} setSpice={setSpice} />
      </div>
    </section>
  );
}
