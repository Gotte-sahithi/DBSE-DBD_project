import { useState } from "react";
import { Link } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext.jsx";
import SOSButton from "../components/SOSButton.jsx";
import ShareAlert from "../components/ShareAlert.jsx";
import MapView from "../components/MapView.jsx";
import useShakeDetector from "../hooks/useShakeDetector.js";

export default function Dashboard() {
  const { user, pos, geoError, alert, startSOS, contacts } = useEmergency();
  const [shake, setShake] = useState(false);
  useShakeDetector(() => { if (!alert) startSOS(); }, shake);

  return (
    <>
      <h2>Hello, {user.name} 👋</h2>
      <div className="grid">
        <div className="card center">
          <SOSButton />
          <label className="hint"><input type="checkbox" checked={shake} onChange={(e) => setShake(e.target.checked)} /> Shake phone to trigger SOS</label>
        </div>
        <div className="card">
          <h3>📍 Your location</h3>
          {geoError && <p className="error">{geoError}</p>}
          {pos && <p>Lat {pos.lat.toFixed(5)}, Lng {pos.lng.toFixed(5)} <small>(±{pos.acc} m)</small></p>}
          <MapView lat={pos?.lat} lng={pos?.lng} height={240} />
        </div>
      </div>
      <ShareAlert />
      {contacts.length === 0 && !alert && (
        <p className="card warn">⚠️ You have no emergency contacts yet. <Link to="/contacts">Add contacts</Link></p>
      )}
    </>
  );
}
