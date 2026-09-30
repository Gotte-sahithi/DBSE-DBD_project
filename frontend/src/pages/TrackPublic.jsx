import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import MapView from "../components/MapView.jsx";

// Page opened by emergency contacts (no login needed)
export default function TrackPublic() {
  const { token } = useParams();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    const load = () => api("/track/" + token).then(setD).catch((e) => setErr(e.message));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [token]);
  if (err) return <p className="card error">{err}</p>;
  if (!d) return <p className="center">Loading...</p>;
  return (
    <div className="card">
      <h2>{d.status === "active" ? "🚨" : "✅"} {d.name} {d.status === "active" ? "needs help" : "has ended the alert"}</h2>
      <p>Last update: {new Date(d.updated).toLocaleTimeString()} {d.phone && <>· <a href={`tel:${d.phone}`}>Call {d.phone}</a></>}</p>
      <MapView lat={d.lat} lng={d.lng} height={400} />
      {d.lat != null && <p><a target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${d.lat},${d.lng}`}>Open in Google Maps</a></p>}
      <p><a className="btn red" href="tel:112">Call Emergency 112</a></p>
    </div>
  );
}
