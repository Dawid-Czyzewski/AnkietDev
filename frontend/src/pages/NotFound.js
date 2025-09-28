import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10">
            <span className="text-6xl">🚫</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
        </div>

        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('not_found_title')}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {t('not_found_desc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden cursor-pointer"
          >
            <div className="relative z-10 flex items-center space-x-3">
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">🏠</span>
              <span className="text-white font-medium">{t('go_home')}</span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button
            onClick={() => window.history.back()}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer"
          >
            <div className="relative z-10 flex items-center space-x-3">
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">←</span>
              <span className="text-white font-medium">{t('go_back')}</span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
};

export default NotFound;
