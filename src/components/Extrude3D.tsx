import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type Extrude3DProps = { text: string; as?: ElementType; className?: string; layers?: number; depth?: number; max?: number };

export default function Extrude3D({ text, as: Tag = "h2", className = "", layers = 10, depth = 2.2, max = 16 }: Extrude3DProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 90, damping: 14 });
  const sy = useSpring(ry, { stiffness: 90, damping: 14 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return; // only while on screen
      ry.set(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * max * 2);
      rx.set(-((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * max * 1.4);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, rx, ry, max]);

  return (
    <Tag ref={ref} className={`kt-x3d-wrap ${className}`}>
      <span className="kt-sr">{text}</span>
      <motion.span className="kt-x3d" aria-hidden="true" style={{ rotateX: sx, rotateY: sy }}>
        {Array.from({ length: layers }, (_, i) => (
          <span key={i} className="kt-x3d-layer" data-front={i === 0} style={{ transform: `translateZ(${-i * depth}px)` }}>
            {text}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
