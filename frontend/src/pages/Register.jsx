import { useState } from "react";
import { Link } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext.jsx";

export default function Register() {
  const { register } = useEmergency();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await register(f); } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  return (
    <form className="card auth" onSubmit={submit}>
      <h1>🛡️ SafeHer</h1><p>Create your account</p>
      <input placeholder="Full name" required value={f.name} onChange={set("name")} />
      <input type="email" placeholder="Email" required value={f.email} onChange={set("email")} />
      <input placeholder="Phone number" value={f.phone} onChange={set("phone")} />
      <input type="password" placeholder="Password (min 6 characters)" required value={f.password} onChange={set("password")} />
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Please wait..." : "Register"}</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
