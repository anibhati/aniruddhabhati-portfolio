import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// Pulls its child toward the pointer, then springs back.
export default function Magnetic({ children, strength = 0.35 }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.2 });

  const move = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span style={{ x: sx, y: sy, display: "inline-flex" }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.span>
  );
}
