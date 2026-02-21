import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '36px 0 20px', marginTop: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem', animation: 'float 4s ease-in-out infinite', display: 'block' }}>🌈</span>
            <div>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff)', backgroundSize: '300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>Mood Internet</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tera Personal Digital Dost</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🔒 No Data Sold', '🚫 No Ads', '💯 Free Forever', '🤖 AI Powered'].map(b => (
              <span key={b} style={{ background: 'var(--badge-bg)', border: '1px solid var(--border-color)', borderRadius: 50, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{b}</span>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-color)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 24 }}>
          {[
            { title: 'Moods 🎭', items: ['😴 Bored','😢 Sad','⚡ Productive','😌 Relaxed','🤔 Confused','😰 Anxious','🤩 Excited'] },
            { title: 'Features ✨', items: ['🤖 AI Chat','📊 Mood History','🎲 Surprise Button','👥 Community','🔥 Streak Badges','🌤️ Weather Mood','🔗 Share Mood'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 10 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.items.map(item => <span key={item} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item}</span>)}
              </div>
            </div>
          ))}
          <div>
            <div style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 10 }}>About 💡</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7 }}>Mood Internet ek aisa platform hai jahan tera mood decide karta hai ki tujhe kya chahiye. No ads, no tracking — bas pure dosti!</p>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>© {new Date().getFullYear()} Mood Internet. Made with ❤️ in India 🇮🇳</span>
          <span style={{ fontFamily: "'Baloo 2',cursive", fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 700 }}>"Har din ek naya mauka hai! 🌟"</span>
        </div>
      </div>
    </footer>
  );
}
