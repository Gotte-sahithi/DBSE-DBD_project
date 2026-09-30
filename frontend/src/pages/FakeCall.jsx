import { useEffect, useState } from "react";

export default function FakeCall() {
  const [name, setName] = useState("Mom");
  const [delay, setDelay] = useState(5);
  const [phase, setPhase] = useState("setup"); // setup | waiting | ringing | talking
  const [left, setLeft] = useState(0);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (phase !== "waiting") return;
    if (left <= 0) { setPhase("ringing"); navigator.vibrate?.([500, 300, 500, 300, 500]); return; }
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left]);

  useEffect(() => {
    if (phase !== "talking") return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const end = () => { setPhase("setup"); setSecs(0); };
  const mm = (n) => String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");

  if (phase === "ringing" || phase === "talking")
    return (
      <div className="call">
        <div className="avatar">{name[0]?.toUpperCase()}</div>
        <h1>{name}</h1>
        <p>{phase === "ringing" ? "Incoming call..." : mm(secs)}</p>
        {phase === "ringing" ? (
          <div className="call-btns">
            <button className="round red" onClick={end}>✖</button>
            <button className="round green" onClick={() => setPhase("talking")}>📞</button>
          </div>
        ) : <button className="round red" onClick={end}>End</button>}
      </div>
    );

  return (
    <>
      <h2>Fake Call</h2>
      <div className="card">
        <p>Get out of an uncomfortable situation with a realistic incoming call.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Caller name" />
        <select value={delay} onChange={(e) => setDelay(+e.target.value)}>
          {[5, 10, 30, 60].map((s) => <option key={s} value={s}>Ring after {s} seconds</option>)}
        </select>
        {phase === "waiting" ? <p>Call in {left}s... <button className="btn small" onClick={end}>Cancel</button></p>
          : <button className="btn" onClick={() => { setLeft(delay); setPhase("waiting"); }}>Start fake call</button>}
      </div>
    </>
  );
}
