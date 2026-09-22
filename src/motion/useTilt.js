import { useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

// Tilts an element toward the pointer. Spread `handlers` on it and merge `style`.
export default function useTilt(max = 8) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 16 });

  const onMouseMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { style: { rotateX, rotateY, transformPerspective: 800 }, handlers: { onMouseMove, onMouseLeave }, mx, my };
}
