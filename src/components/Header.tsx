import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { easeOut } from "../motion/transitions";
import { Link } from "../router";
import ThemeToggle from "./ThemeToggle";
import Stamp3D from "./Stamp3D";

const links: [id: string, label: string][] = [
  ["about", "About"],
  ["menu", "Projects"],
  ["kitchens", "Experience"],
  ["life", "Life"],
  ["contact", "Contact"],
];

type HeaderProps = { home?: boolean; delay?: number };
type Enter = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition">;

export default function Header({ home = true, delay = 1.5 }: HeaderProps) {
  const reduce = useReducedMotion();
  const enter = (i: number): Enter =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: delay + i * 0.07, duration: 0.6, ease: easeOut } };

  return (
    <header className="kt-header">
      <motion.div {...enter(0)}>
        <Link to="/" className="kt-brand" aria-label="Aniruddha Bhati, home">
          <span className="kt-stamp-wrap"><Stamp3D size={58} /></span>
          <span className="kt-brand-name">Aniruddha Bhati</span>
        </Link>
      </motion.div>
      <nav aria-label="Sections" className="kt-nav">
        {links.map(([id, label], i) => (
          <motion.a
            key={id}
            href={home ? `#${id}` : `/#${id}`}
            {...enter(i + 1)}
          >
            {label}
          </motion.a>
        ))}
      </nav>
      <motion.div className="kt-header-end" {...enter(6)}>
        <ThemeToggle />
        
      </motion.div>
    </header>
  );
}
