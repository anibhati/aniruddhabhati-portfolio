import { useState } from "react";

// Shows the image if it exists, otherwise a labeled placeholder telling you where to put it.
export default function Photo({ src, alt, className = "", label }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className={`kt-ph ${className}`} role="img" aria-label={alt}>
        <span>{label ?? `Add ${src} to /public`}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setMissing(true)} loading="lazy" />;
}
