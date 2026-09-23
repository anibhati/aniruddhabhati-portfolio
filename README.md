# aniruddhabhati-portfolio

My personal site, live at [anibhati.vercel.app](https://anibhati.vercel.app).

**Stack:** React, TypeScript (strict), Vite, GSAP (ScrollTrigger, SplitText), Framer Motion, Lenis, WebGL

## Things worth looking at

- **Load-in timeline:** one GSAP timeline draws the rail, prints and swings the profile card, then reveals the headline line by line. Every step is timed relative to the last, so tuning one doesn't break the others.
- **Springs, not tweens:** hover, tilt, and selection states use spring physics, so interrupted animations carry their velocity instead of snapping.
- **Page transitions:** a small custom router uses the View Transitions API, so project titles and screenshots morph into their case study pages.
- **WebGL gallery:** a fragment shader adds a cursor-following ripple and RGB split to my photos. It only renders while hovered, so idle images cost nothing.
- **Typed content layer:** every project, photo, and job is typed. Media is keyed on a union of project ids, so a missing screenshot or a typo'd id is a compile error, not a broken page.
- **Accessibility:** all motion turns off under `prefers-reduced-motion`, and the site works in light and dark mode.

## Run it

npm install
npm run dev
npm run typecheck
