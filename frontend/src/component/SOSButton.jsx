import { useEffect, useState } from "react";
import { useEmergency } from "../context/EmergencyContext.jsx";

export default function SOSButton({ onTriggered }) {
  const { alert, startSOS, stopSOS } = useEmergency();
  const [count, setCount] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      setCount(null);
      startSOS().then((a) => onTriggered?.(a)).catch((e) => setErr(e.message));
      return;
    }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count]); // eslint-disable-line

  if (alert)
    return (
      <div className="sos-wrap">
        <button className="sos active" onClick={stopSOS}>STOP<small>I am safe</small></button>
        <p className="danger">🚨 SOS is active - your live location is being shared.</p>
      </div>
    );
  if (count !== null)
    return (
      <div className="sos-wrap">
        <button className="sos counting" onClick={() => setCount(null)}>{count}<small>Tap to cancel</small></button>
        <p>Sending SOS... tap to cancel if pressed by mistake.</p>
      </div>
    );
  return (
    <div className="sos-wrap">
      <button className="sos" onClick={() => { setErr(""); setCount(3); }}>SOS<small>Press for help</small></button>
      {err && <p className="error">{err}</p>}
    </div>
  );
}
