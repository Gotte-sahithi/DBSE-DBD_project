import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { Storage, defaultSettings } from '../utils/storage';
import { Settings as SettingsIcon, Volume2, Smartphone, Mic, ShieldAlert, RotateCcw, Check } from 'lucide-react';

export default function Settings() {
  const { settings, setSettings, addToast, reloadContacts, reloadProfile } = useEmergency();
  const [formSettings, setFormSettings] = useState(settings);

  const handleToggle = (key) => {
    setFormSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    Storage.setSettings(formSettings);
    setSettings(formSettings);
    addToast('Preferences saved successfully', 'safe');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings and restore demo contacts/history?')) {
      localStorage.clear();
      setSettings(defaultSettings);
      setFormSettings(defaultSettings);
      reloadContacts();
      reloadProfile();
      addToast('Application reset to initial demo seeds', 'info');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>
          <SettingsIcon size={18} />
          <span>APP PREFERENCES</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Safety Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Customize shake sensitivity, emergency voice alerts, and trigger thresholds.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Sensor & Triggers Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={18} color="#f59e0b" /> Shake & Voice Trigger Sensitivity
          </h3>

          <div className="form-group">
            <label className="form-label">Shake Detection Count</label>
            <select
              className="form-input"
              value={formSettings.shakeCountRequired || 3}
              onChange={(e) => setFormSettings({ ...formSettings, shakeCountRequired: Number(e.target.value) })}
            >
              <option value="2">2 Shakes (High sensitivity)</option>
              <option value="3">3 Shakes (Standard recommended)</option>
              <option value="4">4 Shakes (Prevents false triggers)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">SOS Countdown Abort Duration</label>
            <select
              className="form-input"
              value={formSettings.countdownDurationSeconds || 3}
              onChange={(e) => setFormSettings({ ...formSettings, countdownDurationSeconds: Number(e.target.value) })}
            >
              <option value="3">3 Seconds (Recommended)</option>
              <option value="5">5 Seconds</option>
              <option value="10">10 Seconds</option>
            </select>
          </div>
        </div>

        {/* Voice Speech Alert Card */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} color="#ec4899" /> Speech Siren & Voice Output
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Automated Voice Siren Announcement</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Speaks "Emergency SOS activated..." out loud through speaker
              </div>
            </div>
            <input
              type="checkbox"
              checked={formSettings.speechAlertVoice}
              onChange={() => handleToggle('speechAlertVoice')}
              style={{ width: '20px', height: '20px', accentColor: '#ef4444' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Auto-Share Live GPS upon SOS</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Begins continuous location updates instantly when emergency is triggered
              </div>
            </div>
            <input
              type="checkbox"
              checked={formSettings.autoShareLocationOnSOS !== false}
              onChange={() => handleToggle('autoShareLocationOnSOS')}
              style={{ width: '20px', height: '20px', accentColor: '#ef4444' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'auto', padding: '0.75rem 1.75rem' }}
          >
            <Check size={18} />
            Save Preferences
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn-secondary"
            style={{ width: 'auto', padding: '0.75rem 1.5rem', color: '#f87171' }}
          >
            <RotateCcw size={16} />
            Reset All Data to Demo Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
