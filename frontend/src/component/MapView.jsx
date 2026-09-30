// Simple OpenStreetMap embed with a marker (no API key needed)
export default function MapView({ lat, lng, height = 320 }) {
  if (lat == null || lng == null) return <div className="map-empty" style={{ height }}>Waiting for location...</div>;
  const d = 0.004;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  return <iframe title="map" className="map" style={{ height }} src={src} />;
}
