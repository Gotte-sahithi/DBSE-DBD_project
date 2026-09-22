import React from 'react';
import { Phone, MessageSquare, Star, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function EmergencyContactCard({
  contact,
  onEdit,
  onDelete,
  onTogglePrimary,
  onSimulateAlert
}) {
  return (
    <div
      className="card"
      style={{
        borderLeft: contact.isPrimary ? '4px solid #ef4444' : '1px solid var(--border-color)',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Avatar */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: contact.avatarColor || '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              flexShrink: 0
            }}
          >
            {contact.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{contact.name}</h4>
              {contact.isPrimary && (
                <span className="badge badge-sos" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                  <Star size={11} fill="#f87171" /> Primary SOS Contact
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>
              {contact.relationship}
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {contact.phone}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {onTogglePrimary && (
            <button
              onClick={() => onTogglePrimary(contact.id)}
              style={{
                color: contact.isPrimary ? '#f59e0b' : 'var(--text-muted)',
                padding: '0.35rem',
                borderRadius: '6px'
              }}
              title={contact.isPrimary ? 'Unmark Primary' : 'Set as Primary'}
            >
              <Star size={16} fill={contact.isPrimary ? '#f59e0b' : 'transparent'} />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(contact)}
              style={{ color: 'var(--text-muted)', padding: '0.35rem', borderRadius: '6px' }}
              title="Edit contact"
            >
              <Edit2 size={16} />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(contact.id)}
              style={{ color: '#ef4444', padding: '0.35rem', borderRadius: '6px' }}
              title="Delete contact"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Trigger / Contact Dispatch Simulator */}
      <div
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        <a
          href={`tel:${contact.phone}`}
          className="btn-secondary"
          style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'center' }}
        >
          <Phone size={13} color="#10b981" /> Call
        </a>

        <a
          href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}?text=EMERGENCY!%20I%20need%20urgent%20help!%20SafeHer%20app%20alert.`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
          style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.78rem', justifyContent: 'center' }}
        >
          <MessageSquare size={13} color="#25d366" /> WhatsApp
        </a>

        {onSimulateAlert && (
          <button
            onClick={() => onSimulateAlert(contact)}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: '0.45rem 0.6rem',
              fontSize: '0.78rem',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
          >
            <ShieldAlert size={13} /> Test SOS Dispatch
          </button>
        )}
      </div>
    </div>
  );
}
