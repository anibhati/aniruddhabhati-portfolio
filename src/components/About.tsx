import useSplitReveal from "../motion/useSplitReveal";

export default function About() {
  const heading = useSplitReveal();
  return (
    <section id="about" className="kt-split kt-wrap kt-section">
      <h2 ref={heading} className="kt-h2">About</h2>
      <div className="kt-prose">
        <p>
          I&rsquo;m a sophomore at Ohio State studying Computer Science and Engineering with an AI
          specialization and a Business minor. I like understanding how something is normally done
          well enough to see where it can be done better.
        </p>
        <p>
          When I wanted to start investing but couldn&rsquo;t justify a Bloomberg terminal, I built a
          research tool out of AI agents. When a law firm&rsquo;s clients were getting stuck on
          paperwork, I built a portal that removed the forms entirely. Outside of code, cooking is one
          of my favorite hobbies. It&rsquo;s how I unwind.
        </p>
      </div>
    </section>
  );
}
