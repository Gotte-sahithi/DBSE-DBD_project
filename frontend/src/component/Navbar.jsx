import { NavLink } from "react-router-dom";
import { useEmergency } from "../context/EmergencyContext.jsx";

const links = [
  ["/", "Home"], ["/contacts", "Contacts"], ["/tracking", "Live Tracking"], ["/nearby", "Safe Places"],
  ["/fake-call", "Fake Call"], ["/timer", "Safety Timer"], ["/history", "History"],
];

export default function Navbar() {
  const { user, logout, alert } = useEmergency();
  return (
    <header className="nav">
      <div className="brand">🛡️ SafeHer {alert && <span className="badge">SOS ACTIVE</span>}</div>
      <nav>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>{label}</NavLink>
        ))}
      </nav>
      <div className="who">{user?.name} <button className="btn small" onClick={logout}>Logout</button></div>
    </header>
  );
}
