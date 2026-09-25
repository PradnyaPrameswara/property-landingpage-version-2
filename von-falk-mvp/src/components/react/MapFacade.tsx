import { useState } from "react";

export default function MapFacade() {
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    return (
      <div>
        <p>Kanaalstraat 116, 1054XM Amsterdam.</p>
        <button type="button" onClick={() => setLoaded(true)}>Load map</button>
      </div>
    );
  }
  return (
    <iframe
      title="Map to Kanaalstraat 116, Amsterdam"
      src="https://www.google.com/maps?q=Kanaalstraat+116+1054XM+Amsterdam&output=embed"
      loading="lazy"
    ></iframe>
  );
}
