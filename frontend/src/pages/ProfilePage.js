import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Footer from '../components/Shared/Footer';
import './ProfilePage.css';

const moodEmojis = { bored:'😴', sad:'😢', productive:'⚡', relaxed:'😌', confused:'🤔', anxious:'😰', excited:'🤩' };
const moodColors = { bored:'#FF6B6B', sad:'#74B9FF', productive:'#00B894', relaxed:'#FDCB6E', confused:'#A29BFE', anxious:'#FD79A8', excited:'#FFD93D' };

const ACHIEVEMENTS = [
  { id: 'first_mood', emoji: '🌟', title: 'First Step', desc: 'Pehli baar mood check kiya!', condition: (p) => p.moodHistory?.length >= 1 },
  { id: 'streak3', emoji: '🔥', title: '3 Day Streak', desc: '3 din lagaataar!', condition: (p) => p.streak >= 3 },
  { id: 'streak7', emoji: '💎', title: 'Week Warrior', desc: '7 din ka streak!', condition: (p) => p.streak >= 7 },
  { id: 'mood10', emoji: '📊', title: 'Mood Explorer', desc: '10 moods check kiye!', condition: (p) => p.moodHistory?.length >= 10 },
  { id: 'productive', emoji: '⚡', title: 'Go-Getter', desc: 'Productive mood use kiya!', condition: (p) => p.moodHistory?.some(m => m.mood === 'productive') },
  { id: 'allmoods', emoji: '🌈', title: 'Rainbow Soul', desc: 'Saare moods try kiye!', condition: (p) => new Set(p.moodHistory?.map(m => m.mood) || []).size >= 5 },
  { id: 'visit10', emoji: '🏆', title: 'Regular', desc: '10 baar visit kiya!', condition: (p) => p.totalVisits >= 10 },
  { id: 'visit50', emoji: '👑', title: 'Mood Master', desc: '50 baar visit kiya!', condition: (p) => p.totalVisits >= 50 },
];

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: userProfile?.displayName || '', bio: userProfile?.bio || '', favoriteEmoji: userProfile?.favoriteEmoji || '🌈' });
  const [saving, setSaving] = useState(false);

  if (!user || !userProfile) return null;

  const unlocked = ACHIEVEMENTS.filter(a => a.condition(userProfile));
  const locked = ACHIEVEMENTS.filter(a => !a.condition(userProfile));

  // Mood stats
  const moodCounts = {};
  (userProfile.moodHistory || []).forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  const handleSave = async () => {
    if (!form.displayName.trim()) { toast.error('Naam khaali nahi hona chahiye!'); return; }
    setSaving(true);
    try {
      await updateUserProfile({ displayName: form.displayName, bio: form.bio, favoriteEmoji: form.favoriteEmoji });
      toast.success('Profile update ho gayi! ✨');
      setEditing(false);
    } catch { toast.error('Update fail hua!'); }
    setSaving(false);
  };

  const emojis = ['🌈','⚡','🎯','🔥','💎','🌟','🎲','🌸','🤩','💫','🏆','🎭'];

  return (
    <div className="profile-page">
      <div className="container">
        {/* Hero banner */}
        <div className="profile-banner">
          <div className="banner-bg" style={{ background: `linear-gradient(135deg, ${moodColors[topMood?.[0]] || '#6c63ff'}33, ${moodColors[topMood?.[0]] || '#ff6b9d'}22)` }} />
          <div className="banner-content">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-ring">
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt="avatar" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-initials">
                    {(userProfile.displayName || 'M')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <span className="profile-fav-emoji">{userProfile.favoriteEmoji || '🌈'}</span>
            </div>

            {/* Info */}
            <div className="profile-info">
              {editing ? (
                <div className="edit-form">
                  <input className="input-field edit-name-input" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Tera naam" />
                  <input className="input-field edit-bio-input" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Teri bio (optional)" maxLength={100} />
                  <div className="emoji-picker">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Fav emoji:</span>
                    {emojis.map(e => (
                      <button key={e} className={`emoji-pick-btn ${form.favoriteEmoji === e ? 'selected' : ''}`} onClick={() => setForm(f => ({ ...f, favoriteEmoji: e }))}>{e}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>{saving ? 'Saving...' : '✅ Save'}</button>
                    <button className="btn-ghost" onClick={() => setEditing(false)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">{userProfile.displayName}</h1>
                  {userProfile.bio && <p className="profile-bio">{userProfile.bio}</p>}
                  <p className="profile-email">{user.email}</p>
                  <button className="btn-ghost edit-btn" onClick={() => setEditing(true)} style={{ marginTop: 8 }}>✏️ Edit Profile</button>
                </>
              )}
            </div>

            {/* Quick stats */}
            <div className="profile-quick-stats">
              {[
                { icon: '🎯', value: userProfile.totalVisits || 1, label: 'Visits' },
                { icon: '🔥', value: userProfile.streak || 0, label: 'Streak' },
                { icon: '📊', value: userProfile.moodHistory?.length || 0, label: 'Moods' },
                { icon: '🏆', value: unlocked.length, label: 'Badges' },
              ].map(s => (
                <div key={s.label} className="quick-stat">
                  <span className="qs-icon">{s.icon}</span>
                  <span className="qs-value">{s.value}</span>
                  <span className="qs-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="profile-grid">
          {/* Achievements */}
          <div className="glass-card profile-section">
            <h2 className="section-title">🏆 Achievements</h2>
            <div className="achievements-grid">
              {ACHIEVEMENTS.map(a => {
                const isUnlocked = a.condition(userProfile);
                return (
                  <div key={a.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <span className="ach-emoji">{a.emoji}</span>
                    <div className="ach-title">{a.title}</div>
                    <div className="ach-desc">{a.desc}</div>
                    {!isUnlocked && <div className="ach-lock">🔒</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mood Stats */}
          <div className="profile-right-col">
            {/* Top moods */}
            <div className="glass-card profile-section">
              <h2 className="section-title">📊 Mood Stats</h2>
              {topMood ? (
                <>
                  <div className="top-mood-card" style={{ borderColor: moodColors[topMood[0]] }}>
                    <span style={{ fontSize: '2.5rem' }}>{moodEmojis[topMood[0]]}</span>
                    <div>
                      <div style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem', textTransform: 'capitalize' }}>Most Frequent: {topMood[0]}</div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>{topMood[1]} baar feel kiya</div>
                    </div>
                  </div>
                  <div className="mood-bars">
                    {Object.entries(moodCounts).sort((a,b) => b[1]-a[1]).slice(0,5).map(([mood, count]) => (
                      <div key={mood} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                        <span style={{ width:20, textAlign:'center' }}>{moodEmojis[mood]}</span>
                        <div style={{ flex:1, background:'var(--bg-card)', borderRadius:50, height:8, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:50, background: moodColors[mood], width:`${(count / topMood[1]) * 100}%`, transition:'width 0.8s ease' }} />
                        </div>
                        <span style={{ fontSize:'0.72rem', fontWeight:800, color:'var(--text-muted)', width:18 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text-muted)', fontWeight:600 }}>
                  Abhi koi mood data nahi hai! Homepage pe jao aur mood check karo 🎭
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="glass-card profile-section">
              <h2 className="section-title">⏰ Recent Activity</h2>
              {userProfile.moodHistory?.length > 0 ? (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {userProfile.moodHistory.slice(0, 6).map((entry, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'var(--bg-card)', borderRadius:12, borderLeft:`3px solid ${moodColors[entry.mood] || '#6c63ff'}` }}>
                      <span style={{ fontSize:'1.2rem' }}>{moodEmojis[entry.mood] || '😐'}</span>
                      <span style={{ flex:1, fontWeight:700, fontSize:'0.83rem', color:'var(--text-primary)', textTransform:'capitalize' }}>{entry.mood}</span>
                      <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:600 }}>{new Date(entry.timestamp || entry.date).toLocaleDateString('hi-IN')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:'center', padding:'16px 0', color:'var(--text-muted)', fontWeight:600, fontSize:'0.85rem' }}>
                  Koi recent activity nahi! Chal mood check karo 🌈
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="glass-card profile-section danger-section">
              <h2 className="section-title" style={{ color:'#ff6b6b' }}>⚠️ Account</h2>
              <button className="btn-ghost logout-btn" onClick={logout}>🚪 Logout Ho Jao</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
