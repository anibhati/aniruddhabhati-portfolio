import { useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Menu from "../components/Menu";
import Kitchens from "../components/Kitchens";
import Toolkit from "../components/Toolkit";
import Involvement from "../components/Involvement";
import Life from "../components/Life";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import ScrollExtras from "../motion/ScrollExtras";

export default function Home() {
  // coming back from a case study lands you on the projects section
  useEffect(() => {
    const target = sessionStorage.getItem("kt-return");
    if (!target) return;
    sessionStorage.removeItem("kt-return");
    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true, offset: -24 });
      else el.scrollIntoView();
    });
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Menu />
      <Kitchens />
      <Toolkit />
      <Involvement />
      <Life />
      <Gallery />
      <Footer />
      <ScrollExtras />
    </>
  );
}
