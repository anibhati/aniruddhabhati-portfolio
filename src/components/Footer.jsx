import useSplitReveal from "../motion/useSplitReveal";
import Magnetic from "../motion/Magnetic";

export default function Footer() {
  const heading = useSplitReveal();
  return (
    <footer id="contact" className="kt-footer">
      <div className="kt-wrap">
        <h2 ref={heading} className="kt-footer-h">Let&rsquo;s talk.</h2>
        <div className="kt-footer-links">
          <Magnetic strength={0.2}><a href="mailto:bhati.27@osu.edu">bhati.27@osu.edu</a></Magnetic>
          <Magnetic strength={0.2}><a href="https://github.com/anibhati" target="_blank" rel="noreferrer">github.com/anibhati</a></Magnetic>
          <Magnetic strength={0.2}><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">[YOUR LINKEDIN URL]</a></Magnetic>
        </div>
        <div className="kt-footer-base">
          <span>Aniruddha Singh Bhati, Columbus, OH</span>
          <span>Designed and built by me</span>
        </div>
      </div>
    </footer>
  );
}
