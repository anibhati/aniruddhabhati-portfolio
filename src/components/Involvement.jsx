import { involvement } from "../data/profile";
import useSplitReveal from "../motion/useSplitReveal";

export default function Involvement() {
  const heading = useSplitReveal();
  return (
    <section id="involvement" className="kt-split kt-wrap kt-section">
      <h2 ref={heading} className="kt-h2">Involvement</h2>
      <ul className="kt-involve">
        {involvement.map((x) => (
          <li key={x.name}>
            <div className="kt-row">
              <span className="kt-job-role">{x.name}</span>
              <span className="kt-job-when">{x.when}</span>
            </div>
            <p>{x.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
