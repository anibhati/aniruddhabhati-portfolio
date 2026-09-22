import { Link } from "../router";
import Header from "../components/Header";
import Rail from "../components/Rail";
import Stamp3D from "../components/Stamp3D";

export default function NotFound() {
  return (
    <>
      <Header home={false} delay={0.1} />
      <Rail />
      <section className="kt-wrap kt-404">
        <div className="kt-paper kt-404-ticket">
          <span className="kt-clip" aria-hidden="true" />
          <div className="kt-ticket-body">
            <div className="kt-row kt-small"><span>Error</span><span>404</span></div>
            <h1 className="kt-404-h">This page doesn&rsquo;t exist.</h1>
            <hr className="kt-dash" />
            <p className="kt-404-p">The link might be old, or the page moved. Everything I&rsquo;ve built is on the home page.</p>
            <Link to="/" className="kt-btn kt-btn-ink">Back to home</Link>
          </div>
          <div className="kt-zig" />
        </div>
        <div className="kt-404-stamp">
          <Stamp3D size={280} mode="follow" layers={14} />
          <p className="kt-muted">Move your mouse around.</p>
        </div>
      </section>
    </>
  );
}
