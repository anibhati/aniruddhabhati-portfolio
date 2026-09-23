import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// mode "hover": spins once when its parent link is hovered (CSS).
// mode "follow": tilts toward the pointer anywhere on the page.
type Stamp3DProps = { size?: number; mode?: "hover" | "follow"; layers?: number };

export default function Stamp3D({ size = 58, mode = "hover", layers = 8 }: Stamp3DProps) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 110, damping: 14 });
  const sy = useSpring(ry, { stiffness: 110, damping: 14 });

  useEffect(() => {
    if (mode !== "follow" || reduce) return;
    const move = (e: PointerEvent) => {
      ry.set((e.clientX / window.innerWidth - 0.5) * 70);
      rx.set(-(e.clientY / window.innerHeight - 0.5) * 50);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mode, reduce, rx, ry]);

  const depth = size * 0.014;
  const style = { width: size, height: size, fontSize: size * 0.52, "--bw": `${Math.max(2, size * 0.05)}px` };
  const stack = Array.from({ length: layers }, (_, i) => (
    <span key={i} className="kt-s3d-layer" data-front={i === 0} style={{ transform: `translateZ(${-i * depth}px)` }}>
      AB
    </span>
  ));

  if (mode === "follow") {
    return (
      <motion.span className="kt-s3d" style={{ ...style, rotateX: sx, rotateY: sy }} aria-hidden="true">
        {stack}
      </motion.span>
    );
  }
  return (
    <span className="kt-s3d kt-s3d-hover" style={style} aria-hidden="true">
      {stack}
    </span>
  );
}
