import React from 'react';

const moodEmojis = { bored:'😴', sad:'😢', productive:'⚡', relaxed:'😌', confused:'🤔', anxious:'😰', excited:'🤩' };
const moodColors = { bored:'#FF6B6B', sad:'#74B9FF', productive:'#00B894', relaxed:'#FDCB6E', confused:'#A29BFE', anxious:'#FD79A8', excited:'#FFD93D' };

export default function MoodHistory({ sessionHistory, userHistory }) {
  const history = userHistory?.slice(0, 8) || sessionHistory || [];
  if (!history.length) return null;

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem' }}>
        📊 Mood History
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 12, borderLeft: `3px solid ${moodColors[entry.mood] || '#6c63ff'}` }}>
            <span style={{ fontSize: '1.3rem' }}>{moodEmojis[entry.mood] || '😐'}</span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{entry.mood}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{entry.time || new Date(entry.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
