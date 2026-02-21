import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClick = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClick);
    return () => { window.removeEventListener('scroll', handleScroll); document.removeEventListener('mousedown', handleClick); };
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    toast.success('Bye bye! Phir milenge! 👋');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    ...(user ? [{ to: '/profile', label: 'Profile', icon: '👤' }] : []),
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <span className="nav-logo-emoji">🌈</span>
          <div className="nav-logo-text">
            <span className="nav-logo-name">Mood Internet</span>
            <span className="nav-logo-tag">Digital Dost</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="nav-actions">
          {/* Theme toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Theme badlo">
            <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <div className="theme-toggle-track">
              <div className={`theme-toggle-knob ${theme === 'light' ? 'light' : ''}`} />
            </div>
          </button>

          {user ? (
            <div className="nav-user" ref={dropRef}>
              <button className="nav-avatar-btn" onClick={() => setDropdownOpen(d => !d)}>
                <div className="nav-avatar">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="avatar" className="avatar-img" />
                  ) : (
                    <span className="avatar-initial">{(userProfile?.displayName || user.email || 'M')[0].toUpperCase()}</span>
                  )}
                  <span className="avatar-online-dot" />
                </div>
                <div className="nav-user-info">
                  <span className="nav-username">{userProfile?.displayName || 'Yaar'}</span>
                  {userProfile?.streak > 0 && (
                    <span className="nav-streak">🔥 {userProfile.streak} day streak</span>
                  )}
                </div>
                <span className={`nav-chevron ${dropdownOpen ? 'open' : ''}`}>▾</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userProfile?.photoURL
                        ? <img src={userProfile.photoURL} alt="" />
                        : <span>{(userProfile?.displayName || 'M')[0].toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <div className="dropdown-name">{userProfile?.displayName}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-stats">
                    <div className="dropdown-stat"><span>🎯</span><span>{userProfile?.totalVisits || 1}</span><span>Visits</span></div>
                    <div className="dropdown-stat"><span>🔥</span><span>{userProfile?.streak || 0}</span><span>Streak</span></div>
                    <div className="dropdown-stat"><span>📊</span><span>{userProfile?.moodHistory?.length || 0}</span><span>Moods</span></div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}><span>👤</span> My Profile</Link>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}><span>🚪</span> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/auth" className="btn-ghost nav-login-btn">Login</Link>
              <Link to="/auth?mode=register" className="btn-primary nav-register-btn">Join Free</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="nav-hamburger" onClick={() => setMobileOpen(m => !m)}>
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`mobile-link ${location.pathname === link.to ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              {link.icon} {link.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/auth" className="mobile-link" onClick={() => setMobileOpen(false)}>🔑 Login</Link>
              <Link to="/auth?mode=register" className="mobile-link mobile-register" onClick={() => setMobileOpen(false)}>✨ Join Free</Link>
            </>
          )}
          {user && (
            <button className="mobile-link mobile-logout" onClick={() => { handleLogout(); setMobileOpen(false); }}>🚪 Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
