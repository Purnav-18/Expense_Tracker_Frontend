// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link className="nav-brand" to="/">Expense Tracker</Link>
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link className="nav-login" to="/">Login / Register</Link>
        )}
      </div>

      <div className="nav-hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
    </nav>
  );
}
