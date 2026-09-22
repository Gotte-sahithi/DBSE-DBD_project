import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';
import { Shield, ShieldAlert, Volume2, VolumeX, EyeOff, User, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { isSosActive, sosType, speech } = useEmergency();
  const location = useLocation();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-secondary"
            style={{ padding: '0.45rem', display: 'flex', border: 'none', background: 'transparent' }}
            aria-label="Toggle Navigation"
          >
            <Menu size={22} color="var(--text-primary)" />
          </button>
        )}

        <Link to="/" className="nav-brand">
          <div className="brand-logo-icon">
            <Shield size={20} />
          </div>
          <div>
            <span style={{ letterSpacing: '-0.5px' }}>SafeHer</span>
            <span
              style={{
                display: 'block',
                fontSize: '0.62rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                lineHeight: 1
              }}
            >
              Women Safety & SOS
            </span>
          </div>
        </Link>
      </div>

      <div className="nav-actions">
        {/* Discreet SOS quick button */}
        <Link
          to="/discreet"
          className="btn-secondary"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', borderRadius: '999px' }}
          title="Discreet Stealth Mode"
        >
          <EyeOff size={15} color="#94a3b8" />
          <span style={{ display: 'none', mdDisplay: 'inline' }}>Stealth</span>
        </Link>

        {/* Mute/Unmute Speech synthesis toggle */}
        <button
          onClick={speech.toggleMute}
          className="btn-secondary"
          style={{ padding: '0.45rem', borderRadius: '50%' }}
          title={speech.isMuted ? 'Voice Alert Muted (Click to Unmute)' : 'Voice Alert Active'}
        >
          {speech.isMuted ? <VolumeX size={17} color="#f87171" /> : <Volume2 size={17} color="#10b981" />}
        </button>

        {/* SOS status indicator badge */}
        {isSosActive ? (
          <span className="badge badge-sos" style={{ padding: '0.35rem 0.75rem', cursor: 'pointer' }}>
            <ShieldAlert size={14} /> SOS ACTIVE
          </span>
        ) : (
          <span className="badge badge-safe" style={{ padding: '0.35rem 0.75rem' }}>
            SAFE
          </span>
        )}

        {/* Profile Link */}
        <Link
          to="/profile"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}
          title="User Profile"
        >
          <User size={18} />
        </Link>
      </div>
    </header>
  );
}
