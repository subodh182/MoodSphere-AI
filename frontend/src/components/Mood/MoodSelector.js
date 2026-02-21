import React, { useState } from 'react';
import './MoodSelector.css';

const MOODS = [
  { id: 'bored', emoji: '😴', label: 'Bored', sub: 'Kuch nahi karna', gradient: 'linear-gradient(135deg,#FF6B6B,#FFE66D)', color: '#FF6B6B' },
  { id: 'sad', emoji: '😢', label: 'Sad', sub: 'Thoda down hoon', gradient: 'linear-gradient(135deg,#74B9FF,#A29BFE)', color: '#74B9FF' },
  { id: 'productive', emoji: '⚡', label: 'Productive', sub: 'Kaam karne ka mann', gradient: 'linear-gradient(135deg,#00B894,#00CEC9)', color: '#00B894' },
  { id: 'relaxed', emoji: '😌', label: 'Relaxed', sub: 'Chill mood mein', gradient: 'linear-gradient(135deg,#FDCB6E,#E17055)', color: '#FDCB6E' },
  { id: 'confused', emoji: '🤔', label: 'Confused', sub: 'Pata nahi yaar', gradient: 'linear-gradient(135deg,#A29BFE,#FD79A8)', color: '#A29BFE' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', sub: 'Thodi tension hai', gradient: 'linear-gradient(135deg,#FD79A8,#ff6b6b)', color: '#FD79A8' },
  { id: 'excited', emoji: '🤩', label: 'Excited', sub: 'Bohot khush hoon!', gradient: 'linear-gradient(135deg,#FFD93D,#FF6B6B)', color: '#FFD93D' },
];

export default function MoodSelector({ onMoodSelect, counters }) {
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);

  const handleClick = (mood) => {
    setClicked(mood.id);
    setTimeout(() => onMoodSelect(mood.id), 280);
  };

  const total = Object.values(counters).reduce((a, b) => a + b, 0);

  return (
    <div className="selector-wrapper">
      <div className="selector-hero">
        <div className="badge selector-badge">✨ Tera Personal Digital Dost</div>
        <h2 className="selector-title">
          Aaj <span className="gradient-text">Kaisa Feel</span> Ho Raha Hai?
        </h2>
        <p className="selector-sub">Apna mood chunao — main guide karunga, judge nahi karunga! 💯</p>
      </div>

      <div className="mood-grid">
        {MOODS.map((m, i) => (
          <button
            key={m.id}
            className={`mood-card ${hovered === m.id ? 'hovered' : ''} ${clicked === m.id ? 'clicked' : ''}`}
            style={{ '--gradient': m.gradient, '--color': m.color, animationDelay: `${i * 0.08}s` }}
            onClick={() => handleClick(m)}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="card-glow-bg" />
            <span className="card-emoji">{m.emoji}</span>
            <span className="card-label font-display">{m.label}</span>
            <span className="card-sub">{m.sub}</span>
            {counters[m.id] && (
              <span className="card-count">
                <span className="count-dot" />
                {(counters[m.id] || 0).toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="selector-online">
        <span className="online-pulse" />
        🌍 {total.toLocaleString()}+ log abhi Mood Internet pe hain!
      </div>
    </div>
  );
}
