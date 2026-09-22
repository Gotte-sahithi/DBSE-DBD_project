import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { MapPin, Navigation, Share2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LocationCard() {
  const { geo, isSosActive } = useEmergency();
  const { coords, isSharing, toggleLocationSharing, refreshLocation, simulateStep } = geo;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <MapPin size={20} color={isSosActive ? '#ef4444' : '#10b981'} />
          Live Location
        </h3>
        <span className={`badge ${isSharing ? 'badge-safe' : 'badge-warning'}`}>
          {isSharing ? 'Sharing Active' : 'Sharing Paused'}
        </span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {coords?.address || 'Detecting GPS Coordinates...'}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Lat: {coords?.lat?.toFixed(5)}° N, Lng: {coords?.lng?.toFixed(5)}° E
        </p>
        <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
          Accuracy: ±{coords?.accuracy || 10} meters • Updated just now
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={toggleLocationSharing}
          className="btn-secondary"
          style={{ flex: 1, minWidth: '120px', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
        >
          <Share2 size={14} />
          {isSharing ? 'Pause Share' : 'Share Live GPS'}
        </button>

        <button
          onClick={refreshLocation}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          title="Refresh GPS"
        >
          <RefreshCw size={14} />
        </button>

        <Link
          to="/tracking"
          className="btn-primary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', width: 'auto' }}
        >
          <Navigation size={14} />
          Open Map
        </Link>
      </div>
    </div>
  );
}
