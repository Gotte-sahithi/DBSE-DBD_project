import { useState } from "react";
import { Link } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext.jsx";

export default function Login() {
  const { login } = useEmergency();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await login(f.email, f.password); } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  return (
    <form className="card auth" onSubmit={submit}>
      <h1>🛡️ SafeHer</h1><p>Login to your account</p>
      <input type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" placeholder="Password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Please wait..." : "Login"}</button>
      <p>New here? <Link to="/register">Create account</Link></p>
    </form>
  );
}
