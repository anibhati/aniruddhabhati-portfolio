import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { media } from "../data/media";
import { Link } from "../router";
import Photo from "./Photo";
import type { ReactNode } from "react";
import type { Variants } from "framer-motion";
import type { Project } from "../data/types";
import type { Spice } from "./SpiceToggle";
import { spring } from "../motion/transitions";

function Block({ title, children, red = false }: { title: string; children: ReactNode; red?: boolean }) {
  return (
    <div className="kt-block">
      <h4 className={red ? "kt-h4 kt-red" : "kt-h4"}>{title}</h4>
      <p>{children}</p>
    </div>
  );
}

const list: Variants = { show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } };
const chip: Variants = { hidden: { opacity: 0, y: 10, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } };

type PanelProps = { project: Project; spice: Spice; setSpice: (s: Spice) => void };

export default function ProjectPanel({ project, spice, setSpice }: PanelProps) {
  const reduce = useReducedMotion();
  const t = spring(reduce, 200, 24);
  const m = media[project.id];

  return (
    <div className="kt-pass" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? {} : { opacity: 0, transition: { duration: 0.15 } }}
        >
          <div className="kt-pass-head">
            <h3 className="kt-h3" aria-label={project.name} style={{ viewTransitionName: `title-${project.id}` }}>
              {project.name.split("").map((c, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="kt-char"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ ...t, delay: reduce ? 0 : i * 0.025 }}
                >
                  {c}
                </motion.span>
              ))}
            </h3>
            <span className="kt-small">{project.role}</span>
          </div>

          <div className="kt-pass-top">
            <p className="kt-pass-lead">{project.mild}</p>
            {m.src && (
              <motion.figure
                className="kt-media"
                style={{ viewTransitionName: `media-${project.id}` }}
                initial={reduce ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
              >
                <Photo src={m.src} alt={m.alt} className="kt-media-img" label={`Add ${m.src} to /public`} />
              </motion.figure>
            )}
          </div>

          <div className="kt-links">
            <Link to={`/work/${project.id}`} onClick={() => sessionStorage.setItem("kt-picked", project.id)}>
              Open the full case study
            </Link>
            {m.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>

          <AnimatePresence initial={false} mode="wait">
            {spice === "hot" ? (
              <motion.div
                key="hot"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={t}
                style={{ overflow: "hidden" }}
              >
                <div className="kt-grid2 kt-dash-top">
                  <Block title="The problem">{project.recipe}</Block>
                  <Block title="What I did differently" red>{project.pot}</Block>
                  <Block title="What broke first">{project.burnt}</Block>
                  <Block title="Outcome">{project.plated}</Block>
                </div>
                <div className="kt-block">
                  <h4 className="kt-h4">Stack</h4>
                  <motion.ul className="kt-chips" variants={list} initial="hidden" animate="show">
                    {project.stack.map((s) => (
                      <motion.li key={s} variants={chip} transition={t}>{s}</motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mild"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={t}
                style={{ overflow: "hidden" }}
              >
                <div className="kt-block kt-dash-top">
                  <h4 className="kt-h4">Outcome</h4>
                  <p>{project.plated}</p>
                  <button type="button" className="kt-red kt-heat" onClick={() => setSpice("hot")}>
                    Read the full breakdown
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
