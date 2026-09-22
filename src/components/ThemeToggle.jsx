import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export default function ThemeToggle() {
  const btn = useRef(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const next = theme === "dark" ? "light" : "dark";

  const apply = (t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("kt-theme", t); } catch (e) { /* private mode */ }
    setTheme(t);
  };

  const toggle = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply(next);
      return;
    }
    const r = btn.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = document.startViewTransition(() => flushSync(() => apply(next)));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button ref={btn} type="button" className="kt-theme" onClick={toggle} aria-label={`Switch to ${next} mode`}>
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
