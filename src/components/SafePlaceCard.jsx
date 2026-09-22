
import React from 'react';
import { ShieldCheck, Phone, Navigation, Clock, Star, MapPin } from 'lucide-react';

export default function SafePlaceCard({ place, onSelectOnMap }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'police': return '#3b82f6';
      case 'hospital': return '#ef4444';
      case 'women_help': return '#ec4899';
      case 'pharmacy': return '#10b981';
      default: return '#f59e0b';
    }
  };

  const color = getCategoryColor(place.category);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}35`
            }}
          >
            {place.categoryLabel}
          </span>

          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            📍 {place.distance}
          </span>
        </div>

        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          {place.name}
        </h4>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
          <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          {place.address}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={13} color="#10b981" /> {place.openHours}
          </span>
          {place.rating && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" /> {place.rating} / 5.0
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <a
          href={`tel:${place.phone}`}
          className="btn-primary"
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', background: '#1e293b', border: '1px solid var(--border-color)' }}
        >
          <Phone size={14} color="#10b981" />
          Call: {place.phone}
        </a>

        {onSelectOnMap && (
          <button
            onClick={() => onSelectOnMap(place)}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
            title="Locate on map"
          >
            <Navigation size={14} color="#3b82f6" />
          </button>
        )}
      </div>
    </div>
  );
}
