import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { checkApiHealth } from '../services/api';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const lang = i18n.language || 'en';
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    const ping = () => checkApiHealth().then(setApiOnline);
    ping();
    const interval = setInterval(ping, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-eco-green dark:bg-eco-green/90 text-white p-4 shadow-lg dark:shadow-gray-900/20" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold flex items-center" aria-label="Urban Harvest Hub home">
          <span className="mr-2" aria-hidden="true">🌱</span> Urban Harvest Hub
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          {apiOnline !== null && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                apiOnline ? 'bg-white/20 text-white' : 'bg-red-500/90 text-white'
              }`}
              title={apiOnline ? 'Backend API is running' : 'Backend API is not running – start the server to load data'}
              aria-live="polite"
            >
              {apiOnline ? '● API online' : '○ API offline'}
            </span>
          )}
          <Link to="/" className="hover:text-harvest-gold transition">{t('nav.home')}</Link>
          <Link to="/workshops" className="hover:text-harvest-gold transition">{t('nav.workshops')}</Link>
          <Link to="/events" className="hover:text-harvest-gold transition">{t('nav.events')}</Link>
          <Link to="/products" className="hover:text-harvest-gold transition">{t('nav.products')}</Link>
          <Link to="/booking" className="bg-earth-brown px-4 py-2 rounded hover:bg-opacity-90">
            {t('nav.bookNow')}
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-harvest-gold transition">{t('nav.admin')}</Link>
          )}
          <div className="flex items-center gap-2" role="group" aria-label="Theme">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-eco-green"
              aria-pressed={theme === 'dark'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => { i18n.changeLanguage('en'); if (typeof localStorage !== 'undefined') localStorage.setItem('lang', 'en'); }}
              className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-white/20 font-medium' : ''}`}
              aria-pressed={lang === 'en'}
              aria-label="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => { i18n.changeLanguage('si'); if (typeof localStorage !== 'undefined') localStorage.setItem('lang', 'si'); }}
              className={`px-2 py-1 rounded ${lang === 'si' ? 'bg-white/20 font-medium' : ''}`}
              aria-pressed={lang === 'si'}
              aria-label="Sinhala"
            >
              සිං
            </button>
          </div>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="hover:text-harvest-gold transition"
              aria-label={t('nav.logout')}
            >
              {t('nav.logout')} ({user.username})
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-harvest-gold transition">{t('nav.login')}</Link>
              <Link to="/register" className="hover:text-harvest-gold transition">{t('nav.register')}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;