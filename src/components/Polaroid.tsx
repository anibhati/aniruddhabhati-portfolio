import { motion, useMotionTemplate, useReducedMotion, useTransform } from "framer-motion";
import useTilt from "../motion/useTilt";
import Photo from "./Photo";
import type { LifeItem } from "../data/types";

export default function Polaroid({ item, rotate }: { item: LifeItem; rotate: number }) {
  const reduce = useReducedMotion();
  const tilt = useTilt(12);
  const px = useTransform(tilt.mx, [-0.5, 0.5], [10, -10]);
  const py = useTransform(tilt.my, [-0.5, 0.5], [10, -10]);
  const gx = useTransform(tilt.mx, [-0.5, 0.5], [0, 100]);
  const gy = useTransform(tilt.my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 55%)`;

  return (
    <motion.figure
      className="kt-polaroid"
      {...tilt.handlers}
      style={{ ...tilt.style, rotate, transformOrigin: "50% 0" }}
      whileHover={reduce ? undefined : { rotate: 0, y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      <span className="kt-clip kt-clip-sm" aria-hidden="true" />
      <div className="kt-polaroid-img">
        <motion.div className="kt-polaroid-inner" style={reduce ? undefined : { x: px, y: py }}>
          <Photo src={item.src} alt={item.alt} className="kt-life-img" label={`Add ${item.src}`} />
        </motion.div>
        {!reduce && <motion.span className="kt-glare" aria-hidden="true" style={{ background: glare }} />}
      </div>
      <figcaption>
        <span className="kt-life-title">{item.title}</span>
        <span className="kt-life-line">{item.line}</span>
      </figcaption>
    </motion.figure>
  );
}
