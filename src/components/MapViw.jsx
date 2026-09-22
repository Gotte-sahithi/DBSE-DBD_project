import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, ShieldCheck, MapPin, Radio } from 'lucide-react';

// Custom dynamic pulsing marker icon using Leaflet DivIcon
const createPulsingMarkerIcon = (isSos = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${
          isSos ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'
        }; animation: sosPulse 1.5s infinite;"></div>
        <div style="width: 18px; height: 18px; border-radius: 50%; background: ${
          isSos ? '#ef4444' : '#10b981'
        }; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

const createSafePlaceIcon = (category) => {
  const color = category === 'police' ? '#3b82f6' : category === 'hospital' ? '#ef4444' : '#10b981';
  return L.divIcon({
    className: 'custom-place-marker',
    html: `
      <div style="background: ${color}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        📍
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

// Component to dynamically re-center the map when coordinates change
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapView({
  coords,
  isSos = false,
  safePlaces = [],
  height = '360px',
  showAccuracyCircle = true
}) {
  const centerLat = coords?.lat || 28.6304;
  const centerLng = coords?.lng || 77.2177;

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={centerLat} lng={centerLng} />

        {/* Current User Marker */}
        <Marker position={[centerLat, centerLng]} icon={createPulsingMarkerIcon(isSos)}>
          <Popup>
            <div style={{ padding: '0.25rem', color: '#1e293b' }}>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: isSos ? '#dc2626' : '#059669' }}>
                {isSos ? '🚨 SOS EMERGENCY LOCATION' : '📍 Current Verified Location'}
              </strong>
              <p style={{ margin: '0.2rem 0', fontSize: '0.78rem' }}>{coords?.address}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                Accuracy: ±{coords?.accuracy || 10}m • GPS Synced
              </p>
            </div>
          </Popup>
        </Marker>

        {showAccuracyCircle && (
          <Circle
            center={[centerLat, centerLng]}
            radius={coords?.accuracy || 25}
            pathOptions={{
              color: isSos ? '#ef4444' : '#10b981',
              fillColor: isSos ? '#ef4444' : '#10b981',
              fillOpacity: 0.15,
              weight: 1
            }}
          />
        )}

        {/* Nearby safe places markers */}
        {safePlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createSafePlaceIcon(place.category)}
          >
            <Popup>
              <div style={{ padding: '0.2rem', color: '#1e293b' }}>
                <strong style={{ fontSize: '0.85rem' }}>{place.name}</strong>
                <p style={{ fontSize: '0.75rem', margin: '0.2rem 0' }}>{place.address}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', margin: 0 }}>
                  📞 {place.phone} ({place.distance})
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating GPS Indicator Tag */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 400,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: '999px',
          padding: '0.35rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: isSos ? '#f87171' : '#34d399',
          fontWeight: 600
        }}
      >
        <Radio size={14} className={isSos ? 'animate-pulse' : ''} />
        {isSos ? 'LIVE EMERGENCY BROADCAST' : 'LIVE GPS SYNCED'}
      </div>
    </div>
  );
}
