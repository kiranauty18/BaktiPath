import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="site-navbar">
      <div className="site-navbar-container">
        {/* Logo & Brand */}
        <Link to="/" className="site-brand" onClick={closeMenu}>
          <div className="site-brand-icon">
            <img
              src="/images/radhaRaman.png"
              alt="Shri Radha Raman Ji"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="brand-fallback-om">ॐ</span>
          </div>
          <div className="site-brand-text">
            <strong>Bhakti Seva Dham</strong>
            <small>Shri Radha Raman &amp; Banke Bihari Seva</small>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="site-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `site-nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `site-nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            Daily Quiz
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `site-nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            Leaderboard
          </NavLink>

          <NavLink
            to="/katha"
            className={({ isActive }) =>
              `site-nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            Katha &amp; Bhajans
          </NavLink>

          <NavLink
            to="/jap"
            className={({ isActive }) =>
              `nav-jap-badge ${isActive ? "jap-active" : ""}`
            }
          >
            <span>📿 Naam Jap</span>
          </NavLink>

          <NavLink
            to="/seva"
            className={({ isActive }) =>
              `site-nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            Voluntary Seva
          </NavLink>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="nav-menu-toggle"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="site-nav-drawer">
          <NavLink to="/" end onClick={closeMenu} className="drawer-link">
            Home
          </NavLink>
          <NavLink to="/quiz" onClick={closeMenu} className="drawer-link">
            Daily Quiz
          </NavLink>
          <NavLink
            to="/leaderboard"
            onClick={closeMenu}
            className="drawer-link"
          >
            Leaderboard
          </NavLink>
          <NavLink to="/katha" onClick={closeMenu} className="drawer-link">
            Katha &amp; Bhajans
          </NavLink>
          <NavLink to="/jap" onClick={closeMenu} className="drawer-link-jap">
            📿 Naam Jap Counter
          </NavLink>
          <NavLink to="/seva" onClick={closeMenu} className="drawer-link">
            Voluntary Seva
          </NavLink>
        </div>
      )}
    </nav>
  );
}
