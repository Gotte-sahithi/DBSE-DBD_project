import { Link } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext.jsx";
import MapView from "../components/MapView.jsx";
import SOSButton from "../components/SOSButton.jsx";
import ShareAlert from "../components/ShareAlert.jsx";

export default function LiveTracking() {
  const { alert, pos } = useEmergency();
  return (
    <>
      <h2>Live Tracking</h2>
      <div className="card">
        <p>{alert ? "🔴 Live tracking is ON. Your contacts can follow you using the link below." : "Live tracking starts automatically when you trigger SOS."}</p>
        <MapView lat={pos?.lat} lng={pos?.lng} />
        <SOSButton />
      </div>
      <ShareAlert />
    </>
  );
}
