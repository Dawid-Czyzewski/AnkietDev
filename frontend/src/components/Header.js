import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../i18n';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const changeLang = e => i18n.changeLanguage(e.target.value);

  return (
    <header className="bg-gray-900 text-gray-200 dark:bg-gray-800 shadow-md border-b border-gray-700">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="text-xl font-semibold">{t('logo')}</a>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <span className="px-2">{user.email}</span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
              >
                {t('logout')}
              </button>
              <a href="#/dashboard" className="hover:text-white">{t('dashboard')}</a>
            </>
          ) : (
            <>
              <a href="#/register" className="hover:text-white">{t('register')}</a>
              <a href="#/login" className="hover:text-white">{t('login')}</a>
            </>
          )}
          <a href="#/contact" className="hover:text-white">{t('contact')}</a>
          <a href="#/about" className="hover:text-white">{t('about')}</a>
          <select
            value={i18n.language}
            onChange={changeLang}
            className="bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="pl">{t('lang_pl')}</option>
            <option value="en">{t('lang_en')}</option>
          </select>
        </nav>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <nav className="flex flex-col px-4 py-2 space-y-2">
            {user ? (
              <>
                <span>{user.email}</span>
                <button
                  onClick={logout}
                  className="text-left hover:text-white"
                >
                  {t('logout')}
                </button>
                <a href="#/dashboard" className="hover:text-white">{t('dashboard')}</a>
              </>
            ) : (
              <>
                <a href="#/register" className="hover:text-white">{t('register')}</a>
                <a href="#/login" className="hover:text-white">{t('login')}</a>
              </>
            )}
            <a href="#/contact" className="hover:text-white">{t('contact')}</a>
            <a href="#/about" className="hover:text-white">{t('about')}</a>
            <select
              value={i18n.language}
              onChange={changeLang}
              className="bg-gray-700 text-gray-200 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="pl">{t('lang_pl')}</option>
              <option value="en">{t('lang_en')}</option>
            </select>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
