// WeatherBanner.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function WeatherBanner({ onMoodSuggest }) {
  const [weather, setWeather] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        try {
          const res = await axios.get(`${API_BASE}/api/weather-mood?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          setWeather(res.data);
        } catch {}
      }, () => {});
    }
  }, []);

  if (!weather || dismissed) return null;

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, marginTop: 8 }}>
      <span style={{ fontSize: '1.8rem' }}>🌤️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Mausam ke hisaab se Mood Suggestion</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{weather.reason}</div>
      </div>
      <button onClick={() => onMoodSuggest(weather.suggestion)} style={{ background: 'linear-gradient(135deg,#6c63ff,#ff6b9d)', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
        Try {weather.suggestion} mood!
      </button>
      <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
    </div>
  );
}
