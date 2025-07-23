import { useTranslation } from 'react-i18next';
import '../i18n';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 dark:bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          © {currentYear} AnkietDev. {t('all_rights_reserved', 'All rights reserved.')}
        </p>
        <nav className="flex space-x-4 mt-4 md:mt-0">
          <a href="#/contact" className="hover:text-white text-sm">{t('contact', 'Contact')}</a>
          <a href="#/about" className="hover:text-white text-sm">{t('about', 'About Us')}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;