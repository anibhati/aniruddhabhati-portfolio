import type { Transition } from "framer-motion";

// A spring, or an instant change when the user prefers reduced motion.
export const spring = (reduce: boolean | null, stiffness: number, damping: number): Transition =>
  reduce ? { duration: 0 } : { type: "spring", stiffness, damping };

// expo-out style cubic bezier used across the site
export const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
