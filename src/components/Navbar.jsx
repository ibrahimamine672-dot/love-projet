import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const navLinks = [
  { path: '/', labelKey: 'home', icon: '🏠' },
  { path: '/reasons', labelKey: 'reasons', icon: '💝' },
  { path: '/letter', labelKey: 'letter', icon: '💌' },
  { path: '/dreams', labelKey: 'dreams', icon: '✨' },
  { path: '/vault', labelKey: 'vault', icon: '🔐' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedLinks, setClickedLinks] = useState(new Set());
  const timersRef = useRef({});
  const { t, toggleLanguage, language } = useLanguage();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const clearLinkTimer = (path) => {
    if (timersRef.current[path]) {
      clearTimeout(timersRef.current[path]);
      delete timersRef.current[path];
    }
  };

  const handleNavClick = (path) => {
    // Show "Salma" immediately
    setClickedLinks(prev => new Set(prev).add(path));
    closeMenu();

    // Clear any previous timer for this link
    clearLinkTimer(path);

    // Auto-revert after 1.5s
    timersRef.current[path] = setTimeout(() => {
      setClickedLinks(prev => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
      delete timersRef.current[path];
    }, 1500);
  };

  // Safety net: clear all timers and reset state on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  const getLabel = (key) => t.nav[key];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">❤️</span>
          <span className="logo-text">{t.common.logo}</span>
        </Link>

        <div className="nav-right">
          <button
            className="lang-toggle"
            onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}
            aria-label={t.common.toggleLang}
          >
            <span className="lang-flag">{language === 'en' ? '🇫🇷' : '🇬🇧'}</span>
            <span className="lang-label">{t.common.toggleLang}</span>
          </button>

          <button
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => handleNavClick(link.path)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">
                {clickedLinks.has(link.path) ? 'Salma' : getLabel(link.labelKey)}
              </span>
              {location.pathname === link.path && (
                <motion.div
                  className="nav-active-indicator"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
