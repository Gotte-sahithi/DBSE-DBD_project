import { useState } from "react";
import { useEmergency } from "../context/EmergencyContext.jsx";

export default function EmergencyContacts() {
  const { contacts, addContact, removeContact } = useEmergency();
  const [f, setF] = useState({ name: "", phone: "", relation: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try { await addContact(f); setF({ name: "", phone: "", relation: "" }); } catch (x) { setErr(x.message); }
  };
  return (
    <>
      <h2>Emergency Contacts</h2>
      <form className="card" onSubmit={submit}>
        <input placeholder="Name" required value={f.name} onChange={set("name")} />
        <input placeholder="Phone (with country code, e.g. 919876543210)" required value={f.phone} onChange={set("phone")} />
        <input placeholder="Relation (Mother, Friend...)" value={f.relation} onChange={set("relation")} />
        {err && <p className="error">{err}</p>}
        <button className="btn">Add contact</button>
      </form>
      <div className="card">
        {contacts.length === 0 && <p>No contacts yet.</p>}
        {contacts.map((c) => (
          <div className="row" key={c.id}>
            <span><b>{c.name}</b> <small>{c.relation}</small><br /><small>{c.phone}</small></span>
            <button className="btn small red" onClick={() => removeContact(c.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}
