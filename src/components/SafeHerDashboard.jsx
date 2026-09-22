import React from 'react';
import { Link } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';
import SOSButton from './SOSButton';
import LocationCard from './LocationCard';
import SafetyTimerCard from './SafetyTimerCard';
import ShakeDetector from './ShakeDetector';
import VoiceSOS from './VoiceSOS';
import AudioRecorder from './AudioRecorder';
import {
  Smartphone,
  Mic,
  PhoneCall,
  Clock,
  Share2,
  Users,
  Shield,
  MapPin,
  ArrowRight,
  EyeOff,
  Radio
} from 'lucide-react';

export default function SafeHerDashboard() {
  const {
    contacts,
    geo,
    triggerFakeCall
  } = useEmergency();

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          <Shield size={18} />
          <span>SAFEHER EMERGENCY SHIELD</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          SafeHer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.2rem' }}>
          “Your safety, one tap away.”
        </p>
      </div>

      {/* Center Circular SOS Button */}
      <SOSButton />

      {/* Quick Action Grid Below SOS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.85rem' }}>
          Instant Emergency Triggers
        </h3>
        <div className="quick-actions-grid">
          {/* Shake to SOS */}
          <Link to="/voice-sos" className="action-card-btn">
            <div className="action-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Smartphone size={22} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Shake SOS</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>3x gesture</span>
          </Link>

          {/* Voice SOS */}
          <Link to="/voice-sos" className="action-card-btn">
            <div className="action-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Mic size={22} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Voice SOS</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>"Help me"</span>
          </Link>

          {/* Fake Call */}
          <button
            onClick={() => triggerFakeCall({ callerName: 'Mom ❤️', callerPhone: '+91 98765 11111', delaySeconds: 0 })}
            className="action-card-btn"
          >
            <div className="action-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <PhoneCall size={22} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Fake Call</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Immediate</span>
          </button>

          {/* Safety Timer */}
          <Link to="/timer" className="action-card-btn">
            <div className="action-card-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
              <Clock size={22} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Safety Timer</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto SOS</span>
          </Link>

          {/* Share Location */}
          <Link to="/tracking" className="action-card-btn">
            <div className="action-card-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Share2 size={22} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Share GPS</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live Map</span>
          </Link>
        </div>
      </div>

      {/* Status Cards Grid */}
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.85rem' }}>
        Safety Status & Monitoring
      </h3>
      <div className="status-grid" style={{ marginBottom: '2rem' }}>
        {/* Current Location Card */}
        <LocationCard />

        {/* Safety Timer Card */}
        <SafetyTimerCard />

        {/* Emergency Contacts Summary Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={20} color="#ec4899" />
              Emergency Contacts
            </h3>
            <span className="badge badge-safe">
              {contacts.length} Connected
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {contacts.slice(0, 2).map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.relationship} • {c.phone}</div>
                </div>
                {c.isPrimary && (
                  <span className="badge badge-sos" style={{ fontSize: '0.65rem' }}>
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>

          <Link
            to="/contacts"
            className="btn-secondary"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.82rem', justifyContent: 'center' }}
          >
            Manage Contacts ({contacts.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* Live Protection Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Radio size={20} color="#8b5cf6" />
              Real-Time Protection
            </h3>
            <span className={`badge ${geo.isSharing ? 'badge-safe' : 'badge-warning'}`}>
              {geo.isSharing ? 'Live Broadcast' : 'Offline'}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Emergency contacts automatically receive live tracking URLs with Google Maps & OpenStreetMap pinpoint coordinates when SOS is triggered.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/safe-places"
              className="btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <MapPin size={14} color="#3b82f6" /> Safe Places
            </Link>
            <Link
              to="/discreet"
              className="btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <EyeOff size={14} color="#f59e0b" /> Stealth SOS
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Audio Evidence Recorder */}
      <div style={{ marginBottom: '2rem' }}>
        <AudioRecorder />
      </div>

      {/* Inline Quick Sensor Detectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <ShakeDetector />
        <VoiceSOS />
      </div>
    </div>
  );
}
