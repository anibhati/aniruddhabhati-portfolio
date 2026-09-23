import { motion } from "framer-motion";

export type Spice = "mild" | "hot";

const OPTIONS: { value: Spice; label: string }[] = [
  { value: "mild", label: "Overview" },
  { value: "hot", label: "Deep dive" },
];

// Segmented control; the white pill slides between options.
export default function SpiceToggle({ spice, setSpice }: { spice: Spice; setSpice: (s: Spice) => void }) {
  return (
    <div className="kt-spice">
      <span id="spice-label">Detail</span>
      <div role="group" aria-labelledby="spice-label" className="kt-spice-group">
        {OPTIONS.map((o) => {
          const on = spice === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              className={on ? "is-on" : ""}
              onClick={() => setSpice(o.value)}
            >
              {on && (
                <motion.span
                  layoutId="kt-pill"
                  className="kt-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="kt-pill-label">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
