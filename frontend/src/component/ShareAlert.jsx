import { useEmergency } from "../context/EmergencyContext.jsx";

// Buttons to send the SOS message + live tracking link to each emergency contact
export default function ShareAlert() {
  const { alert, contacts, user, trackLink, pos } = useEmergency();
  if (!alert) return null;
  const maps = pos ? `https://maps.google.com/?q=${pos.lat},${pos.lng}` : "";
  const text = `🚨 EMERGENCY! ${user.name} needs help. Live location: ${trackLink} ${maps}`;
  const digits = (p) => p.replace(/[^\d]/g, "");
  return (
    <div className="card">
      <h3>Send alert to your contacts</h3>
      {contacts.length === 0 && <p className="error">No emergency contacts saved yet. Add some in Contacts.</p>}
      {contacts.map((c) => (
        <div className="row" key={c.id}>
          <span><b>{c.name}</b> <small>{c.phone}</small></span>
          <span>
            <a className="btn small green" target="_blank" rel="noreferrer" href={`https://wa.me/${digits(c.phone)}?text=${encodeURIComponent(text)}`}>WhatsApp</a>{" "}
            <a className="btn small" href={`sms:${c.phone}?body=${encodeURIComponent(text)}`}>SMS</a>{" "}
            <a className="btn small" href={`tel:${c.phone}`}>Call</a>
          </span>
        </div>
      ))}
      <div className="row"><span><b>Police</b> <small>112</small></span><a className="btn small red" href="tel:112">Call 112</a></div>
      <p className="hint">Tracking link: <code>{trackLink}</code>{" "}
        <button className="btn small" onClick={() => navigator.clipboard?.writeText(trackLink)}>Copy</button></p>
    </div>
  );
}
