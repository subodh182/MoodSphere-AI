import React from 'react';

const moodColors = { bored:'#FF6B6B', sad:'#74B9FF', productive:'#00B894', relaxed:'#FDCB6E', confused:'#A29BFE', anxious:'#FD79A8', excited:'#FFD93D' };
const moodEmojis = { bored:'😴', sad:'😢', productive:'⚡', relaxed:'😌', confused:'🤔', anxious:'😰', excited:'🤩' };

export default function MoodGraph({ history }) {
  if (!history || history.length < 2) return null;

  // Count mood frequencies
  const counts = {};
  history.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
  const max = Math.max(...Object.values(counts));
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18, fontSize: '1rem' }}>
        📈 Mood Frequency
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(([mood, count]) => (
          <div key={mood} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, fontSize: '1.1rem', textAlign: 'center' }}>{moodEmojis[mood]}</span>
            <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 50, height: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 50, background: moodColors[mood] || '#6c63ff', width: `${(count / max) * 100}%`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: `0 0 8px ${moodColors[mood]}66` }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>{count}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 12, textAlign: 'center' }}>Tera mood pattern dekh bhai! 👆</p>
    </div>
  );
}
