import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">{t('not_found_title', 'Page not found')}</h2>
      <p className="mb-6">{t('not_found_desc', 'Sorry, the page you are looking for does not exist.')}</p>
      <a href="#/" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium transition">{t('go_home', 'Go to Home')}</a>
    </div>
  );
};

export default NotFound;
