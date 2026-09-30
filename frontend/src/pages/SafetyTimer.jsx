import { useEffect, useState } from "react";
import { useEmergency } from "../context/EmergencyContext.jsx";
import ShareAlert from "../components/ShareAlert.jsx";

export default function SafetyTimer() {
  const { startSOS, alert } = useEmergency();
  const [mins, setMins] = useState(10);
  const [left, setLeft] = useState(null);

  useEffect(() => {
    if (left === null) return;
    if (left <= 0) { setLeft(null); startSOS(); return; }
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]); // eslint-disable-line

  const mm = (n) => String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
  return (
    <>
      <h2>Safety Timer</h2>
      <div className="card center">
        <p>Travelling alone? Start the timer. If you do not press <b>I'm safe</b> before it ends, SOS is triggered automatically.</p>
        {left === null ? (
          <>
            <select value={mins} onChange={(e) => setMins(+e.target.value)}>
              {[1, 5, 10, 15, 30, 60].map((m) => <option key={m} value={m}>{m} minutes</option>)}
            </select>
            <button className="btn" onClick={() => setLeft(mins * 60)}>Start timer</button>
          </>
        ) : (
          <>
            <div className="timer">{mm(left)}</div>
            <button className="btn green" onClick={() => setLeft(null)}>I'm safe</button>
          </>
        )}
        {alert && <p className="danger">🚨 SOS is active</p>}
      </div>
      <ShareAlert />
    </>
  );
}
