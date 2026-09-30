import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function EmergencyHistory() {
  const [items, setItems] = useState(null);
  useEffect(() => { api("/alerts").then(setItems).catch(() => setItems([])); }, []);
  const fmt = (s) => (s ? new Date(s).toLocaleString() : "-");
  return (
    <>
      <h2>Emergency Alert History</h2>
      <div className="card">
        {items === null && <p>Loading...</p>}
        {items?.length === 0 && <p>No alerts yet.</p>}
        {items?.map((a) => (
          <div className="row" key={a.id}>
            <span>
              <b>{fmt(a.started)}</b><br />
              <small>Ended: {fmt(a.ended)} · Location updates: {a.points}</small>
              {a.lat != null && <><br /><a target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${a.lat},${a.lng}`}>Last location</a></>}
            </span>
            <span className={a.status === "active" ? "badge" : "badge gray"}>{a.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
