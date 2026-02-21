import React, { useState } from 'react';
import axios from 'axios';
import './SurpriseButton.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function SurpriseButton() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setOpen(true); setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/surprise`);
      setData(res.data);
    } catch {
      const facts = [
        { fact: "Octopus ke 3 dil hote hain! 🐙", url: "https://theuselessweb.com/" },
        { fact: "Honey 3000 saal tak kharab nahi hoti! 🍯", url: "https://en.wikipedia.org/wiki/Honey" },
        { fact: "Pandas ke 6 fingers hote hain bamboo ke liye! 🐼", url: "https://theuselessweb.com/" },
      ];
      setData(facts[Math.floor(Math.random() * facts.length)]);
    }
    setLoading(false);
  };

  const ding = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.4, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  return (
    <>
      <button className="surprise-fab" onClick={() => { ding(); handleClick(); }} title="Surprise Me!">
        <span className="fab-emoji">🎲</span>
        <span className="fab-text">Surprise!</span>
        <div className="fab-ring" /><div className="fab-ring fab-ring2" />
      </button>

      {open && (
        <div className="surprise-overlay" onClick={() => { setOpen(false); setData(null); }}>
          <div className="surprise-modal" onClick={e => e.stopPropagation()}>
            <button className="surprise-close" onClick={() => { setOpen(false); setData(null); }}>✕</button>
            <span style={{ fontSize: '3rem', animation: 'star-spin 3s linear infinite', display: 'block', textAlign: 'center' }}>🎲</span>
            <h3 style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>Tera Surprise!</h3>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><div className="loading-dots"><span/><span/><span/></div></div>
            ) : data ? (
              <div style={{ background: 'rgba(162,155,254,0.1)', border: '1px solid rgba(162,155,254,0.25)', borderRadius: 16, padding: 16, textAlign: 'left' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6 }}>💡 {data.fact}</p>
                <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 12, background: 'linear-gradient(135deg,#a29bfe,#fd79a8)', color: 'white', borderRadius: 10, padding: '9px 16px', textAlign: 'center', textDecoration: 'none', fontFamily: "'Baloo 2',cursive", fontWeight: 700 }}>
                  Aur Explore Kar 🚀
                </a>
              </div>
            ) : null}
            <button style={{ background: 'var(--badge-bg)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '9px 20px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontWeight: 800, width: '100%' }} onClick={handleClick}>
              🔄 Ek Aur Surprise!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
