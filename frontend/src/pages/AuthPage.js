import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPage.css';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') || 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register, login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirm) { toast.error('Passwords match nahi kar rahe!'); return; }
    if (form.password.length < 6) { toast.error('Password kam se kam 6 characters ka hona chahiye!'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success(`Welcome back! 🎉`);
      } else {
        await register(form.email, form.password, form.name);
        toast.success(`Welcome to Mood Internet, ${form.name}! 🌈`);
      }
      navigate('/');
    } catch (err) {
      const msgs = { 'auth/user-not-found': 'Email nahi mila!', 'auth/wrong-password': 'Password galat hai!', 'auth/email-already-in-use': 'Ye email already registered hai!', 'auth/invalid-email': 'Email valid nahi hai!' };
      toast.error(msgs[err.code] || 'Kuch toh gadbad hai bhai!');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Google se welcome! 🎉');
      navigate('/');
    } catch (err) { toast.error('Google login fail hua!'); }
    setLoading(false);
  };

  const moods = ['😴', '😢', '⚡', '😌', '🤔', '😰', '🤩'];

  return (
    <div className="auth-page">
      {/* Floating emojis bg */}
      <div className="auth-bg-emojis">
        {moods.map((e, i) => <span key={i} className="floating-emoji" style={{ '--i': i }}>{e}</span>)}
      </div>

      <div className="auth-container">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <span className="auth-brand-logo">🌈</span>
            <h1 className="auth-brand-name">Mood Internet</h1>
            <p className="auth-brand-sub">Tera Personal Digital Dost</p>
          </div>
          <div className="auth-features">
            {[
              { icon: '🎭', title: '7 Moods', desc: 'Har mood ke liye personalized content' },
              { icon: '🤖', title: 'AI Dost', desc: 'Claude AI se baat karo apne mood pe' },
              { icon: '📊', title: 'Mood History', desc: 'Tera mood journey track karo' },
              { icon: '🔥', title: 'Daily Streak', desc: 'Consistent rehne ka reward pao' },
              { icon: '🎲', title: 'Surprises', desc: 'Random fun facts aur games' },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <div><div className="feature-title">{f.title}</div><div className="feature-desc">{f.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Login</button>
              <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Register</button>
            </div>

            <div className="auth-header">
              <h2 className="auth-title">{mode === 'login' ? 'Wapas aa gaye! 🎉' : 'Join Karo Yaar! 🌈'}</h2>
              <p className="auth-subtitle">{mode === 'login' ? 'Login karo aur apna mood check karo' : 'Free mein join karo - 30 second mein!'}</p>
            </div>

            {/* Google button */}
            <button className="google-btn" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              Google se {mode === 'login' ? 'Login' : 'Register'} Karo
            </button>

            <div className="auth-divider"><span>ya</span></div>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <div className="form-group">
                  <label>Tera Naam 😊</label>
                  <input className="input-field" type="text" placeholder="Jaise: Rahul, Priya..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
              )}
              <div className="form-group">
                <label>Email 📧</label>
                <input className="input-field" type="email" placeholder="tera@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Password 🔒</label>
                <div className="input-wrapper">
                  <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(s => !s)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              {mode === 'register' && (
                <div className="form-group">
                  <label>Confirm Password 🔒</label>
                  <input className="input-field" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
                </div>
              )}

              {mode === 'login' && (
                <div className="forgot-pass">
                  <Link to="/auth?mode=forgot" className="forgot-link">Password bhool gaye? 🤔</Link>
                </div>
              )}

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? <><span className="loading-dots"><span/><span/><span/></span> Ruko...</> : mode === 'login' ? '🚀 Login Karo' : '🌈 Account Banao'}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? 'New ho? ' : 'Already member? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="auth-switch-btn">
                {mode === 'login' ? 'Register karo!' : 'Login karo!'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
