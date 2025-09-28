import { useTranslation } from 'react-i18next';
import '../i18n';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800/50 to-transparent"></div>
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        
        <div className="mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-lg blur-sm opacity-50"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  AnkietDev
                </h3>
                <p className="text-xs text-gray-400">{t('survey_platform')}</p>
              </div>
            </div>

            <nav className="flex items-center space-x-3">
              <a 
                href="#/contact" 
                className="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/25 overflow-hidden block"
              >
                <span className="relative z-10 text-white font-medium">{t('contact')}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              
              <a 
                href="#/about" 
                className="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-gray-500/25 overflow-hidden block"
              >
                <span className="relative z-10 text-white font-medium">{t('about')}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </nav>

            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {currentYear} AnkietDev
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('all_rights_reserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;