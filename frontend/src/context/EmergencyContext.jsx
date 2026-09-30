import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { api } from "../api.js";
import useGeolocation from "../hooks/useGeolocation.js";

const Ctx = createContext(null);
export const useEmergency = () => useContext(Ctx);

export function EmergencyProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  const [contacts, setContacts] = useState([]);
  const [alert, setAlert] = useState(null); // active SOS alert
  const { pos, error: geoError } = useGeolocation();
  const posRef = useRef(null);
  posRef.current = pos;

  const loadData = useCallback(async () => {
    const [c, h] = await Promise.all([api("/contacts"), api("/alerts")]);
    setContacts(c);
    setAlert(h.find((a) => a.status === "active") || null);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api("/me")
      .then((r) => { setUser(r.user); return loadData(); })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, [loadData]);

  const saveSession = async (r) => {
    localStorage.setItem("token", r.token);
    setUser(r.user);
    await loadData();
  };
  const login = async (email, password) => saveSession(await api("/login", { method: "POST", body: { email, password } }));
  const register = async (form) => saveSession(await api("/register", { method: "POST", body: form }));
  const logout = () => { localStorage.removeItem("token"); setUser(null); setContacts([]); setAlert(null); };

  const addContact = async (c) => { const n = await api("/contacts", { method: "POST", body: c }); setContacts((p) => [...p, n]); };
  const removeContact = async (id) => { await api("/contacts/" + id, { method: "DELETE" }); setContacts((p) => p.filter((c) => c.id !== id)); };

  const startSOS = async () => {
    const p = posRef.current;
    const a = await api("/sos", { method: "POST", body: { lat: p?.lat ?? null, lng: p?.lng ?? null } });
    setAlert(a);
    return a;
  };
  const stopSOS = async () => {
    if (!alert) return;
    await api(`/sos/${alert.id}/stop`, { method: "POST" });
    setAlert(null);
  };

  // While SOS is active, push the live location to the server every 5 seconds
  useEffect(() => {
    if (!alert) return;
    const t = setInterval(() => {
      const p = posRef.current;
      if (p) api(`/sos/${alert.id}/location`, { method: "POST", body: { lat: p.lat, lng: p.lng } }).catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, [alert]);

  const trackLink = alert ? `${window.location.origin}/track/${alert.token}` : "";

  return (
    <Ctx.Provider value={{ user, loading, contacts, alert, pos, geoError, trackLink,
      login, register, logout, addContact, removeContact, startSOS, stopSOS }}>
      {children}
    </Ctx.Provider>
  );
}
