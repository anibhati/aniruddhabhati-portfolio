import { motion, useReducedMotion } from "framer-motion";

const TILTS = [-1.4, 1, -0.6, 1.3];

export default function Ticket({ project, index, selected, onPick }) {
  const reduce = useReducedMotion();
  const spring = reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 14 };
  return (
    <div className="kt-paper kt-drop">
      <motion.button
        type="button"
        className={`kt-ticket ${selected ? "is-selected" : ""}`}
        aria-pressed={selected}
        onClick={onPick}
        animate={{ y: selected ? 34 : 0, rotate: selected ? 0 : TILTS[index % TILTS.length] }}
        whileHover={reduce || selected ? undefined : { y: -10, rotate: 0 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={spring}
        style={{ transformOrigin: "50% 0" }}
      >
        <span className="kt-strip" />
        <span className="kt-row kt-small"><span>{project.started}</span><span>{project.where}</span></span>
        <span className="kt-ticket-title">{project.name}</span>
        <span className="kt-dash-line" />
        <span className="kt-ticket-short">{project.short}</span>
        {selected && <span className="kt-red kt-now">Viewing</span>}
      </motion.button>
      <div className="kt-zig" />
    </div>
  );
}
