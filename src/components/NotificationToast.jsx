import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

export default function NotificationToast() {
  const { toasts } = useEmergency();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        maxWidth: '380px',
        width: 'calc(100vw - 2.5rem)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSafe = t.type === 'safe';
        const isWarning = t.type === 'warning';

        const bg = isError
          ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
          : isSafe
          ? 'linear-gradient(135deg, #064e3b, #065f46)'
          : isWarning
          ? 'linear-gradient(135deg, #78350f, #92400e)'
          : 'linear-gradient(135deg, #1e293b, #0f172a)';

        const border = isError ? '#ef4444' : isSafe ? '#10b981' : isWarning ? '#f59e0b' : '#334155';

        return (
          <div
            key={t.id}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              color: '#fff',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              pointerEvents: 'auto',
              animation: 'modalEnter 0.25s ease-out'
            }}
          >
            {isError && <ShieldAlert size={20} color="#fca5a5" style={{ flexShrink: 0 }} />}
            {isSafe && <CheckCircle size={20} color="#86efac" style={{ flexShrink: 0 }} />}
            {isWarning && <AlertTriangle size={20} color="#fcd34d" style={{ flexShrink: 0 }} />}
            {!isError && !isSafe && !isWarning && <Info size={20} color="#93c5fd" style={{ flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
