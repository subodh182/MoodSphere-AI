import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './LoginGate.css';

const moodEmojis = {
  bored: '😴', sad: '😢', productive: '⚡',
  relaxed: '😌', confused: '🤔', anxious: '😰', excited: '🤩'
};
const moodColors = {
  bored: '#FF6B6B', sad: '#74B9FF', productive: '#00B894',
  relaxed: '#FDCB6E', confused: '#A29BFE', anxious: '#FD79A8', excited: '#FFD93D'
};

export default function LoginGate({ mood, onClose }) {
  const [mode, setMode] = useState('choice'); // 'choice' | 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const accentColor = moodColors[mood] || '#6c63ff';
  const moodEmoji = moodEmojis[mood] || '🌈';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Email aur password dono chahiye!'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      // useEffect in HomePage will auto-load the pending mood
    } catch (err) {
      const msgs = {
        'auth/user-not-found': 'Email nahi mila!',
        'auth/wrong-password': 'Password galat hai!',
        'auth/invalid-credential': 'Email ya password galat hai!',
        'auth/invalid-email': 'Email valid nahi hai!'
      };
      toast.error(msgs[err.code] || 'Login fail hua, dobara try karo!');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Sab fields bharo!'); return; }
    if (form.password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye!'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success(`Welcome ${form.name}! 🌈 Ab tera mood ready hai!`);
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'Ye email already registered hai!',
        'auth/invalid-email': 'Email valid nahi hai!',
        'auth/weak-password': 'Password zyada strong banana chahiye!'
      };
      toast.error(msgs[err.code] || 'Register fail hua!');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Google se login! 🎉');
    } catch {
      toast.error('Google login fail hua!');
    }
    setLoading(false);
  };

  return (
    <div className="gate-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gate-modal" style={{ '--accent': accentColor }}>
        {/* Close button */}
        <button className="gate-close" onClick={onClose}>✕</button>

        {/* Mood preview teaser */}
        <div className="gate-teaser">
          <div className="gate-emoji-wrap">
            <span className="gate-big-emoji">{moodEmoji}</span>
            <div className="gate-emoji-glow" />
          </div>
          <div className="gate-teaser-text">
            <h2 className="gate-title">
              <span style={{ color: accentColor }}>{mood?.charAt(0).toUpperCase() + mood?.slice(1)}</span> mood ready hai!
            </h2>
            <p className="gate-sub">
              Personalized tips, AI dost, aur community — sab tera wait kar raha hai!
            </p>
          </div>
        </div>

        {/* What they'll unlock */}
        <div className="gate-features">
          {[
            { icon: '🤖', text: 'AI Dost se baat karo' },
            { icon: '✅', text: "Personalized Do's & Don'ts" },
            { icon: '💬', text: 'Motivational quotes' },
            { icon: '📊', text: 'Mood history track karo' },
            { icon: '🔥', text: 'Daily streak badges' },
          ].map((f, i) => (
            <div key={i} className="gate-feature-item">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Choice screen */}
        {mode === 'choice' && (
          <div className="gate-choice">
            <button className="gate-google-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              {loading ? 'Loading...' : 'Google se Continue Karo'}
            </button>

            <div className="gate-divider"><span>ya</span></div>

            <div className="gate-auth-btns">
              <button
                className="gate-btn gate-login-btn"
                onClick={() => setMode('login')}
                style={{ borderColor: accentColor, color: accentColor }}
              >
                🔑 Login Karo
              </button>
              <button
                className="gate-btn gate-register-btn"
                onClick={() => setMode('register')}
                style={{ background: accentColor }}
              >
                ✨ Free Register
              </button>
            </div>

            <p className="gate-skip">
              Baad mein karte hain?{' '}
              <button className="gate-skip-btn" onClick={onClose}>Skip karo →</button>
            </p>
          </div>
        )}

        {/* Login form */}
        {mode === 'login' && (
          <form className="gate-form" onSubmit={handleLogin}>
            <div className="gate-form-header">
              <button type="button" className="gate-back-btn" onClick={() => setMode('choice')}>← Back</button>
              <span>Login Karo</span>
            </div>
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <div className="gate-pass-wrap">
              <input
                className="input-field"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="button" className="gate-show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <button
              type="submit"
              className="gate-submit-btn"
              style={{ background: accentColor }}
              disabled={loading}
            >
              {loading ? 'Loading...' : `🚀 Login karke ${moodEmoji} dekho!`}
            </button>
            <p className="gate-switch-text">
              Account nahi hai?{' '}
              <button type="button" className="gate-switch-link" onClick={() => setMode('register')}>
                Register karo!
              </button>
            </p>
          </form>
        )}

        {/* Register form */}
        {mode === 'register' && (
          <form className="gate-form" onSubmit={handleRegister}>
            <div className="gate-form-header">
              <button type="button" className="gate-back-btn" onClick={() => setMode('choice')}>← Back</button>
              <span>Free Account Banao</span>
            </div>
            <input
              className="input-field"
              type="text"
              placeholder="Tera naam 😊"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <div className="gate-pass-wrap">
              <input
                className="input-field"
                type={showPass ? 'text' : 'password'}
                placeholder="Password (min 6 chars)"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <button type="button" className="gate-show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            <button
              type="submit"
              className="gate-submit-btn"
              style={{ background: accentColor }}
              disabled={loading}
            >
              {loading ? 'Creating...' : `🌈 Account banao & ${moodEmoji} dekho!`}
            </button>
            <p className="gate-switch-text">
              Already account hai?{' '}
              <button type="button" className="gate-switch-link" onClick={() => setMode('login')}>
                Login karo!
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}