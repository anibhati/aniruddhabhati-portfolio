import { useEffect } from "react";
import "lenis/dist/lenis.css";
import "./styles/kitchen.css";
import { RouterProvider, useRouter } from "./router";
import { ScrollTrigger } from "./motion/gsap";
import { projects } from "./data/projects";
import SmoothScroll from "./motion/SmoothScroll";
import ScrollProgress from "./motion/ScrollProgress";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";

function Pages() {
  const { path } = useRouter();
  const clean = path.replace(/\/+$/, "") || "/";
  const match = clean.match(/^\/work\/([\w-]+)$/);
  const project = match && projects.find((p) => p.id === match[1]);

  useEffect(() => {
    document.title = project ? `${project.name} | Aniruddha Bhati` : clean === "/" ? "Aniruddha Bhati" : "Page not found | Aniruddha Bhati";
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [clean, project]);

  if (clean === "/") return <Home />;
  if (project) return <CaseStudy key={project.id} id={project.id} />;
  return <NotFound />;
}

export default function App() {
  return (
    <RouterProvider>
      <div className="kt-page">
        <SmoothScroll />
        <ScrollProgress />
        <Pages />
      </div>
    </RouterProvider>
  );
}
