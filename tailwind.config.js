/** @type {import('tailwindcss').Config} */

// ============================================================
// CONCEPT 14: EXTENDING TAILWIND CONFIG
// Tailwind's default classes cover most cases, but you can
// ADD your own custom values inside `theme.extend`.
// Here we add a custom animation delay (delay-[400ms]).
// We also add bg-white/8 opacity which isn't in default Tailwind.
// ============================================================

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Custom animation delays beyond Tailwind's defaults
      transitionDelay: {
        '400': '400ms',
      },
      // Custom font family (used via font-syne class)
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
      },
      // Subtle background opacities
      backgroundColor: {
        'white/4': 'rgba(255,255,255,0.04)',
        'white/8': 'rgba(255,255,255,0.08)',
      },
      // Custom box shadows
      boxShadow: {
        'amber-glow': '0 0 40px rgba(245,158,11,0.15)',
      },
    },
  },
  plugins: [],
}