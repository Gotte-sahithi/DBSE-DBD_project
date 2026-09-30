import { useEmergency } from "../context/EmergencyContext.jsx";
import MapView from "../components/MapView.jsx";

const places = [["🚓 Police stations", "police station"], ["🏥 Hospitals", "hospital"],
  ["💊 Pharmacies", "pharmacy"], ["⛽ Petrol pumps (open late)", "petrol pump"], ["🏨 Hotels", "hotel"]];

export default function NearbySafePlaces() {
  const { pos } = useEmergency();
  const url = (q) => `https://www.google.com/maps/search/${encodeURIComponent(q)}${pos ? `/@${pos.lat},${pos.lng},15z` : ""}`;
  return (
    <>
      <h2>Nearby Safe Places</h2>
      <div className="card">
        <MapView lat={pos?.lat} lng={pos?.lng} height={240} />
        {places.map(([label, q]) => (
          <div className="row" key={q}>
            <span>{label}</span>
            <a className="btn small" target="_blank" rel="noreferrer" href={url(q + " near me")}>Find nearby</a>
          </div>
        ))}
      </div>
    </>
  );
}
