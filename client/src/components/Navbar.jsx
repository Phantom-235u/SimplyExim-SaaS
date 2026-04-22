import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        <Logo size={34} />
        <h2>EXPORT<span>GUARD</span></h2>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/dashboard" end className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>📊</span> Dashboard
        </NavLink>
        <NavLink to="/compliance" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>🛡️</span> Compliance
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          <span>📋</span> History
        </NavLink>
      </div>

      {user && (
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="navbar-username">{user.name}</span>
          {user.plan && user.plan !== 'free' && (
            <span style={{ padding: '2px 8px', borderRadius: '50px', fontSize: '10px', fontWeight: 700, background: user.plan === 'enterprise' ? '#F0FDF4' : '#E8DEFF', color: user.plan === 'enterprise' ? '#16A34A' : '#3A0CA3' }}>
              {user.plan.toUpperCase()}
            </span>
          )}
          <button className="navbar-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
