import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const NAV = [
  { path: '/', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/journal', label: 'Journal', icon: '📓' },
  { path: '/chat', label: 'AI Companion', icon: '💬' },
  { path: '/breathe', label: 'Breathe', icon: '🌿' },
  { path: '/crisis', label: 'Crisis Support', icon: '🆘' },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moodScore, setMoodScore] = useState(null);

  useEffect(() => {
    api.get('/journals/stats').then(r => setMoodScore(r.data.avgMood)).catch(() => {});
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-shell">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">M</div>
          <div>
            <div className="logo-text">MindSpace</div>
            <div className="logo-sub">Wellness companion</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {moodScore && (
            <div className="mood-mini">
              <div className="mood-mini-label">Avg mood (7 days)</div>
              <div className="mood-mini-score">{moodScore}/10</div>
              <div className="mood-track">
                <div className="mood-track-fill" style={{ width: `${moodScore * 10}%` }} />
              </div>
            </div>
          )}
          <div className="user-card" onClick={() => navigate('/profile')}>
            <div className="avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ width: '100%', marginTop: 8, padding: '9px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', color: 'var(--text2)', fontSize: 14, fontFamily: 'var(--font)' }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Mobile header */}
        <header className="mobile-header">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="mobile-logo">MindSpace</span>
          <div className="mobile-avatar" onClick={() => navigate('/profile')}>{initials}</div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
