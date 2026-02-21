import React, { useState, useEffect } from 'react';
import './MoodDashboard.css';

export default function MoodDashboard({ mood, content, counter, onReset }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('advice');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [shared, setShared] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  if (!content) return null;

  const quotes = content.quotes || [{ text: content.randomQuote?.text || '', author: content.randomQuote?.author || '' }];

  const nextQuote = () => setQuoteIdx(i => (i + 1) % quotes.length);
  const prevQuote = () => setQuoteIdx(i => (i - 1 + quotes.length) % quotes.length);

  const handleShare = async () => {
    const text = `Main abhi ${content.emoji} ${mood.charAt(0).toUpperCase() + mood.slice(1)} feel kar raha hoon! Mood Internet pe check karo: ${window.location.origin} 🌈`;
    if (navigator.share) {
      await navigator.share({ title: 'Mood Internet', text });
    } else {
      navigator.clipboard?.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Main abhi ${content.emoji} ${mood} feel kar raha hoon! 🌈 ${window.location.origin}`)}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Main abhi ${content.emoji} ${mood.toUpperCase()} mood mein hoon! 🌈 #MoodInternet`)}`, '_blank');

  return (
    <div className={`dashboard ${visible ? 'visible' : ''}`}>
      <button className="back-btn btn-ghost" onClick={onReset}>← Mood Change Karo</button>

      {/* Assistant + Share Row */}
      <div className="dashboard-top-row">
        {/* Assistant card */}
        <div className="assistant-card glass-card" style={{ '--mc': content.color }}>
          <div className="assistant-avatar">
            <span className="a-emoji">{content.emoji}</span>
            <div className="a-glow" />
          </div>
          <div className="assistant-body">
            <div className="a-label" style={{ color: content.color }}>TERA DOST BOL RAHA HAI 🗣️</div>
            <p className="a-msg">"{content.assistantMsg}"</p>
          </div>
        </div>

        {/* Share card */}
        <div className="share-card glass-card">
          <div className="share-title">📢 Dosto Ko Batao!</div>
          <p className="share-sub">Tera mood share kar - they'll relate!</p>
          <div className="share-btns">
            <button className="share-btn wa-btn" onClick={shareWA}>💬 WhatsApp</button>
            <button className="share-btn tw-btn" onClick={shareTwitter}>🐦 Twitter</button>
            <button className="share-btn copy-btn" onClick={handleShare}>{shared ? '✅ Copied!' : '🔗 Copy Link'}</button>
          </div>
        </div>
      </div>

      {/* Community counter */}
      <div className="community-card glass-card" style={{ '--mc': content.color }}>
        <span className="community-emoji">👥</span>
        <span>
          Abhi tere jaise <strong>{(counter || 0).toLocaleString()}</strong> log bhi{' '}
          <strong style={{ color: content.color }}>'{content.emoji} {mood}'</strong> feel kar rahe hain.{' '}
          <span style={{ color: content.color, fontWeight: 900 }}>You are not alone! 💪</span>
        </span>
      </div>

      {/* Quotes carousel */}
      <div className="quotes-carousel glass-card">
        <div className="quotes-header"><span className="quotes-icon">💬</span> Aaj Ka Quote</div>
        <div className="quote-body">
          <button className="quote-nav" onClick={prevQuote}>◀</button>
          <div className="quote-content">
            <p className="quote-text">"{quotes[quoteIdx]?.text}"</p>
            <span className="quote-author">— {quotes[quoteIdx]?.author}</span>
          </div>
          <button className="quote-nav" onClick={nextQuote}>▶</button>
        </div>
        <div className="quote-dots">
          {quotes.map((_, i) => <span key={i} className={`quote-dot ${i === quoteIdx ? 'active' : ''}`} />)}
        </div>
      </div>

      {/* Fact */}
      {content.randomFact && (
        <div className="fact-strip glass-card">
          <span>💡</span>
          <p className="fact-text">{content.randomFact}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-card glass-card">
        <div className="tabs-nav">
          <button className={`tab-btn ${tab === 'advice' ? 'active' : ''}`} onClick={() => setTab('advice')}>✅ Do's & Don'ts</button>
          <button className={`tab-btn ${tab === 'content' ? 'active' : ''}`} onClick={() => setTab('content')}>🔗 Kya Kare Abhi</button>
        </div>
        <div className="tab-body">
          {tab === 'advice' && (
            <div className="dos-donts">
              <div className="dos-col">
                <h4 className="col-head do-head">✅ Ye Zaroor Kar</h4>
                {(content.dos || []).map((item, i) => (
                  <div key={i} className="advice-item do-item" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span>✅</span><span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="divider-v" />
              <div className="donts-col">
                <h4 className="col-head dont-head">❌ Ye Bilkul Mat Kar</h4>
                {(content.donts || []).map((item, i) => (
                  <div key={i} className="advice-item dont-item" style={{ animationDelay: `${i * 0.08 + 0.2}s` }}>
                    <span>❌</span><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'content' && content.content && (
            <div className="content-links">
              {(content.content.links || []).map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="link-item" style={{ animationDelay: `${i * 0.08}s`, '--mc': content.color }}>
                  <span className="link-icon">{l.icon}</span>
                  <span className="link-label">{l.label}</span>
                  <span className="link-arrow">→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="reset-nudge">
        Mood change hua? <button className="nudge-btn" onClick={onReset}>Dobara try karo 🔄</button>
      </div>
    </div>
  );
}
