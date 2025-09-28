import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Home = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative bg-gray-900 text-gray-100 overflow-hidden flex-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30"></div>
      
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)`
        }}
      ></div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center h-full py-16">

        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              AnkietDev
            </h1>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {t('hero_main')}
            </span>
          </h2>

          <p className="max-w-3xl text-lg sm:text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed">
            {t('hero_sub')}
          </p>

          <a
            href="/#/register"
            className="group relative inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden cursor-pointer text-lg font-semibold text-white"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            <div className="relative z-10 flex items-center space-x-3">
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">🚀</span>
              <span>{t('get_started')}</span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </a>
        </div>

        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('feature_fast_title')}</h3>
              <p className="text-gray-400">{t('feature_fast_desc')}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('feature_intuitive_title')}</h3>
              <p className="text-gray-400">{t('feature_intuitive_desc')}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>

          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('feature_analytics_title')}</h3>
              <p className="text-gray-400">{t('feature_analytics_desc')}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
        </div>

        <div className={`mt-16 text-center transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-gray-400 mb-6">{t('already_have_account')}</p>
          <a
            href="/#/login"
            className="group relative inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer font-medium text-gray-300 hover:text-white"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">🔑</span>
              <span>{t('login')}</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
