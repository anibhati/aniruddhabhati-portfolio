import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const calm = "(prefers-reduced-motion: no-preference)";
export { gsap, ScrollTrigger, SplitText, useGSAP };
