import { useState } from "react";

export default function MapFacade() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="vf-map-facade" role="region" aria-label="Location map">
        <div style={{ textAlign: "center" }}>
          <p>Kanaalstraat 116, 1054XM Amsterdam.</p>
          <button type="button" onClick={() => setLoaded(true)}>Load map</button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title="Map to Kanaalstraat 116, Amsterdam"
      src="https://www.google.com/maps?q=Kanaalstraat+116+1054XM+Amsterdam&output=embed"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
